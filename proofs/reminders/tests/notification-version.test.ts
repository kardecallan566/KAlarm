import test from 'node:test';
import assert from 'node:assert/strict';
import {makeReminderPlan,diffReminderPlan,REMINDER_CONTENT_VERSION} from '../../../src/services/reminderPlan.ts';
const event={id:'dose-1',plannedAtISO:'2026-11-03T18:30:00.000Z',localTime:'15:30',medicationName:'Medicamento',quantity:'1',unit:'tablet'};
test('formato novo invalida avisos antigos e força reagendamento',()=>{
 const now=Date.UTC(2026,10,3,17,0),[current]=makeReminderPlan([event],new Set(),now,false);
 const oldFingerprint=JSON.stringify([event.id,event.plannedAtISO,'','','15:30',false,'bestEffort']);
 assert.equal(JSON.parse(current.fingerprint)[0],REMINDER_CONTENT_VERSION);
 const diff=diffReminderPlan([current],[{identifier:'old-notification',occurrenceId:event.id,fingerprint:oldFingerprint}]);
 assert.deepEqual(diff.cancelIds,['old-notification']);assert.equal(diff.create.length,1);
});
test('trocar idioma gera fingerprint novo e atualiza avisos existentes',()=>{
 const now=Date.UTC(2026,10,3,17,0);
 const [pt]=makeReminderPlan([event],new Set(),now,false,40,'bestEffort','pt-BR');
 const [en]=makeReminderPlan([event],new Set(),now,false,40,'bestEffort','en-US');
 assert.notEqual(pt.fingerprint,en.fingerprint);
 assert.deepEqual(diffReminderPlan([en],[{identifier:'pt-notification',occurrenceId:event.id,fingerprint:pt.fingerprint}]).cancelIds,['pt-notification']);
});
