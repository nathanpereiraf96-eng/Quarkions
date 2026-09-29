import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

const INDICADORES = [
  ["Tempo até a primeira resposta", "Quanto o lead espera até ser atendido, inclusive fora do horário."],
  ["Taxa de agendamento", "Quantos leads viram avaliação marcada."],
  ["Taxa de comparecimento", "Quantos agendados de fato aparecem."],
  ["Recuperação", "Faltas e leads parados que voltaram a agendar."],
  ["Follow-up no prazo", "Quantas tentativas previstas realmente aconteceram."],
  ["Horas poupadas", "Tempo da recepção liberado para quem está na clínica."],
];

export function Medimos() {
  return (
    <Section id="o-que-medimos" tema="branco" aria-labelledby="medimos-titulo">
      <Container grid>
        <div className="col-span-12 lg:col-span-8">
          <h2 id="medimos-titulo" className="text-h2">
            Medimos o que muda no seu caixa, não o número de mensagens.
          </h2>
          <p className="mt-6 max-w-texto text-lead text-grafite-suave">
            Antes de começar, registramos como sua clínica está hoje. Depois, acompanhamos os
            mesmos indicadores toda semana.
          </p>
        </div>

        <div className="col-span-12 mt-14">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Indicadores acompanhados toda semana</caption>
            <thead>
              <tr className="border-b border-grafite">
                <th scope="col" className="w-2/5 pb-3 text-small font-semibold text-grafite-suave">
                  Indicador
                </th>
                <th scope="col" className="pb-3 text-small font-semibold text-grafite-suave">
                  O que ele mostra
                </th>
              </tr>
            </thead>
            <tbody>
              {INDICADORES.map(([nome, descricao]) => (
                <tr key={nome} className="border-b border-linha align-top">
                  <th scope="row" className="py-5 pr-6 text-lead font-semibold">
                    {nome}
                  </th>
                  <td className="py-5 text-lead text-grafite-suave">{descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="col-span-12 mt-8 max-w-texto text-small text-grafite-suave">
          Os resultados dependem do volume, dos dados e da operação de cada clínica. Por isso, o
          indicador principal é combinado com você antes do início.
        </p>
      </Container>
    </Section>
  );
}
