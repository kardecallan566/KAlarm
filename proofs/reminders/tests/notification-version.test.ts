import test from 'node:test';
import assert from 'node:assert/strict';
import {makeReminderPlan,diffReminderPlan,REMINDER_CONTENT_VERSION} from '../../../src/services/reminderPlan.ts';

test('formato novo invalida avisos antigos e força reagendamento',()=>{
 const now=Date.UTC(2026,10,3,17,0);
 const event={id:'dose-1',plannedAtISO:'2026-11-03T18:30:00.000Z',localTime:'15:30',medicationName:'Medicamento',quantity:'1',unit:'tablet'};
 const [current]=makeReminderPlan([event],new Set(),now,false);
 const oldFingerprint=JSON.stringify([event.id,event.plannedAtISO,'','','15:30',false,'bestEffort']);
 assert.equal(JSON.parse(current.fingerprint)[0],REMINDER_CONTENT_VERSION);
 const diff=diffReminderPlan([current],[{identifier:'old-notification',occurrenceId:event.id,fingerprint:oldFingerprint}]);
 assert.deepEqual(diff.cancelIds,['old-notification']);
 assert.equal(diff.create.length,1);
});
