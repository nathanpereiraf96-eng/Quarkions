/* eslint-disable @typescript-eslint/no-explicit-any */
// Rodar: npm test (node:test, sem dependências). "react-server" libera o import de server-only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { enviarLeadMeta, montarPayloadLead, normalizar } from "../src/lib/meta-capi.ts";

const h = (v: string) => createHash("sha256").update(v).digest("hex");
const ENTRADA = {
  eventId: "0b3a1c1e-5c2e-4a1e-9f0e-6a7b8c9d0e1f",
  email: "  Ana.Teste@Clinica.com.BR ",
  whatsapp: "5541999998888",
  nome: "Ana Maria Teste",
  cidade: "São José dos Pinhais",
  origem: "hero",
  url: "https://quarkions.com/?utm_source=google",
  ip: "200.1.2.3",
  userAgent: "Mozilla/5.0",
  fbp: "fb.1.123.456",
  momento: new Date("2026-09-29T12:00:00Z"),
};
const CONFIG = { pixelId: "1871748183699363", token: "TOKEN-SECRETO", versao: "v23.0" };

test("normalização antes do hash", () => {
  assert.equal(normalizar.email(ENTRADA.email), "ana.teste@clinica.com.br");
  assert.equal(normalizar.primeiroNome(ENTRADA.nome), "ana");
  assert.equal(normalizar.cidade(ENTRADA.cidade), "saojosedospinhais");
  assert.equal(normalizar.telefone("+55 (41) 99999-8888"), "5541999998888");
});

test("payload: hashes, campos sem hash e vazios omitidos", () => {
  const p = montarPayloadLead(ENTRADA) as any;
  const ev = p.data[0];
  assert.equal(ev.event_name, "Lead");
  assert.equal(ev.event_id, ENTRADA.eventId);
  assert.equal(ev.event_time, 1790683200);
  assert.equal(ev.action_source, "website");
  assert.equal(ev.event_source_url, ENTRADA.url);
  assert.deepEqual(ev.user_data.em, [h("ana.teste@clinica.com.br")]);
  assert.deepEqual(ev.user_data.ph, [h("5541999998888")]);
  assert.deepEqual(ev.user_data.fn, [h("ana")]);
  assert.deepEqual(ev.user_data.ct, [h("saojosedospinhais")]);
  assert.deepEqual(ev.user_data.country, [h("br")]);
  assert.equal(ev.user_data.client_ip_address, "200.1.2.3");
  assert.equal(ev.user_data.fbp, "fb.1.123.456");
  assert.ok(!("fbc" in ev.user_data), "fbc vazio deve ser omitido");
  assert.ok(!("test_event_code" in p), "sem código de teste, a chave não vai");
  assert.deepEqual(ev.custom_data, { content_name: "diagnostico", origem: "hero" });
  assert.equal(montarPayloadLead({ ...ENTRADA, cidade: "" }).data![0].user_data.ct, undefined);
});

test("com código de teste, vai no corpo", () => {
  assert.equal((montarPayloadLead(ENTRADA, "TEST123") as any).test_event_code, "TEST123");
});

test("envio: URL, corpo e sucesso", async () => {
  let chamada: { url: string; corpo: any } | undefined;
  const r = await enviarLeadMeta(ENTRADA, CONFIG, (async (url: string, init: RequestInit) => {
    chamada = { url, corpo: JSON.parse(String(init.body)) };
    return new Response("{}", { status: 200 });
  }) as typeof fetch);
  assert.deepEqual(r, { enviado: true, status: 200 });
  assert.equal(chamada!.url, "https://graph.facebook.com/v23.0/1871748183699363/events?access_token=TOKEN-SECRETO");
  assert.equal(chamada!.corpo.data[0].event_id, ENTRADA.eventId);
});

test("falhas não lançam e não logam token nem dados pessoais", async () => {
  const logs: string[] = [];
  const original = console.error;
  console.error = (...a: unknown[]) => logs.push(a.join(" "));
  try {
    const r400 = await enviarLeadMeta(ENTRADA, CONFIG, (async () => new Response("x", { status: 400 })) as typeof fetch);
    assert.equal(r400.enviado, false);
    const lento = (async (_u: string, init: RequestInit) =>
      new Promise((_, rej) => init.signal!.addEventListener("abort", () => rej(init.signal!.reason)))) as typeof fetch;
    const inicio = Date.now();
    const manterVivo = setTimeout(() => {}, 5000); // o timer do AbortSignal.timeout não segura o processo
    const rTimeout = await enviarLeadMeta(ENTRADA, CONFIG, lento);
    clearTimeout(manterVivo);
    assert.equal(rTimeout.enviado, false);
    assert.ok(Date.now() - inicio < 3600, "timeout de 3s");
    assert.deepEqual(await enviarLeadMeta(ENTRADA, { pixelId: "1", token: "" }), { enviado: false, motivo: "não configurado" });
  } finally {
    console.error = original;
  }
  const tudo = logs.join("\n");
  assert.match(tudo, /status 400/);
  for (const proibido of ["TOKEN-SECRETO", "ana", "5541999998888", "200.1.2.3"]) {
    assert.ok(!tudo.toLowerCase().includes(proibido.toLowerCase()), `log contém ${proibido}`);
  }
});
