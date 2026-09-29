import { after } from "next/server";
import { diagnosticoSchema, errosPorCampo, normalizarWhatsapp } from "@/lib/diagnostico/schema";
import { dentroDoLimite, notificarPorEmail, salvarDiagnostico } from "@/lib/diagnostico/servidor";
import { enviarLeadMeta } from "@/lib/meta-capi";
import { SITE } from "@/lib/site";

function ipDe(request: Request): string | undefined {
  const encaminhado = request.headers.get("x-forwarded-for");
  return encaminhado?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
}

function cookieDe(request: Request, nome: string): string | undefined {
  const par = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${nome}=`));
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : undefined;
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ ok: false, erro: "Dados inválidos." }, { status: 400 });
  }

  const resultado = diagnosticoSchema.safeParse(corpo);
  if (!resultado.success) {
    return Response.json(
      { ok: false, erro: "Revise os campos destacados.", campos: errosPorCampo(resultado.error) },
      { status: 422 },
    );
  }

  const { empresa_site, consentimento_cookies, ...dados } = resultado.data;

  // Honeypot preenchido: robô. Responde como sucesso e não salva.
  if (empresa_site) return Response.json({ ok: true });

  const ip = ipDe(request);
  if (!dentroDoLimite(ip ?? "desconhecido")) {
    return Response.json(
      { ok: false, erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." },
      { status: 429 },
    );
  }

  const linha = { ...dados, whatsapp: normalizarWhatsapp(dados.whatsapp) };
  const salvo = await salvarDiagnostico(linha);
  if (!salvo.ok) {
    console.error("[diagnostico] falha ao salvar:", salvo.motivo);
    return Response.json({ ok: false, erro: "Não foi possível registrar o pedido." }, { status: 500 });
  }

  // Dados do request lidos agora; o envio acontece depois da resposta.
  const contexto = {
    ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
    fbp: cookieDe(request, "_fbp"),
    fbc: cookieDe(request, "_fbc"),
    url: request.headers.get("referer") || `${SITE.url}${linha.pagina || "/"}`,
  };

  // E-mail e API de Conversões não atrasam nem derrubam a resposta ao visitante.
  after(async () => {
    await notificarPorEmail(linha);
    // Lead pelo servidor só com cookies aceitos; o event_id é o mesmo do dataLayer.
    if (consentimento_cookies === true && linha.event_id) {
      await enviarLeadMeta({
        eventId: linha.event_id,
        email: linha.email,
        whatsapp: linha.whatsapp,
        nome: linha.nome,
        cidade: linha.cidade,
        origem: linha.origem,
        ...contexto,
      });
    }
  });

  return Response.json({ ok: true });
}
