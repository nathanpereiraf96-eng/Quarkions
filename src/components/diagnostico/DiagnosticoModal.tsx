"use client";

import { useId, useRef, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useFocoPreso } from "@/lib/useFocoPreso";
import { EASE_ORBITA } from "@/lib/motion";
import { DiagnosticoForm } from "./DiagnosticoForm";

const CONSULTA_MOBILE = "(max-width: 639px)";

function inscreverLargura(aviso: () => void) {
  const mq = window.matchMedia(CONSULTA_MOBILE);
  mq.addEventListener("change", aviso);
  return () => mq.removeEventListener("change", aviso);
}

function useMobile() {
  return useSyncExternalStore(
    inscreverLargura,
    () => window.matchMedia(CONSULTA_MOBILE).matches,
    () => false,
  );
}

type Props = { origem: string | null; aoFechar: () => void };

export function DiagnosticoModal({ origem, aoFechar }: Props) {
  const aberto = origem !== null;
  const idTitulo = useId();
  const painelRef = useRef<HTMLDivElement>(null);
  const mobile = useMobile();
  const reduzir = useReducedMotion() === true;
  const arrasto = useDragControls();

  useFocoPreso(painelRef, aberto, aoFechar);

  const transicao = reduzir ? { duration: 0 } : { duration: 0.3, ease: EASE_ORBITA };

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-camara/70 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transicao}
            onClick={aoFechar}
          />

          <motion.div
            ref={painelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={idTitulo}
            className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-painel bg-white sm:max-h-[min(90dvh,880px)] sm:max-w-[620px] sm:rounded-painel"
            initial={mobile ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            animate={mobile ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={mobile ? { y: "100%" } : { opacity: 0, scale: 0.97 }}
            transition={transicao}
            // Mobile: bottom sheet que fecha arrastando pela alça.
            drag={mobile ? "y" : false}
            dragListener={false}
            dragControls={arrasto}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) aoFechar();
            }}
          >
            {mobile && (
              <div
                aria-hidden="true"
                className="flex shrink-0 cursor-grab touch-none justify-center pt-3 pb-1 active:cursor-grabbing"
                onPointerDown={(e) => arrasto.start(e)}
              >
                <span className="h-1 w-10 rounded-pilula bg-linha" />
              </div>
            )}

            <div className="flex shrink-0 items-start justify-between gap-4 px-6 pt-4 sm:px-8 sm:pt-8">
              <div>
                <h2 id={idTitulo} className="text-h3">
                  Agendar diagnóstico
                </h2>
                <p className="mt-1 text-small text-grafite-suave">Conversa de 30 minutos, sem custo.</p>
              </div>
              <button
                type="button"
                onClick={aoFechar}
                aria-label="Fechar"
                className="-mt-1 -mr-2 inline-flex size-10 shrink-0 items-center justify-center rounded-botao text-grafite-suave transition-colors duration-200 hover:text-grafite"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="relative overflow-y-auto px-6 pt-6 pb-8 sm:px-8">
              <DiagnosticoForm origem={origem} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
