import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

const BLOCOS = [
  {
    titulo: "Uma pessoa sempre por perto",
    texto:
      "Exceções, reclamações, perguntas clínicas e pedidos sensíveis vão para sua equipe. A ISIS não faz diagnóstico nem promete tratamento.",
    humano: true,
  },
  {
    titulo: "Dados tratados conforme a LGPD",
    texto:
      "Coletamos só o necessário para o atendimento, com acessos restritos, registro de eventos e regras claras de retenção.",
  },
  {
    titulo: "Controle e reversão",
    texto:
      "Toda mudança no agente é registrada e testada antes de ir ao ar. Se algo sair do esperado, dá para desligar na hora.",
  },
];

export function Seguranca() {
  return (
    <Section id="seguranca" tema="escuro" aria-labelledby="seguranca-titulo">
      <Container grid>
        <h2 id="seguranca-titulo" className="col-span-12 text-h2 lg:col-span-7">
          A IA atende. Sua equipe decide.
        </h2>

        <ul className="col-span-12 mt-14 grid md:grid-cols-3">
          {BLOCOS.map((b, i) => (
            <li
              key={b.titulo}
              className={`py-8 md:py-0 ${
                i > 0 ? "border-t border-camara-linha md:border-t-0 md:border-l md:pl-8" : ""
              } ${i < BLOCOS.length - 1 ? "md:pr-8" : ""} first:pt-0 last:pb-0`}
            >
              <span
                aria-hidden="true"
                className={`block size-2 rounded-pilula ${b.humano ? "bg-ambar" : "bg-ciano"}`}
              />
              <h3 className="mt-5 text-h3">{b.titulo}</h3>
              <p className="mt-3 text-white/80">{b.texto}</p>
            </li>
          ))}
        </ul>

        <p className="col-span-12 mt-14">
          <Link
            href="/seguranca"
            className="font-semibold text-white underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            Como protegemos sua operação
          </Link>
        </p>
      </Container>
    </Section>
  );
}
