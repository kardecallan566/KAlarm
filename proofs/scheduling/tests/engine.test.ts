import test from 'node:test';
import assert from 'node:assert/strict';
import { previewOccurrences, normalizeQuantity, differenceInCalendarDays, isoWeekday, resolveLocalDateTime, ScheduleError } from '../src/engine.ts';
import type { Schedule, DayPlan, Slot, Weekday } from '../src/engine.ts';

const slot=(quantity:string,time='08:00',id='morning'):Slot=>({id,time,quantity,unit:'tablet'});
const plan=(...slots:Slot[]):DayPlan=>slots.length?{kind:'slots',slots}:{kind:'no-dose'};
const base=(recurrence:Schedule['recurrence'], changes:Partial<Schedule>={}):Schedule=>({
  id:'sched-1',medicationId:'med-1',version:1,timezone:'America/Sao_Paulo',
  startDate:'2026-11-01',recurrence,...changes
});
const preview=(s:Schedule,from='2026-11-01',to='2026-11-14')=>previewOccurrences(s,{from,to});
const catches=(fn:()=>unknown,code:string)=>assert.throws(fn,(e:unknown)=>e instanceof ScheduleError && e.code===code);

test('fixed daily plan generates one occurrence per date, in local 08:00',()=>{
  const out=preview(base({mode:'daily',plan:plan(slot('1'))}),'2026-11-01','2026-11-03');
  assert.equal(out.length,3); assert.deepEqual(out.map(x=>x.quantity),['1','1','1']);
  assert.equal(out[0].plannedAtISO,'2026-11-01T11:00:00.000Z');
});
test('selected weekdays create events only on configured days',()=>{
  const out=preview(base({mode:'weekdays',weekdays:[1,3,5],plan:plan(slot('1'))}),'2026-11-01','2026-11-07');
  assert.deepEqual(out.map(x=>x.localDate),['2026-11-02','2026-11-04','2026-11-06']);
});
test('weekly matrix restarts Mondays, supports no-dose on Sunday',()=>{
  const amounts=['1','2','3','4','1','2'];
  const days={} as Record<Weekday,DayPlan>;
  for(let i=1;i<=7;i++)days[i as Weekday]=i===7?plan():plan(slot(amounts[i-1]));
  const out=preview(base({mode:'weekly-matrix',days}),'2026-11-02','2026-11-09');
  assert.equal(out.length,7);
  assert.deepEqual(out.map(x=>x.quantity),['1','2','3','4','1','2','1']);
});
test('two-step continuous cycle does not reset on Monday',()=>{
  const out=preview(base({mode:'cycle',anchorDate:'2026-11-01',steps:[plan(slot('1')),plan(slot('2'))]}),'2026-11-07','2026-11-10');
  assert.deepEqual(out.map(x=>x.quantity),['1','2','1','2']);
});
test('four-step cycle remains anchored across weeks',()=>{
  const steps=['1','2','3','4'].map(v=>plan(slot(v)));
  const out=preview(base({mode:'cycle',anchorDate:'2026-11-01',steps}),'2026-11-08','2026-11-11');
  assert.deepEqual(out.map(x=>x.quantity),['4','1','2','3']);
});
test('separate slots can use multiple hours on the same day',()=>{
  const out=preview(base({mode:'daily',plan:plan(slot('1','08:00','a'),slot('2','20:00','b'))}),'2026-11-01','2026-11-01');
  assert.deepEqual(out.map(x=>x.localTime),['08:00','20:00']);assert.equal(out[1].quantity,'2');
});
test('date override wins for one date without shifting the cycle',()=>{
  const s=base({mode:'cycle',anchorDate:'2026-11-01',steps:[plan(slot('1')),plan(slot('2'))]},
    {overrides:{'2026-11-02':plan(slot('3'))}});
  const out=preview(s,'2026-11-01','2026-11-03');
  assert.deepEqual(out.map(x=>x.quantity),['1','3','1']);
});
test('a no-dose override removes only one day',()=>{
  const s=base({mode:'daily',plan:plan(slot('1'))},{overrides:{'2026-11-02':plan()}});
  assert.deepEqual(preview(s,'2026-11-01','2026-11-03').map(x=>x.localDate),['2026-11-01','2026-11-03']);
});
test('schedule effective date and end date are inclusive',()=>{
  const s=base({mode:'daily',plan:plan(slot('1'))},{endDate:'2026-11-07',effectiveFrom:'2026-11-05'});
  assert.deepEqual(preview(s,'2026-11-01','2026-11-10').map(x=>x.localDate),['2026-11-05','2026-11-06','2026-11-07']);
});
test('quantities normalize Brazilian decimal input without floating arithmetic',()=>{
  assert.equal(normalizeQuantity('0,50'),'0.5');assert.equal(normalizeQuantity('2.500'),'2.5');
  catches(()=>normalizeQuantity('0'),'INVALID_QUANTITY');catches(()=>normalizeQuantity('1e3'),'INVALID_QUANTITY');
  catches(()=>normalizeQuantity('-1'),'INVALID_QUANTITY');
});
test('invalid local dates rejected; leap day and year boundary are correct',()=>{
  catches(()=>differenceInCalendarDays('2025-02-29','2025-02-01'),'INVALID_DATE');
  assert.equal(differenceInCalendarDays('2028-03-01','2028-02-28'),2);
  assert.equal(differenceInCalendarDays('2027-01-01','2026-12-31'),1);
});
test('weekday ISO mapping always begins Monday=1',()=>{
  assert.equal(isoWeekday('2026-11-01'),7);assert.equal(isoWeekday('2026-11-02'),1);
});
test('UTC offsets are calculated from named timezone',()=>{
  assert.equal(resolveLocalDateTime('2026-11-01','08:00','America/Sao_Paulo'),'2026-11-01T11:00:00.000Z');
});
test('DST spring gap is rejected rather than silently shifting a reminder',()=>{
  catches(()=>resolveLocalDateTime('2026-03-08','02:30','America/New_York'),'NONEXISTENT_LOCAL_TIME');
});
test('DST fall overlap must be explicit; earlier and later differ 60 minutes',()=>{
  catches(()=>resolveLocalDateTime('2026-11-01','01:30','America/New_York'),'AMBIGUOUS_LOCAL_TIME');
  assert.equal(resolveLocalDateTime('2026-11-01','01:30','America/New_York','earlier'),'2026-11-01T05:30:00.000Z');
  assert.equal(resolveLocalDateTime('2026-11-01','01:30','America/New_York','later'),'2026-11-01T06:30:00.000Z');
});
test('same schedule preview twice produces stable IDs (idempotence)',()=>{
  const s=base({mode:'daily',plan:plan(slot('1'))});
  assert.deepEqual(preview(s),preview(s));
});
test('duplicate slot IDs do not silently merge occurrences',()=>{
  const s=base({mode:'daily',plan:plan(slot('1','08:00','same'),slot('2','20:00','same'))});
  catches(()=>preview(s),'DUPLICATE_SLOT_ID');
});
test('a date plan generates only exact programmed dates',()=>{
  const s=base({mode:'dates',dates:{'2026-11-02':plan(slot('1')),'2026-11-11':plan(slot('2'))}});
  assert.deepEqual(preview(s).map(x=>x.localDate),['2026-11-02','2026-11-11']);
});
test('preview window cannot exceed safety bound',()=>{
  const s=base({mode:'daily',plan:plan(slot('1'))});
  catches(()=>preview(s,'2026-01-01','2028-01-01'),'INVALID_WINDOW');
});

