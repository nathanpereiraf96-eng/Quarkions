import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Bloco } from "@/components/layout/Bloco";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { Nums } from "@/components/ui/Nums";
import { ETAPAS_IMPLANTACAO } from "@/lib/implantacao";

export const metadata: Metadata = metadados({
  titulo: "Como implantamos | Quarkions",
  descricao:
    "Implantação em até 10 dias úteis, com testes, indicador de sucesso definido e acompanhamento semanal.",
  caminho: "/como-implantamos",
});

export default function ComoImplantamos() {
  return (
    <>
      <PageHero
        titulo="Como implantamos a ISIS na sua clínica"
        lead="Uma sequência curta e previsível: cada etapa tem responsável, entrega e critério de aceite. Nada vai ao ar sem teste, e nada fica sem medição."
      />

      <div className="bg-nevoa pb-[clamp(80px,10vw,140px)]">
        <Container>
          <Bloco id="antes-de-comecar" titulo="Antes de começar">
            <p>
              Tudo o que o piloto inclui fica escrito no contrato antes do kickoff: quais fluxos
              entram, quais integrações serão feitas, o que fica de fora, qual é o indicador de
              sucesso, o prazo e quem da sua equipe é o responsável pelo projeto.
            </p>
            <p className="text-grafite-suave">
              Assim, as duas partes sabem desde o início o que será entregue e como o resultado
              vai ser medido.
            </p>
            <h3 className="pt-4 text-h3">
              Se não está combinado, não entra no piloto — e isso protege o seu prazo.
            </h3>
          </Bloco>

          <section
            id="os-10-dias"
            aria-labelledby="os-10-dias-titulo"
            className="grid-site gap-y-4 border-t border-linha py-12 md:py-16"
          >
            <h2 id="os-10-dias-titulo" className="col-span-12 text-h3 md:col-span-4">
              Os 10 dias úteis
            </h2>
            <ol className="col-span-12 md:col-span-8">
              {ETAPAS_IMPLANTACAO.map((e, i) => (
                <li key={e.titulo} className="border-b border-linha py-8 first:pt-0 last:border-b-0">
                  <p className="text-small text-grafite-suave">
                    <Nums>{`${i + 1}. ${e.dias}`}</Nums>
                  </p>
                  <h3 className="mt-1 text-h3">{e.titulo}</h3>
                  <dl className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-small font-semibold text-grafite-suave">O que acontece</dt>
                    <dd>{e.texto}</dd>
                    <dt className="text-small font-semibold text-grafite-suave">Quem participa</dt>
                    <dd>{e.quem === "Ambos" ? "Quarkions e sua equipe" : e.quem}</dd>
                    <dt className="text-small font-semibold text-grafite-suave">Pronto quando</dt>
                    <dd>{e.pronto.charAt(0).toUpperCase() + e.pronto.slice(1)}</dd>
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          <Bloco id="depois-do-go-live" titulo="Depois do go-live">
            <p>
              Toda semana você recebe um relatório com o volume atendido, a conversão em cada
              etapa, as falhas encontradas e o que aprendemos com elas.
            </p>
            <p>
              Em revisões periódicas, olhamos juntos o indicador combinado no início e decidimos
              em conjunto: manter como está, ajustar o que não funcionou ou expandir para novos
              fluxos.
            </p>
          </Bloco>

          <Bloco id="mudancas" titulo="Mudanças no caminho">
            <p>
              Surgiu uma nova necessidade? Ela pode substituir uma entrega equivalente, virar um
              adicional com preço e prazo próprios ou ficar para uma próxima fase. Você decide com
              todas as informações na mesa.
            </p>
          </Bloco>

          <Bloco id="encerrar" titulo="Se decidir encerrar">
            <p>
              Exportamos os seus dados, revogamos todos os acessos que recebemos e encerramos as
              credenciais usadas na operação, conforme o que está previsto no contrato.
            </p>
          </Bloco>
        </Container>
      </div>

      <CtaFinal />
    </>
  );
}
