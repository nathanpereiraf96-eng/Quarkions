"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Trilha } from "@/components/motion/Trilha";
import { DUR, EASE_ORBITA } from "@/lib/motion";

type No = {
  id: string;
  rotulo: string;
  frase: string;
  lado: "entrada" | "saida";
  /** Conexão com uma pessoa: âmbar. */
  humano?: boolean;
};

const NOS: No[] = [
  { id: "whatsapp", lado: "entrada", rotulo: "WhatsApp", frase: "Conversas pelo canal oficial, com histórico preservado." },
  { id: "formularios", lado: "entrada", rotulo: "Formulários e anúncios", frase: "Leads de campanhas entram direto no fluxo, sem planilha no meio." },
  { id: "site", lado: "entrada", rotulo: "Site", frase: "Quem pede contato pelo site recebe resposta na hora." },
  { id: "crm", lado: "saida", rotulo: "Seu CRM", frase: "Cada conversa, qualificação e status fica registrado no CRM." },
  { id: "agenda", lado: "saida", rotulo: "Sua agenda", frase: "Horários oferecidos a partir da agenda real da clínica." },
  { id: "equipe", lado: "saida", rotulo: "Sua equipe", humano: true, frase: "Exceções, reclamações e casos sensíveis vão para uma pessoa, com o contexto da conversa." },
];

const ENTRADAS = NOS.filter((n) => n.lado === "entrada");
const SAIDAS = NOS.filter((n) => n.lado === "saida");

const DICA = "Passe o mouse, toque ou navegue com o teclado por cada ponto para ver a conexão.";

// Desktop: viewBox 1000×340, mesma proporção do container (escala uniforme).
const D = { w: 1000, h: 340, linhas: [60, 170, 280], centro: 170, fimEntrada: 264, inicioSaida: 736 };
const caminhoDesktop = (lado: No["lado"], y: number) =>
  lado === "entrada"
    ? `M272 ${y}C360 ${y} 352 ${D.centro} 450 ${D.centro}`
    : `M550 ${D.centro}C648 ${D.centro} 640 ${y} 728 ${y}`;

// Mobile: em px. Tronco vertical em x=16, nós a partir de x=48.
const M = { linhas: [28, 84, 140], centro: 224, saidas: [308, 364, 420], altura: 448 };
const caminhoMobile = (lado: No["lado"], y: number) => {
  const c = M.centro;
  return lado === "entrada"
    ? `M44 ${y}C24 ${y} 16 ${y + 8} 16 ${y + 28}L16 ${c - 28}C16 ${c - 8} 24 ${c} 44 ${c}`
    : `M44 ${c}C24 ${c} 16 ${c + 8} 16 ${c + 28}L16 ${y - 28}C16 ${y - 8} 24 ${y} 44 ${y}`;
};

