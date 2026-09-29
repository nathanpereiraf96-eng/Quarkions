"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/** Easing padrão "orbita". */
export const EASE_ORBITA = [0.22, 1, 0.36, 1] as const;

/** Durações em segundos: feedback de ação, transição, orquestração. */
export const DUR = { feedback: 0.2, transicao: 0.45, orquestracao: 0.9 } as const;

const naoInscrever = () => () => {};

/** true só depois da hidratação; false no servidor e na primeira renderização. */
function useNoCliente() {
  return useSyncExternalStore(
    naoInscrever,
    () => true,
    () => false,
  );
}

/**
 * `useReducedMotion` estável no SSR: sempre `false` no servidor e na
 * hidratação, depois reflete a preferência do sistema.
 */
export function useReducedMotionSafe(): boolean {
  const reduzir = useReducedMotion();
  const noCliente = useNoCliente();
  return noCliente && reduzir === true;
}
