import test from 'node:test';
import assert from 'node:assert/strict';
import {makeReminderPlan,diffReminderPlan,auditReminderQueue,createReconcileGate} from '../../../mobile/src/services/reminderPlan.ts';
const now=Date.UTC(2026,9,22,10,0);
const sample=(id:string,minutes=20)=>({id,plannedAtISO:new Date(now+minutes*60000).toISOString(),localTime:'10:20',medicationName:'Fictício',quantity:'1',unit:'tablet'});
test('contrato futuro: modo de entrega diferente muda a assinatura (SDK 58+)',()=>{
 const [old]=makeReminderPlan([sample('a')],new Set(),now,false,40,'bestEffort');
 const [next]=makeReminderPlan([sample('a')],new Set(),now,false,40,'alarmClock');
 assert.notEqual(old.fingerprint,next.fingerprint);
 assert.deepEqual(diffReminderPlan([next],[{identifier:'n',occurrenceId:old.id,fingerprint:old.fingerprint}]).cancelIds,['n']);
});
test('diagnóstico aponta avisos faltando',()=>{
 const plan=makeReminderPlan([sample('a'),sample('b',30)],new Set(),now,false,2);
 const diag=auditReminderQueue(plan,[{identifier:'n',occurrenceId:'a',fingerprint:plan[0].fingerprint}],2);
 assert.deepEqual([diag.expected,diag.matched,diag.missing,diag.atCapacity],[2,1,1,true]);
});
test('diagnóstico detecta duplicados e obsoletos',()=>{
 const [a]=makeReminderPlan([sample('a')],new Set(),now,false);
 const q=[{identifier:'n1',occurrenceId:'a',fingerprint:a.fingerprint},{identifier:'n2',occurrenceId:'a',fingerprint:a.fingerprint},{identifier:'n3',occurrenceId:'x',fingerprint:'old'}];
 assert.equal(auditReminderQueue([a],q).obsolete,2);
});
test('alteração concorrente solicita nova passagem',async()=>{
 let release!:()=>void;const latch=new Promise<void>(resolve=>release=resolve);let calls=0;
 const gate=createReconcileGate(async()=>{calls++;if(calls===1)await latch;return calls});
 const a=gate(),b=gate();release();assert.equal(await a,2);assert.equal(await b,2);
});
test('falha deixa nova tentativa disponível',async()=>{
 let calls=0;const gate=createReconcileGate(async()=>{if(++calls===1)throw new Error('fail');return true});
 await assert.rejects(gate(),/fail/);assert.equal(await gate(),true);
});
