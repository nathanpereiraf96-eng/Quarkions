"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Trilha } from "@/components/motion/Trilha";
import { Botao } from "@/components/ui/Botao";
import { Pontos } from "@/components/ui/Pontos";
import {
  CANAIS,
  MAX_DOR,
  SLUG_TIPO_CLINICA,
  SLUG_VOLUME,
  TIPOS_CLINICA,
  USA_CRM,
  VOLUMES,
  errosPorCampo,
  etapa1Schema,
  etapa2Schema,
  mascararWhatsapp,
} from "@/lib/diagnostico/schema";
import { lerUtm } from "@/lib/diagnostico/rastreio";
import { lerConsentimento } from "@/lib/consentimento";
import { track } from "@/lib/rastreamento";
import { DUR, EASE_ORBITA } from "@/lib/motion";
import { SITE } from "@/lib/site";

type Valores = {
  nome: string;
  email: string;
  whatsapp: string;
  clinica: string;
  cidade: string;
  tipo_clinica: string;
  volume_leads: string;
  canais: string[];
  usa_crm: string;
  maior_dor: string;
  consentimento: boolean;
  empresa_site: string;
};

const INICIAIS: Valores = {
  nome: "",
  email: "",
  whatsapp: "",
  clinica: "",
  cidade: "",
  tipo_clinica: "",
  volume_leads: "",
  canais: [],
  usa_crm: "",
  maior_dor: "",
  consentimento: false,
  empresa_site: "",
};

const ORDEM_1 = ["nome", "email", "whatsapp", "clinica", "cidade"];
const ORDEM_2 = ["tipo_clinica", "volume_leads", "canais", "usa_crm", "maior_dor", "consentimento"];

type Erros = Record<string, string>;
type Etapa = 1 | 2 | "sucesso";

