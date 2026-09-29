"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { TrilhaLista } from "./TrilhaLista";
import { TrilhaSticky } from "./TrilhaSticky";

/**
 * A escolha entre as versões é só CSS (sem risco de hidratação): sticky de 500vh a
 * partir de 900px com movimento liberado; lista empilhada no mobile e com movimento reduzido.
 */
export default function Interativo({ aoMontar }: { aoMontar: () => void }) {
  useEffect(aoMontar, [aoMontar]);

  return (
    <>
      <div className="hidden nav:motion-safe:block">
        <TrilhaSticky />
      </div>
      <Container grid className="nav:motion-safe:hidden">
        <div className="col-span-12 lg:col-span-8">
          <TrilhaLista />
        </div>
      </Container>
    </>
  );
}
