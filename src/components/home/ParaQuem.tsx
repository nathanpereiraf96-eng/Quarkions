import { BotaoDiagnostico } from "@/components/diagnostico/BotaoDiagnostico";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Trilha } from "@/components/motion/Trilha";

const FAZ_SENTIDO = [
  "Sua clínica recebe muitos contatos por mês, ou cada paciente fechado vale muito.",
  "Leads se perdem por demora ou fora do horário.",
  "A recepção está sobrecarregada e o follow-up é irregular.",
  "Você quer medir resposta, agendamento e comparecimento.",
];

const NAO_E = [
  "Você busca só um robô barato, sem acompanhamento.",
  "Não há ninguém da equipe para assumir as exceções.",
  "Sua equipe já responde todos os contatos em segundos.",
];

export function ParaQuem() {
  return (
    <Section
      id="para-quem"
      tema="escuro"
      aria-labelledby="para-quem-titulo"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 h-[360px] w-[min(640px,100%)] opacity-25"
      >
        <Trilha
          viewBox="0 0 640 360"
          d="M160 -10C260 90 380 150 650 120"
          className="absolute inset-0 size-full"
        />
        <Trilha
          viewBox="0 0 640 360"
          d="M360 -10C390 120 470 250 650 300"
          className="absolute inset-0 size-full"
        />
      </div>

      <Container grid className="relative">
        <div className="col-span-12 lg:col-span-7">
          <h2 id="para-quem-titulo" className="text-h2">
            Feito para clínicas com volume e ticket.
          </h2>
          <p className="mt-6 max-w-texto text-lead text-white/75">
            Começamos pela operação que conhecemos por dentro: clínicas odontológicas e
            clínicas de tratamentos de valor relevante.
          </p>
        </div>

        <div className="col-span-12 mt-14 grid gap-y-12 md:grid-cols-2">
          <div className="md:pr-12">
            <h3 className="text-h3">Faz sentido se</h3>
            <ul className="mt-6 space-y-5">
              {FAZ_SENTIDO.map((item) => (
                <li key={item} className="flex gap-4 text-lead text-white/85">
                  <span aria-hidden="true" className="mt-[0.7em] size-2 shrink-0 rounded-pilula bg-ciano" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-camara-linha pt-12 md:border-t-0 md:border-l md:pt-0 md:pl-12">
            <h3 className="text-h3">Não é para você se</h3>
            <ul className="mt-6 space-y-5">
              {NAO_E.map((item) => (
                <li key={item} className="flex gap-4 text-lead text-white/85">
                  <span aria-hidden="true" className="mt-[0.75em] h-0.5 w-3 shrink-0 bg-camara-linha" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-span-12 mt-16">
          <BotaoDiagnostico origem="para-quem-e" variante="sobre-escuro" />
        </div>
      </Container>
    </Section>
  );
}
