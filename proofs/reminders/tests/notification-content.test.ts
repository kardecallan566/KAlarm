import test from 'node:test';
import assert from 'node:assert/strict';
import {formatMedicationNotification} from '../../../src/services/medicationNotificationContent.ts';
const event={medicationName:'Medicamento fictício',quantity:'1',unit:'tablet',localTime:'15:30'};
test('aviso discreto em português mostra horário sem expor medicamento ou dose',()=>{
 const message=formatMedicationNotification(event,false,'pt-BR');
 assert.equal(message.title,'KAlarm · Hora do medicamento');assert.match(message.body,/15:30/);assert.doesNotMatch(message.body,/Medicamento fictício|comprimido/);
});
test('aviso detalhado em português separa nome, dose e horário',()=>{
 const message=formatMedicationNotification(event,true,'pt-BR');
 assert.equal(message.title,'KAlarm · Medicamento fictício');assert.equal(message.body,'Dose: 1 comprimido\nHorário: 15:30');
});
test('aviso discreto em inglês mantém privacidade e traduz o texto',()=>{
 const message=formatMedicationNotification(event,false,'en-US');
 assert.equal(message.title,'KAlarm · Medication time');assert.equal(message.body,'It\'s time for your dose (15:30).\nOpen KAlarm to view details.');assert.doesNotMatch(message.body,/Medicamento fictício|tablet/);
});
test('aviso detalhado em inglês traduz dose e horário',()=>{
 const message=formatMedicationNotification(event,true,'en-US');
 assert.equal(message.body,'Dose: 1 tablet\nTime: 15:30');
});
