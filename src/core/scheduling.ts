/**
 * KAlarm scheduling proof-of-concept.
 * No clinical inference: this module only projects rules supplied by the user.
 * All examples and test quantities are fictitious.
 */

export type LocalDate = string; // Validated YYYY-MM-DD
export type LocalTime = string; // Validated HH:mm
export type Unit = 'tablet' | 'capsule' | 'drop' | 'ml' | 'other';
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Slot = {
  id: string;
  time: LocalTime;
  quantity: string; // positive decimal string with dot, <=3 decimals
  unit: Unit;
  unitLabel?: string;
};
export type DayPlan = { kind: 'no-dose' } | { kind: 'slots'; slots: Slot[] };
export type Recurrence =
  | { mode: 'daily'; plan: DayPlan }
  | { mode: 'weekdays'; weekdays: Weekday[]; plan: DayPlan }
  | { mode: 'weekly-matrix'; days: Record<Weekday, DayPlan> }
  | { mode: 'cycle'; anchorDate: LocalDate; steps: DayPlan[] }
  | { mode: 'dates'; dates: Record<string, DayPlan> };
export type Schedule = {
  id: string;
  medicationId: string;
  version: number;
  timezone: string;
  startDate: LocalDate;
  endDate?: LocalDate;
  effectiveFrom?: LocalDate;
  effectiveUntil?: LocalDate;
  recurrence: Recurrence;
  overrides?: Record<string, DayPlan>;
};
export type Occurrence = {
  id: string;
  scheduleId: string;
  medicationId: string;
  scheduleVersion: number;
  localDate: LocalDate;
  localTime: LocalTime;
  plannedAtISO: string;
  slotId: string;
  quantity: string;
  unit: Unit;
};
export type AmbiguousTimePolicy = 'reject' | 'earlier' | 'later';
export type PreviewOptions = {
  from: LocalDate;
  to: LocalDate;
  ambiguousTime?: AmbiguousTimePolicy;
};

export class ScheduleError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ScheduleError';
  }
}

function assert(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new ScheduleError(code, message);
}

export function normalizeQuantity(input: string): string {
  const value = input.trim().replace(',', '.');
  assert(/^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/.test(value), 'INVALID_QUANTITY', 'A positive decimal with up to 3 fractional digits is required');
  const [whole, fraction] = value.split('.');
  const trimmedFraction = fraction?.replace(/0+$/, '') ?? '';
  assert(Number(whole) > 0 || /[1-9]/.test(trimmedFraction), 'INVALID_QUANTITY', 'The quantity must be positive');
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

export function parseLocalDate(value: LocalDate): { year: number; month: number; day: number; dayIndex: number } {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(value), 'INVALID_DATE', `Date must be YYYY-MM-DD: ${value}`);
  const [year, month, day] = value.split('-').map(Number);
  assert(year >= 1900 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= 31, 'INVALID_DATE', `Invalid date: ${value}`);
  const ms = Date.UTC(year, month - 1, day);
  const actual = new Date(ms);
  assert(actual.getUTCFullYear() === year && actual.getUTCMonth() + 1 === month && actual.getUTCDate() === day, 'INVALID_DATE', `Nonexistent date: ${value}`);
  return { year, month, day, dayIndex: Math.round(ms / 86_400_000) };
}

export function parseLocalTime(value: LocalTime): { hours: number; minutes: number } {
  assert(/^\d{2}:\d{2}$/.test(value), 'INVALID_TIME', `Time must be HH:mm: ${value}`);
  const [hours, minutes] = value.split(':').map(Number);
  assert(hours <= 23 && minutes <= 59, 'INVALID_TIME', `Invalid time: ${value}`);
  return { hours, minutes };
}

export function differenceInCalendarDays(date: LocalDate, anchorDate: LocalDate): number {
  return parseLocalDate(date).dayIndex - parseLocalDate(anchorDate).dayIndex;
}

export function isoWeekday(date: LocalDate): Weekday {
  const index = parseLocalDate(date).dayIndex;
  return (((index + 3) % 7 + 7) % 7 + 1) as Weekday;
}

