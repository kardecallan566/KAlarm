import { Page, Panel, Heading, Body } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
export default function Calendar(){
  return <Page title="Calendário" subtitle="Aqui aparecerão as doses programadas, dia por dia.">
    <Panel tone="blue"><SoftCareIcon name="weekly" size={76}/><Heading>Sem programações</Heading>
      <Body>O motor de recorrência já possui testes isolados; sua integração com esta tela e com o SQLite será feita no próximo checkpoint.</Body>
    </Panel>
  </Page>;
}
