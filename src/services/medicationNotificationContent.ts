import type {AppLanguage} from '../data/appPreferences';
export type MedicationNotificationEvent={medicationName:string;quantity:string;unit:string;localTime:string};
function notificationQuantity(quantity:string,unit:string,language:AppLanguage):string{
 const units:Record<string,{pt:[string,string];en:[string,string]}>={
  tablet:{pt:['comprimido','comprimidos'],en:['tablet','tablets']},
  capsule:{pt:['cápsula','cápsulas'],en:['capsule','capsules']},
  drop:{pt:['gota','gotas'],en:['drop','drops']},
  ml:{pt:['mL','mL'],en:['mL','mL']},
  other:{pt:['unidade','unidades'],en:['unit','units']}
 };
 const pair=(units[unit]??units.other)[language==='pt-BR'?'pt':'en'];
 const amount=language==='pt-BR'?quantity.replace('.',','):quantity.replace(',','.');
 return `${amount} ${quantity==='1'?pair[0]:pair[1]}`;
}
/** Compose readable alerts; private mode never exposes medicine or dose. */
export function formatMedicationNotification(event:MedicationNotificationEvent,showDetails:boolean,language:AppLanguage='pt-BR'):{title:string;body:string}{
 if(showDetails)return {title:`KAlarm · ${event.medicationName}`,body:language==='pt-BR'? `Dose: ${notificationQuantity(event.quantity,event.unit,language)} | Horário: ${event.localTime}`:`Dose: ${notificationQuantity(event.quantity,event.unit,language)} | Time: ${event.localTime}`};
 return language==='pt-BR'
  ?{title:'KAlarm · Hora do medicamento',body:`Aviso às ${event.localTime}. Abra o KAlarm para consultar a dose.`}
  :{title:'KAlarm · Medication time',body:`Alert at ${event.localTime}. Open KAlarm to view the dose.`};
}
