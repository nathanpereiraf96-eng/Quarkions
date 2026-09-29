import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Acordeao } from "@/components/ui/Acordeao";
import { PERGUNTAS_FREQUENTES } from "@/lib/faq";

export function Faq() {
  return (
    <Section id="perguntas" aria-labelledby="faq-titulo">
      <Container grid>
        <h2 id="faq-titulo" className="col-span-12 text-h2 lg:col-span-4">
          Perguntas frequentes
        </h2>
        <div className="col-span-12 mt-10 lg:col-span-8 lg:mt-0">
          <Acordeao itens={PERGUNTAS_FREQUENTES.map(({ p, r }) => ({ titulo: p, conteudo: r }))} />
        </div>
      </Container>
    </Section>
  );
}
