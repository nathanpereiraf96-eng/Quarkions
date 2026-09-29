"use client";

import { usePathname } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { CTA } from "@/lib/site";
import { useDiagnostico } from "./DiagnosticoProvider";

type Props = {
  /** Id da seção de onde o pedido saiu (hero, header, cta-final…). */
  origem: string;
  variante?: "primario" | "secundario" | "sobre-escuro";
  className?: string;
  onClick?: () => void;
};

/**
 * Abre o modal de diagnóstico. É um link para /diagnostico: sem JavaScript,
 * com Ctrl/Cmd+clique ou já na própria página, segue o link normalmente.
 */
export function BotaoDiagnostico({ origem, variante = "primario", className, onClick }: Props) {
  const { abrir } = useDiagnostico();
  const pathname = usePathname();

  return (
    <Botao
      href={CTA.href}
      variante={variante}
      className={className}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.();
        if (pathname === CTA.href) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        abrir(origem);
      }}
    >
      {CTA.rotulo}
    </Botao>
  );
}