test('a multi-day cycle may contain a day without medication',()=>{
  const s=base({mode:'cycle',anchorDate:'2026-11-01',steps:[plan(slot('1')),plan(),plan(slot('2','20:00'))]});
  const out=preview(s,'2026-11-01','2026-11-06');
  assert.deepEqual(out.map(x=>x.localDate),['2026-11-01','2026-11-03','2026-11-04','2026-11-06']);
});
test('invalid timezone is rejected before producing occurrences',()=>{
  catches(()=>preview(base({mode:'daily',plan:plan(slot('1'))},{timezone:'Mars/Olympus_Mons'})),'INVALID_TIMEZONE');
});
test('effective range cannot end before it begins',()=>{
  catches(()=>preview(base({mode:'daily',plan:plan(slot('1'))},{effectiveFrom:'2026-11-07',effectiveUntil:'2026-11-06'})),'INVALID_RANGE');
});
test('February leap date and new-month cycle alignment',()=>{
  const s=base({mode:'cycle',anchorDate:'2028-02-27',steps:[plan(slot('1')),plan(slot('2')),plan(slot('3'))]}, {startDate:'2028-02-27'});
  const out=preview(s,'2028-02-27','2028-03-02');
  assert.deepEqual(out.map(x=>x.quantity),['1','2','3','1','2']);
});
