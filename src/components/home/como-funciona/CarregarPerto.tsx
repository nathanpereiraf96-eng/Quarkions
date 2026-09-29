"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const Interativo = dynamic(() => import("./Interativo"), { ssr: false });

/**
 * Só baixa a trilha interativa quando a seção está a ~1 tela de distância.
 * Até lá (e enquanto o bloco carrega), mostra `children`: a versão estática.
 */
export function CarregarPerto({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [pronto, setPronto] = useState(false);
  const aoMontar = useCallback(() => setPronto(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPerto(true);
          obs.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {perto && <Interativo aoMontar={aoMontar} />}
      {!pronto && children}
    </div>
  );
}
