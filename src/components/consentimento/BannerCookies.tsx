"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { reabrirAviso, salvarConsentimento, useAvisoReaberto, useConsentimento } from "@/lib/consentimento";
import { EASE_ORBITA } from "@/lib/motion";

const BOTAO =
  "inline-flex h-10 items-center rounded-botao border-[1.5px] border-grafite px-4 text-small font-semibold transition-colors duration-200 hover:bg-grafite hover:text-nevoa";

/** Aviso de cookies discreto no rodapé da tela (não modal). Aceitar e Recusar com o mesmo peso. */
export function BannerCookies() {
  const escolha = useConsentimento();
  const reaberto = useAvisoReaberto();
  const reduzir = useReducedMotion() === true;

  return (
    <AnimatePresence>
      {/* undefined = servidor/hidratação: vai no HTML e o CSS esconde se já houver escolha. */}
      {(escolha === null || escolha === undefined || reaberto) && (
        <motion.div
          role="region"
          aria-label="Aviso de cookies"
          className="banner-cookies fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-5 sm:pb-5"
          initial={false}
          exit={{ y: "100%" }}
          transition={reduzir ? { duration: 0 } : { duration: 0.3, ease: EASE_ORBITA }}
        >
          <div className="mx-auto flex max-w-[760px] flex-col gap-3 rounded-painel border border-linha bg-white px-5 py-4 text-grafite sm:flex-row sm:items-center sm:justify-between">
            <p className="text-small">
              Usamos cookies para entender como o site é usado. Você escolhe.{" "}
              <Link href="/privacidade" className="font-semibold text-ultramar underline underline-offset-2">
                Política de privacidade
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" className={BOTAO} onClick={() => salvarConsentimento("recusado")}>
                Recusar
              </button>
              <button type="button" className={BOTAO} onClick={() => salvarConsentimento("aceito")}>
                Aceitar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Link do rodapé que reabre o aviso. */
export function PreferenciasCookies() {
  return (
    <button
      type="button"
      onClick={reabrirAviso}
      className="text-left transition-colors duration-200 hover:text-white"
    >
      Preferências de cookies
    </button>
  );
}
