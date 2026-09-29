import type { Metadata } from "next";

type Entrada = { titulo: string; descricao: string; caminho: string; indexar?: boolean };

/** Metadata de página: título, descrição, canonical e Open Graph coerentes. */
export function metadados({ titulo, descricao, caminho, indexar = true }: Entrada): Metadata {
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: { title: titulo, description: descricao, url: caminho },
    twitter: { title: titulo, description: descricao },
    ...(indexar ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Serializa JSON-LD sem permitir fechar a tag <script>. */
export function jsonLd(dados: object): string {
  return JSON.stringify(dados).replace(/</g, "\\u003c");
}
