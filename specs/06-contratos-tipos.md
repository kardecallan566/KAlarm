# 06 — Contratos de domínio (TypeScript ilustrativo)

Estas interfaces são **propostas de implementação, não código compilado**. Servirão como contrato inicial entre editor, banco de dados, motor e notificações.

```ts
type ID = string;
type LocalDate = string; // YYYY-MM-DD, validado e interpretado no timezone da rotina
type LocalTime = string; // HH:mm (24h)
type DecimalString = string; // "0.5", "2.5"; >= 0, positivo para dose

type Unit = 'tablet' | 'capsule' | 'drop' | 'ml' | 'other';
type Mode = 'daily' | 'weekdays' | 'weekly-matrix' | 'cycle' | 'dates';
type Slot = {
  slotId: ID;
  localTime: LocalTime;
  quantity: DecimalString; // > 0, unidade separada
  unit: Unit;
  unitLabel?: string; // somente se unit='other'
};
type DayPlan = { kind: 'no-dose' } | { kind: 'slots'; slots: Slot[] };

type Recurrence =
  | { mode:'daily'; plan:DayPlan }
  | { mode:'weekdays'; weekdays:number[]; plan:DayPlan }
  | { mode:'weekly-matrix'; days:Record<1|2|3|4|5|6|7,DayPlan> }
  | { mode:'cycle'; anchorDate:LocalDate; steps:DayPlan[] }
  | { mode:'dates'; dates:Record<LocalDate,DayPlan> };

type ScheduleVersion = {
  id:ID; medicationId:ID; revision:number;
  startDate:LocalDate; endDate?:LocalDate;
  timezone:string; recurrence:Recurrence;
  effectiveFrom:LocalDate; effectiveUntil?:LocalDate;
};
type DateOverride = { scheduleId:ID; localDate:LocalDate; plan:DayPlan; revision:number };
type Occurrence = {
  id:ID; scheduleVersionId:ID; medicationId:ID;
  localDate:LocalDate; localTime:LocalTime; plannedAtISO:string;
  quantitySnapshot:DecimalString; unitSnapshot:Unit; slotId:ID;
};
type IntakeEvent = {
  id:ID; occurrenceId:ID;
  kind:'confirmed' | 'confirmation-reverted' | 'snoozed' | 'explicitly-skipped';
  eventAtISO:string; actualTakenAtISO?:string; source:'app'|'notification';
};
```

## Contratos dos serviços

```ts
interface SchedulingEngine {
  preview(schedule: ScheduleVersion, overrides: DateOverride[],
    window: {from: LocalDate; to: LocalDate}): Occurrence[];
}
interface MedicationRepository {
  saveScheduleRevision(input: ScheduleVersion, overrides: DateOverride[]): Promise<void>;
  listMedications(): Promise<unknown[]>;
  listOccurrences(fromISO: string, toISO: string): Promise<Occurrence[]>;
  appendIntakeEvent(event: IntakeEvent): Promise<void>;
}
interface NotificationReconciler {
  reconcile(nowISO: string): Promise<{
    scheduled: number; cancelled: number; warnings: string[]
  }>;
}
```

**Não armazenar número em ponto flutuante sem controle de precisão.** IDs devem ser gerados usando dados estáveis e técnica testada. Tipo não é validação: Zod/esquemas e SQL CHECK devem conferir as invariantes efetivas.

## Estados distintos

- O calendário é projeção da regra/versão, não dado clínico observado.
- O histórico de usuário contém atos de confirmação ou correção, não prova farmacológica.
- O status de entrega (planejado, programado no SO, entregue, desconhecido, cancelado) não se confunde com o status da tomada.
- Recorrência se resolve por data; notificação representa um disparo e pode falhar, atrasar ou duplicar.
