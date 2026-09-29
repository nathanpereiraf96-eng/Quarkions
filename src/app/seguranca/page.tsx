import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Bloco } from "@/components/layout/Bloco";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Acordeao } from "@/components/ui/Acordeao";

export const metadata: Metadata = metadados({
  titulo: "Segurança e LGPD | Quarkions",
  descricao:
    "Supervisão humana, acesso mínimo, registro de eventos e tratamento de dados conforme a LGPD.",
  caminho: "/seguranca",
});

const DOCUMENTOS = [
  ["Contrato de serviços", "Define o que a Quarkions entrega, as responsabilidades de cada parte e as condições comerciais."],
  ["Escopo do piloto", "Lista os fluxos, integrações, exclusões, prazo e o indicador de sucesso combinados."],
  ["Acordo de tratamento de dados (LGPD)", "Formaliza os papéis de controlador e operador, as finalidades, a retenção e os subprocessadores."],
  ["Níveis de serviço", "Estabelece disponibilidade, prazos de resposta e como os incidentes são tratados."],
  ["Anexo de segurança", "Descreve controles de acesso, guarda de credenciais, registro de eventos e backups."],
  ["Regras de uso da IA e supervisão humana", "Deixa claro o que o agente pode e não pode fazer e quando uma pessoa assume."],
  ["Controle de mudanças", "Explica como alterações no agente são pedidas, testadas, aprovadas e revertidas."],
  ["Encerramento e devolução de dados", "Detalha a exportação dos dados, a revogação de acessos e o descarte ao fim do contrato."],
];

export default function Seguranca() {
  return (
    <>
      <PageHero
        titulo="Segurança, privacidade e supervisão humana"
        lead="A Quarkions lida com conversas, dados de contato e informações da sua operação. Por isso, segurança faz parte da implantação desde o primeiro dia."
      />

      <div className="bg-nevoa pb-[clamp(80px,10vw,140px)]">
        <Container>
          <Bloco id="limites" titulo="O que a ISIS não faz" marcador="ambar">
            <p>Não faz diagnóstico nem dá orientação clínica.</p>
            <p>Não promete tratamento, resultado ou preço fechado sem avaliação.</p>
            <p>
              Não trata reclamações nem pedidos sensíveis: passa a conversa para uma pessoa da sua
              equipe, com o histórico completo.
            </p>
          </Bloco>

          <Bloco id="acesso-minimo" titulo="Acesso mínimo">
            <p>
              Cada integração recebe só as permissões necessárias para funcionar. As credenciais
              são separadas por cliente e guardadas em cofre seguro — nunca em planilhas ou
              mensagens.
            </p>
          </Bloco>

          <Bloco id="registro" titulo="Registro de tudo que importa">
            <p>
              Eventos, mudanças de configuração e passagens para humanos ficam registrados, para
              que qualquer situação possa ser auditada depois.
            </p>
          </Bloco>

          <Bloco id="mudancas-testadas" titulo="Mudanças testadas">
            <p>
              Toda alteração no agente tem versão, responsável e teste antes de ir ao ar. Se algo
              não se comportar como esperado, dá para voltar à versão anterior.
            </p>
          </Bloco>

          <Bloco id="lgpd" titulo="LGPD">
            <p>
              Coletamos o mínimo necessário, com finalidade definida e retenção combinada. A lista
              de subprocessadores e os papéis de controlador e operador ficam formalizados em
              contrato, no acordo de tratamento de dados.
            </p>
          </Bloco>

          <Bloco id="canais-oficiais" titulo="Canais oficiais">
            <p>
              Usamos os canais oficiais de mensageria e seguimos as regras de consentimento de cada
              um.
            </p>
          </Bloco>

          <Bloco id="incidentes" titulo="Se algo sair do esperado">
            <p>
              Existe um processo de incidentes com responsável definido, comunicação com a sua
              equipe e correção da causa. Quando necessário, o agente é desligado na hora.
            </p>
          </Bloco>

          <section
            id="documentos"
            aria-labelledby="documentos-titulo"
            className="grid-site gap-y-6 border-t border-linha pt-12 md:pt-16"
          >
            <h2 id="documentos-titulo" className="col-span-12 text-h3 md:col-span-4">
              Documentos que acompanham o contrato
            </h2>
            <div className="col-span-12 md:col-span-8">
              <Acordeao itens={DOCUMENTOS.map(([titulo, conteudo]) => ({ titulo, conteudo }))} />
              <p className="mt-6 text-small text-grafite-suave">
                Os documentos contratuais são revisados juridicamente e ajustados às regras do
                setor de cada cliente.
              </p>
            </div>
          </section>
        </Container>
      </div>

      <CtaFinal />
    </>
  );
}
