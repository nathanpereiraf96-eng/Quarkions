"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { DUR, EASE_ORBITA, useReducedMotionSafe } from "@/lib/motion";

const CORES = {
  ciano: "var(--ciano)",
  ultramar: "var(--ultramar)",
  linha: "var(--linha)",
  /** Só em conexões com uma pessoa (handoff). */
  ambar: "var(--ambar)",
} as const;

type TrilhaProps = {
  /** Path SVG da trilha, nas coordenadas do `viewBox`. */
  d: string;
  viewBox: string;
  cor?: keyof typeof CORES;
  /**
   * Omitido: trilha estática, já desenhada.
   * `false`: aguardando (invisível). `true`: desenha de 0 a 1.
   */
  desenhar?: boolean;
  /** Segundos. */
  atraso?: number;
  /** Segundos. */
  duracao?: number;
  espessura?: number;
  /** Partícula na ponta da trilha, acompanhando o desenho. */
  comParticula?: boolean;
  preserveAspectRatio?: string;
  className?: string;
};

export function Trilha({
  d,
  viewBox,
  cor = "ciano",
  desenhar,
  atraso = 0,
  duracao = DUR.orquestracao,
  espessura = 1.25,
  comParticula = false,
  preserveAspectRatio,
  className,
}: TrilhaProps) {
  const reduzir = useReducedMotionSafe();
  const estatica = desenhar === undefined;
  const progresso = useMotionValue(estatica ? 1 : 0);
  const visivel = useTransform(progresso, (v) => (v > 0.001 ? 1 : 0));
  const distancia = useTransform(progresso, (v) => `${v * 100}%`);

  useEffect(() => {
    if (estatica) {
      progresso.set(1);
      return;
    }
    if (!desenhar) {
      progresso.set(0);
      return;
    }
    if (reduzir) {
      progresso.set(1);
      return;
    }
    const controle = animate(progresso, 1, {
      duration: duracao,
      delay: atraso,
      ease: EASE_ORBITA,
    });
    return () => controle.stop();
  }, [estatica, reduzir, desenhar, duracao, atraso, progresso]);

  const traco = CORES[cor];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      fill="none"
    >
      <motion.path
        d={d}
        stroke={traco}
        strokeWidth={espessura}
        strokeLinecap="round"
        style={{ pathLength: progresso, opacity: visivel }}
      />
      {comParticula && (
        <motion.g
          style={{
            offsetPath: `path("${d}")`,
            offsetRotate: "0deg",
            offsetAnchor: "0 0",
            offsetDistance: distancia,
            opacity: visivel,
          }}
        >
          <circle r={6} fill={traco} opacity={0.25} />
          <circle r={2} fill={traco} />
        </motion.g>
      )}
    </svg>
  );
}
