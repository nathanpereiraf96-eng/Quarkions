const CHAVE = "quarkions:utm";
const PARAMETROS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Utm = Partial<Record<(typeof PARAMETROS)[number], string>>;

/** Guarda as UTMs da primeira página visitada na sessão. */
export function capturarUtm() {
  try {
    if (sessionStorage.getItem(CHAVE) !== null) return;
    const busca = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const p of PARAMETROS) {
      const v = busca.get(p);
      if (v) utm[p] = v.slice(0, 200);
    }
    sessionStorage.setItem(CHAVE, JSON.stringify(utm));
  } catch {
    // sessionStorage indisponível (modo privado, bloqueio): segue sem UTM.
  }
}

export function lerUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) ?? "{}") as Utm;
  } catch {
    return {};
  }
}
