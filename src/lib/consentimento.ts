"use client";

import { useSyncExternalStore } from "react";
import { COOKIE_CONSENTIMENTO } from "./consentimento-script";

export type Escolha = "aceito" | "recusado";

const COOKIE = COOKIE_CONSENTIMENTO;
const VALIDADE_S = 180 * 24 * 60 * 60;
const EVENTO = "quarkions:consentimento";

export function lerConsentimento(): Escolha | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(aceito|recusado)`));
  return (m?.[1] as Escolha | undefined) ?? null;
}

/** Cookies de medição que o GTM (GA4, Meta Pixel) cria depois do aceite. */
const COOKIES_RASTREAMENTO = /^(_ga.*|_fbp|_fbc)$/;

/** Apaga os cookies de medição no host e em cada domínio pai (ex.: .quarkions.com.br). */
function apagarCookiesRastreamento() {
  const partes = location.hostname.split(".");
  const dominios = ["", ...partes.slice(0, -1).map((_, i) => `; Domain=.${partes.slice(i).join(".")}`)];
  for (const par of document.cookie.split("; ")) {
    const nome = par.split("=")[0];
    if (!COOKIES_RASTREAMENTO.test(nome)) continue;
    for (const dominio of dominios) document.cookie = `${nome}=; Max-Age=0; Path=/${dominio}`;
  }
}

let avisoReaberto = false;

export function salvarConsentimento(escolha: Escolha) {
  const anterior = lerConsentimento();
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${escolha}; Max-Age=${VALIDADE_S}; Path=/; SameSite=Lax${seguro}`;
  avisoReaberto = false;
  // A marca do carregamento (SCRIPT_CONSENTIMENTO) deixa de valer: daqui em diante o React decide.
  delete document.documentElement.dataset.consentimentoInicial;

  // Mudou de ideia depois de aceitar: o GTM já rodou nesta página. Apaga o que ele
  // gravou e recarrega, para que nada de medição continue ativo.
  if (anterior === "aceito" && escolha === "recusado") {
    apagarCookiesRastreamento();
    location.reload();
    return;
  }
  window.dispatchEvent(new Event(EVENTO));
}

/** "Preferências de cookies": reabre o aviso sem apagar a escolha atual. */
export function reabrirAviso() {
  avisoReaberto = true;
  delete document.documentElement.dataset.consentimentoInicial;
  window.dispatchEvent(new Event(EVENTO));
}

function inscrever(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  return () => window.removeEventListener(EVENTO, aviso);
}

/** `undefined` no servidor e na hidratação; depois, a escolha salva (ou `null`). */
export function useConsentimento(): Escolha | null | undefined {
  return useSyncExternalStore(inscrever, lerConsentimento, () => undefined);
}

/** true enquanto o aviso estiver reaberto pelas "Preferências de cookies". */
export function useAvisoReaberto(): boolean {
  return useSyncExternalStore(inscrever, () => avisoReaberto, () => false);
}
