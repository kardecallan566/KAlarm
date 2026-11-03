import type { Schedule, Occurrence } from './scheduling';
import { previewOccurrences, parseLocalDate } from './scheduling';

export function deviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}
export function localToday(zone = deviceTimezone(), date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const values = Object.fromEntries(parts.filter(p=>p.type !== 'literal').map(p=>[p.type,p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
export function offsetDate(localDate:string, days:number):string {
  const parsed = parseLocalDate(localDate);
  return new Date(Date.UTC(parsed.year,parsed.month-1,parsed.day + days)).toISOString().slice(0,10);
}
export function formatDay(localDate:string):string {
  const {year,month,day}=parseLocalDate(localDate);
  return new Intl.DateTimeFormat('pt-BR', {weekday:'short',day:'2-digit',month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,day)));
}
export function readableQuantity(quantity:string, unit:string):string {
  const units:Record<string,[string,string]>={tablet:['comprimido','comprimidos'],capsule:['cápsula','cápsulas'],drop:['gota','gotas'],ml:['mL','mL'],other:['unidade','unidades']};
  const pair=units[unit]??units.other;
  return `${quantity.replace('.',',')} ${quantity==='1'?pair[0]:pair[1]}`;
}
export function previewWindow(schedule: Schedule, from:string, to:string): Occurrence[] {
  return previewOccurrences(schedule,{from,to,ambiguousTime:'reject'});
}
