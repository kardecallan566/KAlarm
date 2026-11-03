export type MedicationNotificationEvent={
  medicationName:string;
  quantity:string;
  unit:string;
  localTime:string;
};

function notificationQuantity(quantity:string,unit:string):string{
 const units:Record<string,[string,string]>={tablet:['comprimido','comprimidos'],capsule:['cápsula','cápsulas'],drop:['gota','gotas'],ml:['mL','mL'],other:['unidade','unidades']};
 const pair=units[unit]??units.other;
 return `${quantity.replace('.',',')} ${quantity==='1'?pair[0]:pair[1]}`;
}

/** Compose concise, Android-friendly notification text without recording a dose. */
export function formatMedicationNotification(event:MedicationNotificationEvent,showDetails:boolean):{title:string;body:string}{
 if(showDetails){
  return {
   title:`KAlarm · ${event.medicationName}`,
   body:`Dose: ${notificationQuantity(event.quantity,event.unit)} | Horário: ${event.localTime}`,
  };
 }
 return {
  title:'KAlarm · Hora do medicamento',
  body:`Aviso às ${event.localTime}. Abra o KAlarm para consultar a dose.`,
 };
}
