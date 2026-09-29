import "server-only";
import { createHash } from "node:crypto";

/** Dados de um Lead para a API de Conversões da Meta. */
export type EntradaLead = {
  eventId: string;
  email: string;
  /** Só dígitos, com DDI 55. */
  whatsapp: string;
  nome: string;
  cidade?: string;
  origem: string;
  /** URL completa da página onde o formulário foi enviado. */
  url: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  /** Momento do envio (padrão: agora). */
  momento?: Date;
};

export type ConfigMeta = {
  pixelId?: string;
  token?: string;
  versao?: string;
  codigoTeste?: string;
};

const sha256 = (valor: string) => createHash("sha256").update(valor).digest("hex");

/** Normalização exigida pela Meta antes do hash. */
export const normalizar = {
  email: (v: string) => v.trim().toLowerCase(),
  telefone: (v: string) => v.replace(/\D/g, ""),
  primeiroNome: (v: string) => v.trim().split(/\s+/)[0]?.toLowerCase() ?? "",
  cidade: (v: string) =>
    v
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, ""),
};

/** Hash de um campo já normalizado; vazio vira `undefined` (e é omitido). */
function hashDe(valor: string): string[] | undefined {
  return valor ? [sha256(valor)] : undefined;
}

/** Remove chaves com `undefined` ou string vazia. */
function semVazios<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")) as Partial<T>;
}

/** Corpo do POST para /{pixel}/events. Função pura: fácil de testar. */
export function montarPayloadLead(e: EntradaLead, codigoTeste?: string) {
  const evento = {
    event_name: "Lead",
    event_time: Math.floor((e.momento ?? new Date()).getTime() / 1000),
    event_id: e.eventId,
    action_source: "website",
    event_source_url: e.url,
    user_data: semVazios({
      em: hashDe(normalizar.email(e.email)),
      ph: hashDe(normalizar.telefone(e.whatsapp)),
      fn: hashDe(normalizar.primeiroNome(e.nome)),
      ct: hashDe(normalizar.cidade(e.cidade ?? "")),
      country: hashDe("br"),
      // Sem hash, conforme a Meta:
      client_ip_address: e.ip,
      client_user_agent: e.userAgent,
      fbp: e.fbp,
      fbc: e.fbc,
    }),
    custom_data: { content_name: "diagnostico", origem: e.origem },
  };
  return semVazios({ data: [evento], test_event_code: codigoTeste });
}

function configDoAmbiente(): ConfigMeta {
  return {
    pixelId: process.env.META_PIXEL_ID,
    token: process.env.META_CAPI_TOKEN,
    versao: process.env.META_GRAPH_VERSION,
    codigoTeste: process.env.META_TEST_EVENT_CODE,
  };
}

export type ResultadoMeta = { enviado: true; status: number } | { enviado: false; motivo: string; status?: number };

/**
 * Envia o Lead à API de Conversões. Nunca lança: falha só é registrada (sem dados
 * pessoais e sem o token) e devolvida no resultado.
 */
export async function enviarLeadMeta(
  entrada: EntradaLead,
  config: ConfigMeta = configDoAmbiente(),
  buscar: typeof fetch = fetch,
): Promise<ResultadoMeta> {
  const { pixelId, token, versao, codigoTeste } = config;
  if (!pixelId || !token || !versao) return { enviado: false, motivo: "não configurado" };

  const url = `https://graph.facebook.com/${versao}/${pixelId}/events?access_token=${encodeURIComponent(token)}`;
  try {
    const resposta = await buscar(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(montarPayloadLead(entrada, codigoTeste || undefined)),
      signal: AbortSignal.timeout(3000),
    });
    if (!resposta.ok) {
      console.error(`[meta-capi] Lead recusado pela Meta: status ${resposta.status}`);
      return { enviado: false, motivo: "resposta de erro", status: resposta.status };
    }
    return { enviado: true, status: resposta.status };
  } catch (erro) {
    const nome = erro instanceof Error ? erro.name : "erro";
    console.error(`[meta-capi] falha ao enviar o Lead: ${nome}`);
    return { enviado: false, motivo: nome };
  }
}