export function DiagnosticoForm({ origem }: { origem: string }) {
  const base = useId();
  const reduzir = useReducedMotion() === true;
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [direcao, setDirecao] = useState(1);
  const [valores, setValores] = useState<Valores>(INICIAIS);
  const [erros, setErros] = useState<Erros>({});
  const [anuncio, setAnuncio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const focoPendente = useRef<string | null>(null);

  const idCampo = (campo: string) => `${base}-${campo}`;
  const idErro = (campo: string) => `${base}-${campo}-erro`;

  /** Foca o campo assim que ele existir (na troca de etapa, ele monta depois da saída da anterior). */
  const focar = (campo: string, tentativas = 60) => {
    const el = document.getElementById(idCampo(campo));
    if (el) el.focus();
    else if (tentativas > 0) requestAnimationFrame(() => focar(campo, tentativas - 1));
  };

  const definir = <K extends keyof Valores>(campo: K, valor: Valores[K]) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    if (erros[campo])
      setErros((atuais) => {
        const resto = { ...atuais };
        delete resto[campo];
        return resto;
      });
  };

  /** Mostra os erros, anuncia e leva o foco ao primeiro campo com problema. */
  const mostrarErros = (novos: Erros, ordem: string[], trocandoDeEtapa = false) => {
    const primeiro = ordem.find((c) => novos[c]);
    if (!primeiro) return;
    const n = Object.keys(novos).length;
    setErros(novos);
    setAnuncio(`Revise ${n} ${n > 1 ? "campos" : "campo"}. ${novos[primeiro]}`);
    if (trocandoDeEtapa) focoPendente.current = primeiro;
    else requestAnimationFrame(() => focar(primeiro));
  };

  const irPara = (proxima: Etapa, dir: number) => {
    setDirecao(dir);
    setEtapa(proxima);
  };

  const avancar = () => {
    const r = etapa1Schema.safeParse(valores);
    if (!r.success) return mostrarErros(errosPorCampo(r.error), ORDEM_1);
    setErros({});
    setAnuncio("Etapa 2 de 2: sobre seu atendimento.");
    track("diagnostico_etapa_2", { origem });
    focoPendente.current = ORDEM_2[0];
    irPara(2, 1);
  };

  const enviar = async () => {
    const r = etapa2Schema.safeParse(valores);
    if (!r.success) return mostrarErros(errosPorCampo(r.error), ORDEM_2);

    setEnviando(true);
    setErroEnvio("");
    setAnuncio("Enviando.");
    // Mesmo id no dataLayer (Pixel via GTM) e na API de Conversões: a Meta deduplica o Lead.
    const eventId = crypto.randomUUID();
    try {
      const resposta = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...valores,
          origem,
          pagina: window.location.pathname,
          ...lerUtm(),
          event_id: eventId,
          consentimento_cookies: lerConsentimento() === "aceito",
        }),
      });
      const json = (await resposta.json().catch(() => ({}))) as { ok?: boolean; erro?: string; campos?: Erros };

      if (resposta.ok && json.ok) {
        setAnuncio("");
        // Só dados de qualificação (em slug): nada de nome, e-mail, telefone ou texto livre.
        track("diagnostico_enviado", {
          origem,
          event_id: eventId,
          tipo_clinica: SLUG_TIPO_CLINICA[r.data.tipo_clinica],
          volume_leads: SLUG_VOLUME[r.data.volume_leads],
        });
        irPara("sucesso", 1);
        return;
      }
      if (resposta.status === 422 && json.campos) {
        const naEtapa1 = ORDEM_1.some((c) => json.campos?.[c]);
        if (naEtapa1 && etapa !== 1) {
          irPara(1, -1);
          mostrarErros(json.campos, ORDEM_1, true);
        } else {
          mostrarErros(json.campos, naEtapa1 ? ORDEM_1 : ORDEM_2);
        }
        return;
      }
      const mensagem =
        resposta.status === 429 && json.erro
          ? json.erro
          : `Não conseguimos enviar agora. Tente de novo em instantes${SITE.email ? ` ou escreva para ${SITE.email}` : ""}.`;
      setErroEnvio(mensagem);
      setAnuncio(mensagem);
    } catch {
      const mensagem = `Não conseguimos enviar agora. Tente de novo em instantes${SITE.email ? ` ou escreva para ${SITE.email}` : ""}.`;
      setErroEnvio(mensagem);
      setAnuncio(mensagem);
    } finally {
      setEnviando(false);
    }
  };

  // Depois da troca de etapa, o foco vai para o campo pendente.
  const aoTrocarEtapa = () => {
    const campo = focoPendente.current;
    focoPendente.current = null;
    if (campo) focar(campo);
  };

  const transicao = reduzir ? { duration: 0 } : { duration: 0.3, ease: EASE_ORBITA };
  const deslize = reduzir ? 0 : 24;

  const erro = (campo: string) =>
    erros[campo] ? (
      <p id={idErro(campo)} className="mt-2 flex items-start gap-1.5 text-small font-medium text-grafite">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" fill="currentColor">
          <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5h1.5v5h-1.5v-5Zm0 6h1.5V12h-1.5v-1.5Z" />
        </svg>
        {erros[campo]}
      </p>
    ) : null;

  const propsCampo = (campo: string) => ({
    id: idCampo(campo),
    "aria-invalid": erros[campo] ? true : undefined,
    "aria-describedby": erros[campo] ? idErro(campo) : undefined,
  });

  const classeInput =
    "mt-2 h-12 w-full rounded-botao border bg-white px-4 text-body text-grafite placeholder:text-grafite-suave/70 aria-invalid:border-[1.5px] aria-invalid:border-grafite";

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      <AnimatePresence mode="wait" initial={false} custom={direcao} onExitComplete={aoTrocarEtapa}>
        {etapa === "sucesso" ? (
          <motion.div
            key="sucesso"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transicao}
          >
            <Sucesso reduzir={reduzir} />
          </motion.div>
        ) : (
          <motion.form
            key={`etapa-${etapa}`}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (etapa === 1) avancar();
              else void enviar();
            }}
            custom={direcao}
            variants={{
              entra: (d: number) => ({ opacity: 0, x: d * deslize }),
              parado: { opacity: 1, x: 0 },
              sai: (d: number) => ({ opacity: 0, x: -d * deslize }),
            }}
            initial="entra"
            animate="parado"
            exit="sai"
            transition={transicao}
          >
            {/* Indicador de etapas */}
            <div>
              <p className="text-small text-grafite-suave">Etapa {etapa} de 2</p>
              <div className="mt-2 h-0.5 overflow-hidden rounded-pilula bg-linha">
                <motion.div
                  className="h-full origin-left bg-ultramar"
                  initial={{ scaleX: etapa === 1 ? 0.5 : 0.5 }}
                  animate={{ scaleX: etapa === 1 ? 0.5 : 1 }}
                  transition={reduzir ? { duration: 0 } : { duration: DUR.transicao, ease: EASE_ORBITA }}
                />
              </div>
              <h3 className="mt-6 text-h3">{etapa === 1 ? "Sobre você" : "Sobre seu atendimento"}</h3>
            </div>

            {/* Honeypot: oculto para pessoas e leitores de tela */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Site da empresa
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={valores.empresa_site}
                  onChange={(e) => definir("empresa_site", e.target.value)}
                />
              </label>
            </div>

            {etapa === 1 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor={idCampo("nome")} className="text-small font-semibold">
                    Nome
                  </label>
                  <input
                    {...propsCampo("nome")}
                    data-foco-inicial
                    className={`${classeInput} border-linha`}
                    autoComplete="name"
                    value={valores.nome}
                    onChange={(e) => definir("nome", e.target.value)}
                  />
                  {erro("nome")}
                </div>
                <div>
                  <label htmlFor={idCampo("email")} className="text-small font-semibold">
                    E-mail
                  </label>
                  <input
                    {...propsCampo("email")}
                    type="email"
                    inputMode="email"
                    className={`${classeInput} border-linha`}
                    autoComplete="email"
                    value={valores.email}
                    onChange={(e) => definir("email", e.target.value)}
                  />
                  {erro("email")}
                </div>
                <div>
                  <label htmlFor={idCampo("whatsapp")} className="text-small font-semibold">
                    WhatsApp
                  </label>
                  <input
                    {...propsCampo("whatsapp")}
                    type="tel"
                    inputMode="tel"
                    placeholder="(41) 99999-9999"
                    className={`${classeInput} nums border-linha`}
                    autoComplete="tel-national"
                    value={valores.whatsapp}
                    onChange={(e) => definir("whatsapp", mascararWhatsapp(e.target.value))}
                  />
                  {erro("whatsapp")}
                </div>
                <div>
                  <label htmlFor={idCampo("clinica")} className="text-small font-semibold">
                    Nome da clínica
                  </label>
                  <input
                    {...propsCampo("clinica")}
                    className={`${classeInput} border-linha`}
                    autoComplete="organization"
                    value={valores.clinica}
                    onChange={(e) => definir("clinica", e.target.value)}
                  />
                  {erro("clinica")}
                </div>
                <div>
                  <label htmlFor={idCampo("cidade")} className="text-small font-semibold">
                    Cidade <span className="font-normal text-grafite-suave">(opcional)</span>
                  </label>
                  <input
                    {...propsCampo("cidade")}
                    className={`${classeInput} border-linha`}
                    autoComplete="address-level2"
                    value={valores.cidade}
                    onChange={(e) => definir("cidade", e.target.value)}
                  />
                  {erro("cidade")}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-7">
                <div>
                  <label htmlFor={idCampo("tipo_clinica")} className="text-small font-semibold">
                    Tipo de clínica
                  </label>
                  <select
                    {...propsCampo("tipo_clinica")}
                    className={`${classeInput} border-linha`}
                    value={valores.tipo_clinica}
                    onChange={(e) => definir("tipo_clinica", e.target.value)}
                  >
                    <option value="" disabled>
                      Escolha uma opção
                    </option>
                    {TIPOS_CLINICA.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {erro("tipo_clinica")}
                </div>

                <Pilulas
                  legenda="Contatos por mês, aproximadamente"
                  tipo="radio"
                  opcoes={VOLUMES}
                  base={idCampo("volume_leads")}
                  erroId={erros.volume_leads ? idErro("volume_leads") : undefined}
                  selecionado={(o) => valores.volume_leads === o}
                  alternar={(o) => definir("volume_leads", o)}
                >
                  {erro("volume_leads")}
                </Pilulas>

                <Pilulas
                  legenda="Por onde chegam os contatos"
                  dica="Marque todos que se aplicam."
                  tipo="checkbox"
                  opcoes={CANAIS}
                  base={idCampo("canais")}
                  erroId={erros.canais ? idErro("canais") : undefined}
                  selecionado={(o) => valores.canais.includes(o)}
                  alternar={(o) =>
                    definir(
                      "canais",
                      valores.canais.includes(o) ? valores.canais.filter((c) => c !== o) : [...valores.canais, o],
                    )
                  }
                >
                  {erro("canais")}
                </Pilulas>

                <Pilulas
                  legenda="Usa CRM?"
                  tipo="radio"
                  opcoes={USA_CRM}
                  base={idCampo("usa_crm")}
                  erroId={erros.usa_crm ? idErro("usa_crm") : undefined}
                  selecionado={(o) => valores.usa_crm === o}
                  alternar={(o) => definir("usa_crm", o)}
                >
                  {erro("usa_crm")}
                </Pilulas>

                <div>
                  <label htmlFor={idCampo("maior_dor")} className="text-small font-semibold">
                    Onde você sente que mais perde pacientes?{" "}
                    <span className="font-normal text-grafite-suave">(opcional)</span>
                  </label>
                  <textarea
                    {...propsCampo("maior_dor")}
                    rows={3}
                    maxLength={MAX_DOR}
                    className={`${classeInput} h-auto resize-y border-linha py-3`}
                    value={valores.maior_dor}
                    onChange={(e) => definir("maior_dor", e.target.value)}
                  />
                  <p className="mt-1 text-right text-small text-grafite-suave">
                    <span className="nums">{valores.maior_dor.length}</span>/{MAX_DOR}
                  </p>
                  {erro("maior_dor")}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      {...propsCampo("consentimento")}
                      type="checkbox"
                      className="mt-1 size-5 shrink-0 accent-ultramar"
                      checked={valores.consentimento}
                      onChange={(e) => definir("consentimento", e.target.checked)}
                    />
                    <label htmlFor={idCampo("consentimento")} className="text-small">
                      Concordo com o uso destes dados para contato sobre o diagnóstico, conforme a{" "}
                      <Link href="/privacidade" target="_blank" className="font-semibold text-ultramar underline underline-offset-2">
                        Política de privacidade
                      </Link>
                      .
                    </label>
                  </div>
                  {erro("consentimento")}
                </div>
              </div>
            )}

            {erroEnvio && (
              <p role="alert" className="mt-6 rounded-botao border border-linha bg-nevoa px-4 py-3 text-small">
                {erroEnvio}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {etapa === 2 && (
                <Botao variante="secundario" onClick={() => irPara(1, -1)} disabled={enviando}>
                  Voltar
                </Botao>
              )}
              {etapa === 1 ? (
                <Botao type="submit">Continuar</Botao>
              ) : (
                <Botao type="submit" disabled={enviando} aria-disabled={enviando} className="min-w-[13rem]">
                  {enviando ? (
                    <span className="inline-flex items-center gap-2">
                      Enviando
                      <Pontos />
                    </span>
                  ) : (
                    "Agendar diagnóstico"
                  )}
                </Botao>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type PilulasProps<T extends string> = {
  legenda: string;
  dica?: string;
  tipo: "radio" | "checkbox";
  opcoes: readonly T[];
  /** Id do primeiro input (recebe o foco quando há erro). */
  base: string;
  erroId?: string;
  selecionado: (o: T) => boolean;
  alternar: (o: T) => void;
  children?: React.ReactNode;
};

function Pilulas<T extends string>({
  legenda,
  dica,
  tipo,
  opcoes,
  base,
  erroId,
  selecionado,
  alternar,
  children,
}: PilulasProps<T>) {
  const nome = `${base}-grupo`;
  return (
    <fieldset aria-describedby={erroId} aria-invalid={erroId ? true : undefined}>
      <legend className="text-small font-semibold">
        {legenda}
        {dica && <span className="font-normal text-grafite-suave"> {dica}</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {opcoes.map((o, i) => {
          const id = i === 0 ? base : `${base}-${i}`;
          return (
            <span key={o}>
              <input
                id={id}
                type={tipo}
                name={nome}
                value={o}
                className="peer sr-only"
                checked={selecionado(o)}
                onChange={() => alternar(o)}
              />
              <label
                htmlFor={id}
                className="inline-flex h-10 cursor-pointer items-center rounded-pilula border border-linha bg-white px-4 text-small font-medium text-grafite transition-colors duration-200 select-none hover:border-ultramar peer-checked:border-ultramar peer-checked:bg-ultramar peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ultramar"
              >
                {o}
              </label>
            </span>
          );
        })}
      </div>
      {children}
    </fieldset>
  );
}

function Sucesso({ reduzir }: { reduzir: boolean }) {
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  const mensagem = encodeURIComponent("Olá! Acabei de pedir um diagnóstico pelo site da Quarkions.");

  return (
    <div className="py-2">
      <div aria-hidden="true" className="relative h-20 w-full max-w-[320px]">
        <Trilha
          viewBox="0 0 320 80"
          d="M4 62C70 64 110 22 180 28s104 22 128 12"
          cor="ultramar"
          desenhar
          comParticula
          duracao={DUR.orquestracao}
          className="absolute inset-0 size-full"
        />
        <svg viewBox="0 0 320 80" className="absolute inset-0 size-full" fill="none">
          <motion.circle
            cx={308}
            cy={40}
            r={7}
            fill="var(--ambar)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            initial={reduzir ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: reduzir ? 0 : DUR.orquestracao - 0.05, duration: DUR.transicao, ease: EASE_ORBITA }}
          />
        </svg>
      </div>

      <h3 ref={tituloRef} tabIndex={-1} className="mt-6 text-h2 outline-none">
        Diagnóstico solicitado.
      </h3>
      <p className="mt-4 max-w-[46ch] text-lead text-grafite-suave">
        Vamos entrar em contato pelo WhatsApp em até 1 dia útil para combinar o melhor horário.
      </p>
      {SITE.whatsapp && (
        <div className="mt-8">
          <Botao
            href={`https://wa.me/${SITE.whatsapp}?text=${mensagem}`}
            data-origem="sucesso-diagnostico"
            variante="secundario"
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar agora pelo WhatsApp
          </Botao>
        </div>
      )}
    </div>
  );
}
