"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DUR, EASE_ORBITA } from "@/lib/motion";

export type ItemAcordeao = { titulo: string; conteudo: React.ReactNode };

/**
 * Acordeão acessível: botão com aria-expanded + região. Um item aberto por vez,
 * altura animada e "+" que gira para "×".
 */
export function Acordeao({ itens, nivel = 3 }: { itens: ItemAcordeao[]; nivel?: 2 | 3 | 4 }) {
  const base = useId();
  const reduzir = useReducedMotion() === true;
  const [aberto, setAberto] = useState<number | null>(null);
  const Titulo = `h${nivel}` as const;

  const transicao = (d: number) => (reduzir ? { duration: 0 } : { duration: d, ease: EASE_ORBITA });

  return (
    <div className="border-b border-linha">
      {itens.map((item, i) => {
        const estaAberto = aberto === i;
        return (
          <div key={item.titulo} className="border-t border-linha">
            <Titulo>
              <button
                id={`${base}-p-${i}`}
                type="button"
                aria-expanded={estaAberto}
                aria-controls={`${base}-r-${i}`}
                onClick={() => setAberto(estaAberto ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left text-h3 transition-colors duration-200 hover:text-ultramar"
              >
                {item.titulo}
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="mt-1.5 size-5 shrink-0"
                  animate={{ rotate: estaAberto ? 45 : 0 }}
                  transition={transicao(DUR.feedback)}
                >
                  <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </motion.svg>
              </button>
            </Titulo>
            <AnimatePresence initial={false}>
              {estaAberto && (
                <motion.div
                  id={`${base}-r-${i}`}
                  role="region"
                  aria-labelledby={`${base}-p-${i}`}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transicao(DUR.transicao)}
                >
                  <div className="max-w-texto pb-7 text-lead text-grafite-suave">{item.conteudo}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
