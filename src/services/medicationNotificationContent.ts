import {readableQuantity} from '../core/dates';

export type MedicationNotificationEvent={
  medicationName:string;
  quantity:string;
  unit:string;
  localTime:string;
};

/** Compose concise, Android-friendly notification text without recording a dose. */
export function formatMedicationNotification(event:MedicationNotificationEvent,showDetails:boolean):{title:string;body:string}{
  if(showDetails){
    return {
      title:`KAlarm · ${event.medicationName}`,
      body:`Dose: ${readableQuantity(event.quantity,event.unit)} | Horário: ${event.localTime}`,
    };
  }
  return {
    title:'KAlarm · Hora do medicamento',
    body:`Aviso às ${event.localTime}. Abra o KAlarm para consultar a dose.`,
  };
}
