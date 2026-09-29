/**
 * Dados institucionais. Campos vazios são omitidos do site.
 */
export const SITE = {
  nome: "Quarkions",
  /** URL pública, sem barra no fim. Vem de NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://quarkions.com").replace(/\/$/, ""),
  email: "contato@quarkions.com",
  razaoSocial: "Quarkions Technology LTDA",
  cnpj: "59.819.209/0001-24",
  whatsapp: "554184988489", // DDI + DDD + número, só dígitos (+55 41 8498-8489)
} as const;

export const NAVEGACAO = [
  { rotulo: "Como funciona", href: "/#como-funciona" },
  { rotulo: "Implantação", href: "/como-implantamos" },
  { rotulo: "Segurança", href: "/seguranca" },
  { rotulo: "Sobre", href: "/sobre" },
] as const;

export const CTA = { rotulo: "Agendar diagnóstico", href: "/diagnostico" } as const;
