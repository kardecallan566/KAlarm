import test from 'node:test';
import assert from 'node:assert/strict';
import {previewOccurrences} from '../../../src/core/scheduling.ts';
import {scheduleTransitionDates} from '../../../src/core/scheduleTransitions.ts';
import {makeReminderPlan} from '../../../src/services/reminderPlan.ts';
import type {Schedule} from '../../../src/core/scheduling.ts';

test('editar hoje começa amanhã e encerra a versão anterior ontem',()=>{
 const transition=scheduleTransitionDates('2026-11-03',true);
 assert.deepEqual(transition,{startDate:'2026-11-04',previousEffectiveUntil:'2026-11-02'});
 const previous:Schedule={id:'med:v1',medicationId:'med',version:1,timezone:'America/Sao_Paulo',
  startDate:'2026-11-01',effectiveFrom:'2026-11-01',effectiveUntil:transition.previousEffectiveUntil,
  recurrence:{mode:'daily',plan:{kind:'slots',slots:[{id:'morning',time:'08:00',quantity:'1',unit:'tablet'}]}}};
 assert.equal(previewOccurrences(previous,{from:'2026-11-03',to:'2026-11-03'}).length,0);
});

test('medicamento novo mantém hoje como início da programação',()=>{
 assert.deepEqual(scheduleTransitionDates('2026-11-03',false),{startDate:'2026-11-03'});
});

test('dose de hoje às 15:30 permanece na fila quando ainda são 14:00',()=>{
 const today='2026-11-03';
 const schedule:Schedule={id:'med:v1',medicationId:'med',version:1,timezone:'America/Sao_Paulo',
  startDate:today,effectiveFrom:today,
  recurrence:{mode:'daily',plan:{kind:'slots',slots:[{id:'afternoon',time:'15:30',quantity:'1',unit:'tablet'}]}}};
 const [occurrence]=previewOccurrences(schedule,{from:today,to:today});
 assert.equal(occurrence.localDate,today);
 assert.equal(occurrence.localTime,'15:30');
 assert.equal(occurrence.plannedAtISO,'2026-11-03T18:30:00.000Z');
 const now=Date.UTC(2026,10,3,17,0); // 14:00 em America/Sao_Paulo
 const planned=makeReminderPlan([{...occurrence,medicationName:'Medicamento de teste'}],new Set(),now,false);
 assert.deepEqual(planned.map(x=>x.id),[occurrence.id]);
});
