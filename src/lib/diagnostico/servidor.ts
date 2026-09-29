import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Diagnostico } from "./schema";

/** Cliente com service role: ignora RLS. Só existe no servidor. */
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) return null;
  return createClient(url, chave, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Colunas da tabela `diagnosticos` (o honeypot e o consentimento de cookies não são gravados). */
export type Linha = Omit<Diagnostico, "empresa_site" | "consentimento_cookies">;

export async function salvarDiagnostico(linha: Linha): Promise<{ ok: true } | { ok: false; motivo: string }> {
  const supabase = supabaseAdmin();
  if (!supabase) return { ok: false, motivo: "Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." };

  const { error } = await supabase.from("diagnosticos").insert({
    ...linha,
    cidade: linha.cidade || null,
    maior_dor: linha.maior_dor || null,
    origem: linha.origem || null,
    pagina: linha.pagina || null,
    utm_source: linha.utm_source || null,
    utm_medium: linha.utm_medium || null,
    utm_campaign: linha.utm_campaign || null,
    utm_content: linha.utm_content || null,
    utm_term: linha.utm_term || null,
    event_id: linha.event_id || null,
  });
  if (error) return { ok: false, motivo: error.message };
  return { ok: true };
}

/** Notificação por e-mail via Resend. Sem as variáveis, não faz nada. */
export async function notificarPorEmail(linha: Linha): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  const para = process.env.EMAIL_NOTIFICACAO;
  if (!chave || !para) return;

  const linhas = [
    `Nome: ${linha.nome}`,
    `E-mail: ${linha.email}`,
    `WhatsApp: +${linha.whatsapp}`,
    `Clínica: ${linha.clinica}${linha.cidade ? ` (${linha.cidade})` : ""}`,
    `Tipo: ${linha.tipo_clinica}`,
    `Contatos por mês: ${linha.volume_leads}`,
    `Canais: ${linha.canais.join(", ")}`,
    `Usa CRM: ${linha.usa_crm}`,
    `Onde perde pacientes: ${linha.maior_dor || "—"}`,
    "",
    `Origem: ${linha.origem || "—"} · Página: ${linha.pagina || "—"}`,
    `UTM: ${[linha.utm_source, linha.utm_medium, linha.utm_campaign, linha.utm_content, linha.utm_term].filter(Boolean).join(" / ") || "—"}`,
  ];

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Quarkions <onboarding@resend.dev>",
        to: [para],
        reply_to: linha.email,
        subject: `Diagnóstico solicitado: ${linha.clinica}`,
        text: linhas.join("\n"),
      }),
    });
  } catch (e) {
    // O pedido já está salvo; a falha no e-mail não deve derrubar o envio.
    console.error("[diagnostico] falha ao notificar por e-mail", e);
  }
}

// Rate limit simples em memória: 5 envios por IP a cada 10 minutos.
// Em serverless, cada instância tem a sua contagem — é um freio, não uma garantia.
const JANELA_MS = 10 * 60 * 1000;
const LIMITE = 5;
const envios = new Map<string, number[]>();

export function dentroDoLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= LIMITE) {
    envios.set(ip, recentes);
    return false;
  }
  recentes.push(agora);
  envios.set(ip, recentes);
  if (envios.size > 5000) {
    for (const [chave, tempos] of envios) {
      if (tempos.every((t) => agora - t >= JANELA_MS)) envios.delete(chave);
    }
  }
  return true;
}
