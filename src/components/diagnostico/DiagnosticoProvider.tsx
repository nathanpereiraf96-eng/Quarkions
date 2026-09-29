"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { capturarUtm } from "@/lib/diagnostico/rastreio";
import { track } from "@/lib/rastreamento";
import { DiagnosticoModal } from "./DiagnosticoModal";

type Contexto = { abrir: (origem: string) => void };

const DiagnosticoContexto = createContext<Contexto | null>(null);

export function useDiagnostico(): Contexto {
  const ctx = useContext(DiagnosticoContexto);
  if (!ctx) throw new Error("useDiagnostico precisa estar dentro de <DiagnosticoProvider>.");
  return ctx;
}

export function DiagnosticoProvider({ children }: { children: React.ReactNode }) {
  const [origem, setOrigem] = useState<string | null>(null);

  useEffect(() => {
    capturarUtm();
  }, []);

  const abrir = useCallback((o: string) => {
    setOrigem(o);
    track("diagnostico_aberto", { origem: o });
  }, []);
  const fechar = useCallback(() => setOrigem(null), []);
  const valor = useMemo(() => ({ abrir }), [abrir]);

  return (
    <DiagnosticoContexto.Provider value={valor}>
      {children}
      <DiagnosticoModal origem={origem} aoFechar={fechar} />
    </DiagnosticoContexto.Provider>
  );
}