export function Integracoes() {
  const [ativo, setAtivo] = useState<string | null>(null);
  const noAtivo = NOS.find((n) => n.id === ativo);

  const botao = (no: No, className: string, style: React.CSSProperties) => (
    <button
      key={no.id}
      type="button"
      aria-pressed={ativo === no.id}
      aria-describedby="integracoes-frase"
      onMouseEnter={() => setAtivo(no.id)}
      onFocus={() => setAtivo(no.id)}
      onClick={() => setAtivo(no.id)}
      style={style}
      className={`absolute rounded-pilula border px-4 py-2 font-medium whitespace-nowrap transition-colors duration-200 ${
        no.humano
          ? "border-ambar bg-ambar text-grafite aria-pressed:border-grafite"
          : "border-linha bg-nevoa text-grafite hover:border-ultramar aria-pressed:border-ultramar"
      } ${className}`}
    >
      {no.rotulo}
    </button>
  );

  const trilhas = (caminho: (lado: No["lado"], y: number) => string, ys: (no: No) => number, viewBox: string, className: string) => (
    <>
      {NOS.map((no) => (
        <Trilha key={`base-${no.id}`} viewBox={viewBox} d={caminho(no.lado, ys(no))} cor="linha" className={className} />
      ))}
      {NOS.map((no) => (
        <Trilha
          key={`ativa-${no.id}`}
          viewBox={viewBox}
          d={caminho(no.lado, ys(no))}
          cor={no.humano ? "ambar" : "ultramar"}
          desenhar={ativo === no.id}
          duracao={DUR.transicao}
          espessura={1.5}
          className={className}
        />
      ))}
    </>
  );

  const isis = (
    <span className="inline-flex items-center justify-center gap-2 rounded-pilula border border-ultramar bg-white px-5 py-3 text-h3">
      <span aria-hidden="true" className="size-[7px] rounded-pilula bg-ultramar" />
      ISIS
    </span>
  );

  return (
    <Section id="integracoes" tema="branco" aria-labelledby="integracoes-titulo">
      <Container grid>
        <div className="col-span-12 lg:col-span-7">
          <h2 id="integracoes-titulo" className="text-h2">
            Sem trocar seus sistemas.
          </h2>
          <p className="mt-6 max-w-texto text-lead text-grafite-suave">
            A Quarkions se conecta aos canais e ferramentas que sua clínica já usa. Sua equipe
            continua trabalhando onde trabalha hoje.
          </p>
        </div>

        <figure
          className="col-span-12 mt-14"
          role="group"
          aria-labelledby="integracoes-legenda"
        >
          <figcaption id="integracoes-legenda" className="sr-only">
            Diagrama de conexões. WhatsApp, formulários e anúncios e site entram na ISIS. A
            ISIS registra no seu CRM, agenda na sua agenda e passa exceções para a sua equipe.
          </figcaption>

          {/* Desktop: horizontal */}
          <div className="relative hidden aspect-[1000/340] w-full lg:block">
            {trilhas(caminhoDesktop, (no) => D.linhas[(no.lado === "entrada" ? ENTRADAS : SAIDAS).indexOf(no)], `0 0 ${D.w} ${D.h}`, "absolute inset-0 size-full")}
            {ENTRADAS.map((no, i) =>
              botao(no, "-translate-y-1/2", {
                right: `${((D.w - D.fimEntrada) / D.w) * 100}%`,
                top: `${(D.linhas[i] / D.h) * 100}%`,
              }),
            )}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{isis}</div>
            {SAIDAS.map((no, i) =>
              botao(no, "-translate-y-1/2", {
                left: `${(D.inicioSaida / D.w) * 100}%`,
                top: `${(D.linhas[i] / D.h) * 100}%`,
              }),
            )}
          </div>

          {/* Mobile: vertical */}
          <div className="relative lg:hidden" style={{ height: M.altura }}>
            {trilhas(
              caminhoMobile,
              (no) => (no.lado === "entrada" ? M.linhas[ENTRADAS.indexOf(no)] : M.saidas[SAIDAS.indexOf(no)]),
              `0 0 48 ${M.altura}`,
              "absolute top-0 left-0 h-full w-12",
            )}
            {ENTRADAS.map((no, i) => botao(no, "-translate-y-1/2", { left: 48, top: M.linhas[i] }))}
            <div className="absolute left-12 -translate-y-1/2" style={{ top: M.centro }}>
              {isis}
            </div>
            {SAIDAS.map((no, i) => botao(no, "-translate-y-1/2", { left: 48, top: M.saidas[i] }))}
          </div>

          <div
            id="integracoes-frase"
            aria-live="polite"
            className="mt-10 grid min-h-[3.5em] max-w-texto text-lead lg:mt-6"
          >
            <AnimatePresence initial={false}>
              <motion.p
                key={noAtivo?.id ?? "dica"}
                className={`[grid-area:1/1] ${noAtivo ? "" : "text-grafite-suave"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DUR.feedback, ease: EASE_ORBITA }}
              >
                {noAtivo ? (
                  <>
                    <span className="font-semibold">{noAtivo.rotulo}.</span> {noAtivo.frase}
                  </>
                ) : (
                  DICA
                )}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-8 max-w-texto text-small text-grafite-suave">
            As integrações disponíveis são confirmadas no diagnóstico, de acordo com os sistemas
            da sua clínica.
          </p>
        </figure>
      </Container>
    </Section>
  );
}
