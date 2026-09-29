"use client";

import { AnimatePresence, motion } from "motion/react";
import { DUR, EASE_ORBITA } from "@/lib/motion";
import { HEX, SECUNDARIAS } from "./etapas";

const ORIGEM_CENTRO = { transformBox: "fill-box", transformOrigin: "center" } as const;

type NoProps = {
  /** A partícula já passou por aqui. */
  alcancado: boolean;
  /** Nó da pessoa: preenche de âmbar. */
  humano?: boolean;
  /** Sem pulso nem partículas secundárias. */
  estatico?: boolean;
  raio?: number;
};

/** Nó da trilha, desenhado em (0, 0). Pulsa uma vez quando a partícula chega. */
export function No({ alcancado, humano = false, estatico = false, raio = 5 }: NoProps) {
  const cor = humano ? HEX.ambar : HEX.ciano;
  const animar = alcancado && !estatico;

  return (
    <g>
      <AnimatePresence>
        {animar &&
          SECUNDARIAS.map((d, i) => (
            <motion.path
              key={`sec-${i}`}
              d={d}
              fill="none"
              stroke={cor}
              strokeOpacity={0.2}
              strokeWidth={0.75}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                pathLength: { duration: 0.6, ease: EASE_ORBITA, delay: i * 0.03 },
                opacity: { duration: 0.9, ease: "easeIn", delay: i * 0.03 },
              }}
            />
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {animar && (
          <motion.circle
            key="anel"
            r={raio}
            fill="none"
            stroke={cor}
            strokeWidth={1}
            style={ORIGEM_CENTRO}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.transicao, ease: EASE_ORBITA }}
          />
        )}
      </AnimatePresence>

      <motion.circle
        r={raio}
        fill={alcancado ? cor : HEX.camara}
        stroke={alcancado ? cor : HEX.camaraLinha}
        strokeWidth={1.25}
        style={ORIGEM_CENTRO}
        animate={{ scale: animar ? [1, 1.6, 1] : 1 }}
        transition={{ duration: DUR.transicao, ease: EASE_ORBITA }}
      />
    </g>
  );
}
