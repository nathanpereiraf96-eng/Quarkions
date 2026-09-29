"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { useConsentimento } from "@/lib/consentimento";
import { track } from "@/lib/rastreamento";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Rastreamento do site (montado no layout raiz):
 * - carrega o GTM só com consentimento "aceito" (ao clicar em Aceitar, carrega na hora);
 * - `virtual_page_view` a cada troca de rota, exceto o primeiro carregamento;
 * - `whatsapp_clique` em qualquer link wa.me.
 * GA4 e Meta Pixel ficam dentro do contêiner do GTM, nunca no código.
 */
export function Rastreamento() {
  const escolha = useConsentimento();
  const pathname = usePathname();
  const primeiraRota = useRef(true);

  useEffect(() => {
    if (primeiraRota.current) {
      primeiraRota.current = false;
      return;
    }
    track("virtual_page_view", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;
      const origem =
        link.closest<HTMLElement>("[data-origem]")?.dataset.origem ??
        link.closest("section[id]")?.id ??
        window.location.pathname;
      track("whatsapp_clique", { origem });
    };
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  if (escolha !== "aceito" || !GTM_ID) return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
