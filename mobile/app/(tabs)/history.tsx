import { Page, Panel, Heading, Body } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
export default function History(){
  return <Page title="Histórico" subtitle="Somente confirmações feitas por você.">
    <Panel><SoftCareIcon name="empty" size={76}/><Heading>Nenhuma confirmação registrada</Heading>
      <Body muted>Um aviso entregue ou dispensado nunca será considerado uma medicação tomada. O histórico será integrado após validar o armazenamento local.</Body>
    </Panel>
  </Page>;
}
