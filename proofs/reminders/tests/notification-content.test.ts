import test from 'node:test';
import assert from 'node:assert/strict';
import {formatMedicationNotification} from '../../../src/services/medicationNotificationContent.ts';

const event={medicationName:'Medicamento fictício',quantity:'1',unit:'tablet',localTime:'15:30'};

test('aviso discreto mostra horário sem expor medicamento ou dose',()=>{
 const message=formatMedicationNotification(event,false);
 assert.equal(message.title,'KAlarm · Hora do medicamento');
 assert.match(message.body,/15:30/);
 assert.doesNotMatch(message.body,/Medicamento fictício|comprimido/);
});

test('aviso detalhado separa nome, dose e horário em título e corpo',()=>{
 const message=formatMedicationNotification(event,true);
 assert.equal(message.title,'KAlarm · Medicamento fictício');
 assert.equal(message.body,'Dose: 1 comprimido | Horário: 15:30');
});
