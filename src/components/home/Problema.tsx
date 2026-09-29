"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Trilha } from "@/components/motion/Trilha";
import { Nums } from "@/components/ui/Nums";
import { DUR } from "@/lib/motion";

const SITUACOES = [
  {
    quando: "22:14",
    texto:
      "Mensagem chega depois do expediente e só é vista na manhã seguinte. Até lá, o paciente já falou com outra clínica.",
  },
  { quando: "10:30", texto: "A recepção está atendendo quem está na sala. O WhatsApp acumula." },
  { quando: "3º dia", texto: "O orçamento foi enviado. Ninguém retomou o contato." },
  {
    quando: "Quinta, 14h",
    texto: "O paciente faltou. A vaga ficou vazia e ninguém tentou remarcar.",
  },
];

export function Problema() {
  // Item sob o mouse, com foco ou tocado: a partícula atravessa o problema.
  const [ativo, setAtivo] = useState<number | null>(null);

  return (
    <Section id="problema" aria-labelledby="problema-titulo">
      <Container grid>
        <div className="col-span-12 lg:col-span-7">
          <h2 id="problema-titulo" className="text-h2">
            O lead chega. A resposta não.
          </h2>
          <p className="mt-6 max-w-texto text-lead text-grafite-suave">
            Na maioria das clínicas, o problema não é falta de interesse. É o tempo entre a
            mensagem e a resposta, o follow-up que ninguém teve tempo de fazer e a falta que
            ninguém tentou remarcar.
          </p>
        </div>

        <ol className="col-span-12 mt-14 border-b border-linha">
          {SITUACOES.map((s, i) => (
            <li
              key={s.quando}
              tabIndex={0}
              onMouseEnter={() => setAtivo(i)}
              onMouseLeave={() => setAtivo((a) => (a === i ? null : a))}
              onFocus={() => setAtivo(i)}
              onBlur={() => setAtivo((a) => (a === i ? null : a))}
              onClick={() => setAtivo(i)}
              className="grid-site gap-y-2 border-t border-linha pt-7 pb-4"
            >
              <p className="col-span-12 text-lead text-grafite-suave sm:col-span-3">
                <Nums>{s.quando}</Nums>
              </p>
              <div className="col-span-12 sm:col-span-9">
                <p className="max-w-texto text-lead">{s.texto}</p>
                <Trilha
                  viewBox="0 0 320 12"
                  d="M1 7C70 2 130 11 200 6s90-3 119 0"
                  cor="ultramar"
                  desenhar={ativo === i}
                  duracao={DUR.transicao}
                  className="mt-3 h-3 w-80 max-w-full"
                />
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
