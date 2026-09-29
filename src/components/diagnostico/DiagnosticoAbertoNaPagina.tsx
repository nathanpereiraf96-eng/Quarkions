"use client";

import { useEffect } from "react";
import { track } from "@/lib/rastreamento";

/** `diagnostico_aberto` ao carregar /diagnostico (no modal, o evento sai de `abrir()`). */
export function DiagnosticoAbertoNaPagina() {
  useEffect(() => {
    track("diagnostico_aberto", { origem: "pagina-diagnostico" });
  }, []);
  return null;
}
