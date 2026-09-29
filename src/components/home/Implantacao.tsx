"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Nums } from "@/components/ui/Nums";
import { ETAPAS_IMPLANTACAO } from "@/lib/implantacao";
import { DUR, EASE_ORBITA } from "@/lib/motion";

const ETAPAS = ETAPAS_IMPLANTACAO;

const TOTAL_DIAS = 10;

export function Implantacao() {
  const base = useId();
  const [ativa, setAtiva] = useState(0);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  const selecionar = (i: number) => {
    setAtiva(i);
    abas.current[i]?.focus();
  };

  // Padrão tablist: setas, Home e End movem a seleção.
  const aoTeclar = (e: React.KeyboardEvent) => {
    const ultimo = ETAPAS.length - 1;
    const destino =
      e.key === "ArrowRight" ? (ativa === ultimo ? 0 : ativa + 1)
      : e.key === "ArrowLeft" ? (ativa === 0 ? ultimo : ativa - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? ultimo
      : null;
    if (destino === null) return;
    e.preventDefault();
    selecionar(destino);
  };

  const etapa = ETAPAS[ativa];

  return (
    <Section id="implantacao" aria-labelledby="implantacao-titulo">
      <Container grid>
        <div className="col-span-12 lg:col-span-7">
          <h2 id="implantacao-titulo" className="text-h2">
            No ar em até 10 dias úteis.
          </h2>
          <p className="mt-6 max-w-texto text-lead text-grafite-suave">
            Implantação não é um projeto sem fim. É uma sequência curta, com responsáveis, testes
            e um critério de sucesso definido antes de começar.
          </p>
        </div>

        {/* Desktop: régua com abas */}
        <div className="col-span-12 mt-14 hidden lg:block">
          <div role="tablist" aria-label="Etapas da implantação" className="grid grid-cols-6 gap-3">
            {ETAPAS.map((e, i) => (
              <button
                key={e.titulo}
                ref={(el) => {
                  abas.current[i] = el;
                }}
                id={`${base}-aba-${i}`}
                role="tab"
                type="button"
                aria-selected={ativa === i}
                aria-controls={`${base}-painel`}
                tabIndex={ativa === i ? 0 : -1}
                onClick={() => setAtiva(i)}
                onKeyDown={aoTeclar}
                className="group rounded-botao py-3 text-left"
              >
                <span className="block text-small text-grafite-suave">
                  <Nums>{`${i + 1}. ${e.dias}`}</Nums>
                </span>
                <span
                  className={`mt-1 block font-semibold transition-colors duration-200 ${
                    ativa === i ? "text-ultramar" : "text-grafite group-hover:text-ultramar"
                  }`}
                >
                  {e.titulo}
                </span>
              </button>
            ))}
          </div>

          <div aria-hidden="true" className="relative mt-6 h-10">
            <div className="absolute inset-x-0 top-2 h-px bg-linha" />
            {ETAPAS.map((e, i) => (
              <div
                key={e.marca}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${(e.marca / TOTAL_DIAS) * 100}%` }}
              >
                <span className="relative flex size-4 items-center justify-center">
                  <span className="size-2 rounded-pilula border border-linha bg-nevoa" />
                  {ativa === i && (
                    <motion.span
                      layoutId={`${base}-marcador`}
                      className="absolute size-3.5 rounded-pilula bg-ultramar"
                      transition={{ duration: DUR.transicao, ease: EASE_ORBITA }}
                    />
                  )}
                </span>
                {/* Nas pontas, o rótulo alinha para dentro da régua. */}
                <span
                  className={`absolute top-6 text-small whitespace-nowrap text-grafite-suave ${
                    i === 0 ? "left-1/2" : i === ETAPAS.length - 1 ? "right-1/2" : "left-1/2 -translate-x-1/2"
                  }`}
                >
                  <Nums>{`Dia ${e.marca}`}</Nums>
                </span>
              </div>
            ))}
          </div>

          <div
            id={`${base}-painel`}
            role="tabpanel"
            aria-labelledby={`${base}-aba-${ativa}`}
            className="mt-10 grid max-w-texto"
          >
            <motion.div
              key={ativa}
              className="[grid-area:1/1]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.feedback, ease: EASE_ORBITA }}
            >
              <h3 className="text-h3">{etapa.titulo}</h3>
              <p className="mt-3 text-lead">{etapa.texto}</p>
            </motion.div>
          </div>
        </div>

        {/* Mobile: todas as etapas abertas */}
        <ol className="col-span-12 mt-12 border-l border-linha lg:hidden">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="relative pb-10 pl-7 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[5px] size-2.5 rounded-pilula border border-linha bg-nevoa"
              />
              <p className="text-small text-grafite-suave">
                <Nums>{`${i + 1}. ${e.dias}`}</Nums>
              </p>
              <h3 className="mt-1 text-h3">{e.titulo}</h3>
              <p className="mt-2 max-w-texto">{e.texto}</p>
            </li>
          ))}
        </ol>

        <p className="col-span-12 mt-12">
          <Link
            href="/como-implantamos"
            className="font-semibold text-ultramar underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            Ver o processo completo
          </Link>
        </p>
      </Container>
    </Section>
  );
}
