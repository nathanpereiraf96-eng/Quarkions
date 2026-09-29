/**
 * Eventos para o dataLayer do Google Tag Manager. As tags (GA4, Meta Pixel) vivem no GTM:
 * os nomes e parâmetros abaixo são o contrato com o contêiner — não renomear.
 *
 * Nunca enviar nome, e-mail, telefone ou texto livre do formulário.
 */
type ParametrosPorEvento = {
  diagnostico_aberto: { origem: string };
  diagnostico_etapa_2: { origem: string };
  diagnostico_enviado: { origem: string; event_id: string; tipo_clinica: string; volume_leads: string };
  como_funciona_concluido: undefined;
  whatsapp_clique: { origem: string };
  virtual_page_view: { page_path: string };
};

export type NomeEvento = keyof ParametrosPorEvento;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Empurra o evento para o dataLayer. Pode ser chamado antes do GTM carregar: o GTM
 * processa a fila quando carrega. Sem consentimento o GTM nunca carrega, e a fila
 * fica só na memória da página.
 */
export function track<E extends NomeEvento>(
  evento: E,
  ...[params]: ParametrosPorEvento[E] extends undefined ? [] : [ParametrosPorEvento[E]]
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: evento, ...(params ?? {}) });
}

type EventoSemParametros = { [E in NomeEvento]: ParametrosPorEvento[E] extends undefined ? E : never }[NomeEvento];

/** Envia o evento no máximo uma vez por sessão do navegador. */
export function trackUmaVezNaSessao(evento: EventoSemParametros) {
  const chave = `quarkions:evento:${evento}`;
  try {
    if (sessionStorage.getItem(chave)) return;
    sessionStorage.setItem(chave, "1");
  } catch {
    // sessionStorage indisponível: envia mesmo assim (no pior caso, repete).
  }
  track(evento);
}
