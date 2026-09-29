"use client";

import { useEffect } from "react";

const FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Enquanto `ativo`: foco preso em `ref` (começa em `[data-foco-inicial]`, se houver), `Esc` chama `aoFechar`, rolagem da
 * página travada. Ao desativar, devolve o foco a quem estava com ele antes.
 */
export function useFocoPreso(
  ref: React.RefObject<HTMLElement | null>,
  ativo: boolean,
  aoFechar: () => void,
) {
  useEffect(() => {
    if (!ativo) return;
    const anterior = document.activeElement as HTMLElement | null;
    const container = ref.current;

    const focaveis = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
    // Foco inicial: o elemento marcado com data-foco-inicial, ou o primeiro focável.
    (container?.querySelector<HTMLElement>("[data-foco-inicial]") ?? focaveis()[0])?.focus();

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        aoFechar();
        return;
      }
      if (e.key !== "Tab") return;
      const lista = focaveis();
      if (lista.length === 0) return;
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && (document.activeElement === primeiro || !container?.contains(document.activeElement))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (document.activeElement === ultimo || !container?.contains(document.activeElement))) {
        e.preventDefault();
        primeiro.focus();
      }
    };

    const overflowAnterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.documentElement.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoTeclar);
      anterior?.focus?.();
    };
  }, [ref, ativo, aoFechar]);
}
