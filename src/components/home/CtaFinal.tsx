"use client";

import { BotaoDiagnostico } from "@/components/diagnostico/BotaoDiagnostico";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Trilha } from "@/components/motion/Trilha";
import { DUR, EASE_ORBITA, useReducedMotionSafe } from "@/lib/motion";

type Caminhos = { w: number; h: number; ateBotao: string; depoisBotao: string };

/**
 * A trilha é montada em px a partir da posição real do título e do botão:
 * vem da borda esquerda, passa atrás do título, entra no botão e segue até a
 * borda direita. A partícula percorre só o trecho até o botão.
 */
function montar(secao: HTMLElement, titulo: HTMLElement, botao: HTMLElement): Caminhos {
  const s = secao.getBoundingClientRect();
  const t = titulo.getBoundingClientRect();
  const b = botao.getBoundingClientRect();
  const w = s.width;
  const h = s.height;
  const ty = t.top - s.top + t.height * 0.55;
  const by = b.top - s.top + b.height / 2;
  const bx0 = b.left - s.left - 10;
  const bx1 = b.right - s.left + 10;
  const xt = Math.min(w * 0.42, bx0 - 100);
  return {
    w,
    h,
    // Sempre avançando para a direita: o ponto atrás do título fica à esquerda do botão.
    ateBotao:
      `M-20 ${ty + 100}C${w * 0.16} ${ty + 100} ${xt - w * 0.12} ${ty - 16} ${xt} ${ty - 8}` +
      `C${xt + 70} ${ty - 4} ${bx0 - 150} ${by} ${bx0} ${by}`,
    depoisBotao: `M${bx1} ${by}C${bx1 + w * 0.1} ${by} ${w * 0.72} ${ty + 30} ${w + 20} ${ty - 70}`,
  };
}

export function CtaFinal() {
  const reduzir = useReducedMotionSafe();
  const secaoRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const botaoRef = useRef<HTMLSpanElement>(null);
  const [caminhos, setCaminhos] = useState<Caminhos | null>(null);

  useEffect(() => {
    const [secao, titulo, botao] = [secaoRef.current, tituloRef.current, botaoRef.current];
    if (!secao || !titulo || !botao) return;
    const obs = new ResizeObserver(() => setCaminhos(montar(secao, titulo, botao)));
    obs.observe(secao);
    return () => obs.disconnect();
  }, []);

  // Partícula: percorre a trilha uma vez até o botão, a cada hover/foco.
  const progresso = useMotionValue(0);
  const distancia = useTransform(progresso, (v) => `${v * 100}%`);
  const opacidade = useTransform(progresso, [0, 0.04, 0.995, 1], [0, 1, 1, 0]);
  const correndo = useRef(false);

  const percorrer = () => {
    if (reduzir || correndo.current) return;
    correndo.current = true;
    progresso.set(0);
    animate(progresso, 1, {
      duration: DUR.orquestracao,
      ease: EASE_ORBITA,
      onComplete: () => {
        correndo.current = false;
        progresso.set(0);
      },
    });
  };

  return (
    <section
      ref={secaoRef}
      id="agendar"
      data-tema="escuro"
      aria-labelledby="cta-titulo"
      className="relative overflow-hidden bg-camara py-[clamp(96px,14vw,184px)] text-center text-white"
    >
      {caminhos && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[caminhos.ateBotao, caminhos.depoisBotao].map((d) => (
            <Trilha
              key={d}
              viewBox={`0 0 ${caminhos.w} ${caminhos.h}`}
              d={d}
              cor="ciano"
              className="absolute inset-0 size-full opacity-50"
            />
          ))}
          <svg
            viewBox={`0 0 ${caminhos.w} ${caminhos.h}`}
            className="absolute inset-0 size-full"
            fill="none"
          >
            <motion.g
              style={{
                offsetPath: `path("${caminhos.ateBotao}")`,
                offsetRotate: "0deg",
                offsetAnchor: "0 0",
                offsetDistance: distancia,
                opacity: opacidade,
              }}
            >
              <circle r={10} fill="var(--ciano)" opacity={0.3} />
              <circle r={3.5} fill="var(--ciano)" />
            </motion.g>
          </svg>
        </div>
      )}

      <div className="container-site relative">
        <h2 ref={tituloRef} id="cta-titulo" className="mx-auto max-w-[18ch] text-h2">
          Vamos ver onde sua clínica está perdendo pacientes?
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-lead text-white/80">
          Em 30 minutos, mapeamos seu fluxo de atendimento, o volume de contatos e onde os leads
          esfriam. Você sai com um diagnóstico, mesmo que não contrate.
        </p>
        <span
          ref={botaoRef}
          className="mt-10 inline-block"
          onMouseEnter={percorrer}
          onFocus={percorrer}
        >
          <BotaoDiagnostico origem="cta-final" variante="sobre-escuro" />
        </span>
      </div>
    </section>
  );
}