function validateTimeZone(zone: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat('en-US-u-nu-latn', {
      timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  } catch {
    throw new ScheduleError('INVALID_TIMEZONE', `Unsupported time zone: ${zone}`);
  }
}

function partsAt(formatter: Intl.DateTimeFormat, time: number) {
  const vals = Object.fromEntries(formatter.formatToParts(new Date(time)).filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
  return { y: vals.year, m: vals.month, d: vals.day, h: vals.hour, min: vals.minute, s: vals.second };
}

/**
 * Resolve a wall-clock date/time in an IANA zone. Detect DST gaps and ambiguous
 * overlap times instead of silently moving or duplicating a medication reminder.
 */
export function resolveLocalDateTime(date: LocalDate, time: LocalTime, zone: string, ambiguous: AmbiguousTimePolicy = 'reject'): string {
  const { year, month, day } = parseLocalDate(date);
  const { hours, minutes } = parseLocalTime(time);
  const f = validateTimeZone(zone);
  const wallTime = Date.UTC(year, month - 1, day, hours, minutes);
  const offsetSet = new Set<number>();
  for (const shift of [-48, -24, -12, 0, 12, 24, 48]) {
    const instant = wallTime + shift * 3_600_000;
    const p = partsAt(f, instant);
    const reconstructed = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s);
    offsetSet.add(reconstructed - instant);
  }
  const matches = [...offsetSet].map(offset => wallTime - offset).filter(candidate => {
    const p = partsAt(f, candidate);
    return p.y === year && p.m === month && p.d === day && p.h === hours && p.min === minutes;
  }).sort((a, b) => a - b);
  assert(matches.length > 0, 'NONEXISTENT_LOCAL_TIME', `${date} ${time} does not exist in ${zone} (DST gap)`);
  if (matches.length > 1) {
    assert(ambiguous !== 'reject', 'AMBIGUOUS_LOCAL_TIME', `${date} ${time} has two possible instants in ${zone}`);
    return new Date(ambiguous === 'earlier' ? matches[0] : matches[matches.length - 1]).toISOString();
  }
  return new Date(matches[0]).toISOString();
}

function isDayPlan(value: unknown): value is DayPlan {
  return value !== null && typeof value === 'object' && ((value as DayPlan).kind === 'no-dose' || (value as DayPlan).kind === 'slots');
}

function validatePlan(plan: DayPlan): void {
  assert(isDayPlan(plan), 'INVALID_PLAN', 'A day plan must be explicit');
  if (plan.kind === 'no-dose') return;
  assert(Array.isArray(plan.slots), 'INVALID_PLAN', 'Slots must be an array');
  assert(plan.slots.length > 0, 'EMPTY_SLOTS', 'Use no-dose rather than an empty slots list');
  const seen = new Set<string>();
  for (const slot of plan.slots) {
    assert(typeof slot.id === 'string' && slot.id.length > 0 && !seen.has(slot.id), 'DUPLICATE_SLOT_ID', 'Each day must have unique slot IDs');
    seen.add(slot.id);
    parseLocalTime(slot.time);
    normalizeQuantity(slot.quantity);
    assert(['tablet', 'capsule', 'drop', 'ml', 'other'].includes(slot.unit), 'INVALID_UNIT', 'Unsupported unit');
    if (slot.unit === 'other') assert(Boolean(slot.unitLabel?.trim()), 'UNIT_LABEL_REQUIRED', 'Other units need an explicit label');
  }
}

function selectPlan(schedule: Schedule, date: LocalDate): DayPlan {
  const override = schedule.overrides?.[date];
  if (override !== undefined) return override;
  const r = schedule.recurrence;
  switch (r.mode) {
    case 'daily': return r.plan;
    case 'weekdays': return r.weekdays.includes(isoWeekday(date)) ? r.plan : { kind: 'no-dose' };
    case 'weekly-matrix': return r.days[isoWeekday(date)];
    case 'cycle': {
      const idx = ((differenceInCalendarDays(date, r.anchorDate) % r.steps.length) + r.steps.length) % r.steps.length;
      return r.steps[idx];
    }
    case 'dates': return r.dates[date] ?? { kind: 'no-dose' };
  }
}

function validateSchedule(s: Schedule): void {
  assert(Boolean(s.id && s.medicationId && Number.isSafeInteger(s.version) && s.version > 0), 'INVALID_SCHEDULE', 'Schedule ID, medication ID and positive version required');
  parseLocalDate(s.startDate);
  if (s.endDate) { parseLocalDate(s.endDate); assert(s.endDate >= s.startDate, 'INVALID_RANGE', 'End date precedes start date'); }
  if (s.effectiveFrom) parseLocalDate(s.effectiveFrom);
  if (s.effectiveUntil) parseLocalDate(s.effectiveUntil);
  if (s.effectiveUntil && s.effectiveFrom) assert(s.effectiveUntil >= s.effectiveFrom, 'INVALID_RANGE', 'Effective end precedes effective start');
  validateTimeZone(s.timezone);
  const r = s.recurrence;
  switch (r.mode) {
    case 'daily': validatePlan(r.plan); break;
    case 'weekdays':
      assert(Array.isArray(r.weekdays) && r.weekdays.length > 0 && new Set(r.weekdays).size === r.weekdays.length && r.weekdays.every(d => Number.isInteger(d) && d >= 1 && d <= 7), 'INVALID_WEEKDAYS', 'Select unique weekdays 1 to 7');
      validatePlan(r.plan); break;
    case 'weekly-matrix':
      for (let d = 1; d <= 7; d++) validatePlan(r.days[d as Weekday]);
      break;
    case 'cycle':
      parseLocalDate(r.anchorDate);
      assert(r.anchorDate <= s.startDate, 'INVALID_ANCHOR', 'Anchor must be on or before the schedule start');
      assert(r.steps.length > 0 && r.steps.length <= 365, 'INVALID_CYCLE', 'Cycle must have 1 to 365 steps');
      r.steps.forEach(validatePlan); break;
    case 'dates':
      for (const [date, plan] of Object.entries(r.dates)) { parseLocalDate(date); validatePlan(plan); }
      break;
    default: throw new ScheduleError('INVALID_MODE', 'Unknown recurrence type');
  }
  for (const [date, plan] of Object.entries(s.overrides ?? {})) { parseLocalDate(date); validatePlan(plan); }
}

/** Inclusive date window. Multiple calls with the same input return the same IDs. */
export function previewOccurrences(schedule: Schedule, options: PreviewOptions): Occurrence[] {
  validateSchedule(schedule);
  const from = parseLocalDate(options.from).dayIndex;
  const to = parseLocalDate(options.to).dayIndex;
  assert(to >= from && to - from <= 370, 'INVALID_WINDOW', 'Preview window must be non-negative and <=371 dates');
  const result: Occurrence[] = [];
  for (let index = from; index <= to; index++) {
    const date = new Date(index * 86_400_000).toISOString().slice(0, 10);
    if (date < schedule.startDate || date > (schedule.endDate ?? '9999-12-31') || date < (schedule.effectiveFrom ?? schedule.startDate) || date > (schedule.effectiveUntil ?? '9999-12-31')) continue;
    const plan = selectPlan(schedule, date);
    validatePlan(plan);
    if (plan.kind === 'no-dose') continue;
    for (const slot of plan.slots) {
      result.push({
        id: `${schedule.id}:v${schedule.version}:${date}:${slot.id}`,
        scheduleId: schedule.id,
        medicationId: schedule.medicationId,
        scheduleVersion: schedule.version,
        localDate: date,
        localTime: slot.time,
        plannedAtISO: resolveLocalDateTime(date, slot.time, schedule.timezone, options.ambiguousTime ?? 'reject'),
        slotId: slot.id,
        quantity: normalizeQuantity(slot.quantity),
        unit: slot.unit
      });
    }
  }
  return result.sort((a, b) => a.plannedAtISO.localeCompare(b.plannedAtISO) || a.id.localeCompare(b.id));
}
