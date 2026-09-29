import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Bloco } from "@/components/layout/Bloco";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
// import { Equipe } from "@/components/sobre/Equipe"; // ativar quando houver fotos reais

export const metadata: Metadata = metadados({
  titulo: "Sobre a Quarkions",
  descricao:
    "Implantamos agentes de IA na operação de clínicas, com escopo claro, testes antes de ir ao ar e medição toda semana.",
  caminho: "/sobre",
});

const PRINCIPIOS = [
  {
    titulo: "Resultado antes de tecnologia",
    texto:
      "O sucesso é medido no indicador da clínica, não na quantidade de mensagens enviadas.",
  },
  {
    titulo: "Escopo claro",
    texto: "Cada piloto tem entrega, prazo, indicador e preço definidos antes de começar.",
  },
  {
    titulo: "Pessoas no centro",
    texto: "A IA assume o repetitivo. Decisões e exceções ficam com a sua equipe.",
  },
  {
    titulo: "Construímos o que se prova",
    texto: "Só transformamos em produto o que se repete e gera valor em muitas clínicas.",
  },
];

export default function Sobre() {
  return (
    <>
      <PageHero
        titulo="Implantar bem é o que fazemos."
        lead="A Quarkions implanta agentes de IA na operação de clínicas. Cada fluxo tem escopo definido, é testado antes de ir ao ar e acompanhado toda semana."
      />

      <div className="bg-nevoa pb-[clamp(80px,10vw,140px)]">
        <Container>
          <Bloco id="por-que" titulo="Por que existimos">
            <p>
              Clínicas não perdem pacientes por falta de procura. Perdem pelo tempo entre o
              contato e a resposta, pelo follow-up que não acontece e pela sobrecarga de uma
              recepção que precisa atender quem está na sala e quem está no WhatsApp ao mesmo
              tempo.
            </p>
            <p>
              A tecnologia para resolver isso já existe. O que falta é implantá-la bem: com
              processo, medição e alguém responsável pelo resultado.
            </p>
          </Bloco>

          <section
            id="como-pensamos"
            aria-labelledby="como-pensamos-titulo"
            className="grid-site gap-y-4 border-t border-linha py-12 md:py-16"
          >
            <h2 id="como-pensamos-titulo" className="col-span-12 text-h3 md:col-span-4">
              Como pensamos
            </h2>
            <ul className="col-span-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 md:col-span-8">
              {PRINCIPIOS.map((p) => (
                <li key={p.titulo}>
                  <h3 className="text-h3">{p.titulo}</h3>
                  <p className="mt-2 text-lead text-grafite-suave">{p.texto}</p>
                </li>
              ))}
            </ul>
          </section>

          <Bloco id="crescendo" titulo="A equipe da ISIS está crescendo">
            <p>
              A ISIS é o nosso primeiro agente. Novos agentes, para a recepção e para o
              relacionamento depois do atendimento, estão sendo desenvolvidos junto com clínicas
              parceiras — e só chegam ao site quando estiverem provados na operação.
            </p>
          </Bloco>

          {/* <Equipe /> */}
        </Container>
      </div>

      <CtaFinal />
    </>
  );
}
