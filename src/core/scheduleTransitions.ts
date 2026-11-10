/** Date-only transition rules for medication schedules. */
function shiftDate(date:string,days:number):string{
 const [year,month,day]=date.split('-').map(Number);
 return new Date(Date.UTC(year,month-1,day+days)).toISOString().slice(0,10);
}

/** New treatments start today; edits take effect tomorrow and preserve the old schedule through today. */
export function scheduleTransitionDates(today:string,editing:boolean):{startDate:string;previousEffectiveUntil?:string}{
 return editing
  ?{startDate:shiftDate(today,1),previousEffectiveUntil:today}
  :{startDate:today};
}
