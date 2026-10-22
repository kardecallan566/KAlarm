import { Page, Panel, Heading, Body } from '../../src/components/ui';
import { SoftCareIcon } from '../../src/components/icons/SoftCareIcon';
export default function Medicines(){
  return <Page title="Meus medicamentos" subtitle="Uma rotina de cada vez, do jeito que você precisa.">
    <Panel><SoftCareIcon name="package" size={76}/><Heading>Nenhum medicamento ainda</Heading>
      <Body muted>Estamos preparando o editor de doses por dia da semana, ciclos contínuos e múltiplos horários. Esta versão de teste não salva tratamentos.</Body>
    </Panel>
  </Page>;
}
