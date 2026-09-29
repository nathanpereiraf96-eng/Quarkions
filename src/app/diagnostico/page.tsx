import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import { DiagnosticoAbertoNaPagina } from "@/components/diagnostico/DiagnosticoAbertoNaPagina";
import { DiagnosticoForm } from "@/components/diagnostico/DiagnosticoForm";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = metadados({
  titulo: "Agendar diagnóstico | Quarkions",
  descricao:
    "Em 30 minutos, mapeamos onde sua clínica perde pacientes entre o contato e o agendamento.",
  caminho: "/diagnostico",
});

const PASSOS = [
  "Entendemos como seus contatos chegam e são atendidos hoje.",
  "Estimamos onde os leads se perdem.",
  "Mostramos como a ISIS funcionaria no seu fluxo.",
  "Se fizer sentido, você recebe uma proposta com escopo e preço fechados.",
];

export default function PaginaDiagnostico() {
  return (
    <section data-tema="claro" className="bg-nevoa pt-[clamp(40px,6vw,88px)] pb-[clamp(80px,10vw,140px)]">
      <Container grid className="gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <h1 className="text-h2">Agendar diagnóstico</h1>
          <p className="mt-4 text-lead text-grafite-suave">Conversa de 30 minutos, sem custo.</p>

          <div className="mt-10 rounded-painel border border-linha bg-white p-6 sm:p-10">
            <DiagnosticoAbertoNaPagina />
            <DiagnosticoForm origem="pagina-diagnostico" />
          </div>
        </div>

        <aside
          aria-labelledby="diagnostico-passos"
          className="col-span-12 lg:col-span-4 lg:col-start-9 lg:pt-[7.5rem]"
        >
          <h2 id="diagnostico-passos" className="text-h3">
            O que acontece no diagnóstico
          </h2>
          <ol className="mt-6 border-t border-linha">
            {PASSOS.map((passo, i) => (
              <li key={passo} className="flex gap-4 border-b border-linha py-5">
                <span className="nums text-grafite-suave">{i + 1}</span>
                <span>{passo}</span>
              </li>
            ))}
          </ol>
        </aside>
      </Container>
    </section>
  );
}
