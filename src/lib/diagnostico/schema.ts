import { z } from "zod";

export const TIPOS_CLINICA = ["Odontológica", "Médica", "Estética", "Outra"] as const;
export const VOLUMES = ["Até 100", "100 a 300", "300 a 1.000", "Mais de 1.000", "Não sei"] as const;
export const CANAIS = ["WhatsApp", "Instagram", "Site", "Anúncios", "Telefone", "Indicação"] as const;
export const USA_CRM = ["Sim", "Não", "Uso planilha"] as const;
export const MAX_DOR = 300;

/** Slugs enviados ao dataLayer (o GTM depende deles). */
export const SLUG_TIPO_CLINICA: Record<(typeof TIPOS_CLINICA)[number], string> = {
  Odontológica: "odontologica",
  Médica: "medica",
  Estética: "estetica",
  Outra: "outra",
};
export const SLUG_VOLUME: Record<(typeof VOLUMES)[number], string> = {
  "Até 100": "ate-100",
  "100 a 300": "100-300",
  "300 a 1.000": "300-1000",
  "Mais de 1.000": "mais-de-1000",
  "Não sei": "nao-sei",
};

/** Só dígitos, com DDI 55. Aceita "(41) 99999-9999", "41999999999", "+55 41 …". */
export function normalizarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) return digitos;
  return `55${digitos}`;
}

function whatsappValido(valor: string): boolean {
  const local = normalizarWhatsapp(valor).slice(2);
  if (local.length !== 10 && local.length !== 11) return false;
  const ddd = Number(local.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  // Celular (11 dígitos) começa com 9.
  return local.length === 10 || local[2] === "9";
}

/** Máscara de exibição: (41) 99999-9999 ou (41) 9999-9999. */
export function mascararWhatsapp(valor: string): string {
  const d = valor.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const resto = d.slice(2);
  const corte = d.length === 11 ? 5 : 4;
  if (resto.length <= corte) return `(${ddd}) ${resto}`;
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
}

export const etapa1Schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido, como nome@clinica.com.br."),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe um WhatsApp com DDD.")
    .refine(whatsappValido, "Informe um WhatsApp com DDD, como (41) 99999-9999."),
  clinica: z.string().trim().min(2, "Informe o nome da clínica."),
  cidade: z.string().trim().max(120).optional().default(""),
});

export const etapa2Schema = z.object({
  tipo_clinica: z.enum(TIPOS_CLINICA, "Escolha o tipo de clínica."),
  volume_leads: z.enum(VOLUMES, "Escolha uma faixa de contatos por mês."),
  canais: z.array(z.enum(CANAIS)).min(1, "Escolha pelo menos um canal."),
  usa_crm: z.enum(USA_CRM, "Diga se vocês usam CRM."),
  maior_dor: z.string().trim().max(MAX_DOR, `Use até ${MAX_DOR} caracteres.`).optional().default(""),
  consentimento: z.literal(true, "Para continuar, marque a concordância com o uso dos dados."),
});

const rastreioSchema = z.object({
  /** Mesmo id no Pixel (navegador, via GTM) e na API de Conversões (servidor): a Meta deduplica. */
  event_id: z.string().uuid().optional(),
  /** true se o aviso de cookies foi aceito: condição para enviar o Lead à API de Conversões. */
  consentimento_cookies: z.boolean().optional().default(false),
  origem: z.string().max(60).optional().default(""),
  pagina: z.string().max(300).optional().default(""),
  utm_source: z.string().max(200).optional().default(""),
  utm_medium: z.string().max(200).optional().default(""),
  utm_campaign: z.string().max(200).optional().default(""),
  utm_content: z.string().max(200).optional().default(""),
  utm_term: z.string().max(200).optional().default(""),
  /** Honeypot: fica oculto; humanos deixam vazio. */
  empresa_site: z.string().optional().default(""),
});

export const diagnosticoSchema = etapa1Schema.extend(etapa2Schema.shape).extend(rastreioSchema.shape);

export type DiagnosticoEntrada = z.input<typeof diagnosticoSchema>;
export type Diagnostico = z.output<typeof diagnosticoSchema>;

/** Primeira mensagem de erro por campo. */
export function errosPorCampo(erro: z.ZodError): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const issue of erro.issues) {
    const campo = String(issue.path[0] ?? "");
    if (campo && !saida[campo]) saida[campo] = issue.message;
  }
  return saida;
}
