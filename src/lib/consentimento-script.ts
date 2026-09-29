// Módulo sem "use client": o layout (servidor) precisa do texto do script, não de uma referência.

export const COOKIE_CONSENTIMENTO = "quarkions_consentimento";

/**
 * Roda no <head>, antes da primeira pintura: se já houver escolha salva, marca o <html>
 * com data-consentimento-inicial. O aviso de cookies vem no HTML do servidor e o CSS o
 * esconde sem esperar o JavaScript (o aviso não atrasa o LCP).
 */
export const SCRIPT_CONSENTIMENTO = `try{if(/(?:^|; )${COOKIE_CONSENTIMENTO}=(aceito|recusado)/.test(document.cookie))document.documentElement.dataset.consentimentoInicial="1"}catch(e){}`;
