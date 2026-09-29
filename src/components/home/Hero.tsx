"use client";

import { BotaoDiagnostico } from "@/components/diagnostico/BotaoDiagnostico";
import { useEffect, useRef, useState } from "react";
import { Trilha } from "@/components/motion/Trilha";
import { Botao } from "@/components/ui/Botao";
import { HeroSimulacao } from "./HeroSimulacao";

const TITULO = ["Todo lead respondido em segundos.", "Toda exceção com a pessoa certa."];

// Trilhas cruzam atrás do título e terminam atrás do painel (viewBox 1440×820).
const TRILHAS = {
  linhaA: "M-40 640C240 628 420 420 700 420s460 150 780-110",
  linhaB: "M-40 250C320 270 500 560 800 540s420-330 680-300",
  ultramar: "M-40 470C230 480 440 250 740 290s260 170 340 130",
};

export function Hero() {
  const [simulacaoAtiva, setSimulacaoAtiva] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);

  // A entrada é CSS (globals.css, `.hero-*`): o texto aparece no tempo certo sem esperar
  // o JavaScript. A simulação começa quando a animação do painel termina — ou na hora,
  // se ela já acabou (ou nem existe, com movimento reduzido) antes da hidratação.
  useEffect(() => {
    const painel = painelRef.current;
    if (!painel) return;
    let vivo = true;
    Promise.all(painel.getAnimations().map((a) => a.finished))
      .then(() => vivo && setSimulacaoAtiva(true))
      .catch(() => vivo && setSimulacaoAtiva(true));
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <section
      data-tema="claro"
      aria-labelledby="hero-titulo"
      className="relative overflow-hidden bg-nevoa pt-[clamp(40px,7vw,104px)] pb-[clamp(80px,10vw,140px)]"
    >
      {/* No mobile as trilhas ficam só na faixa do painel, para não riscar o texto. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px] lg:top-0 lg:h-auto"
      >
        <Trilha
          viewBox="0 0 1440 820"
          preserveAspectRatio="xMidYMid slice"
          d={TRILHAS.linhaA}
          cor="linha"
          desenhar
          duracao={1.4}
          className="absolute inset-0 size-full opacity-60"
        />
        <Trilha
          viewBox="0 0 1440 820"
          preserveAspectRatio="xMidYMid slice"
          d={TRILHAS.linhaB}
          cor="linha"
          desenhar
          atraso={0.1}
          duracao={1.4}
          className="absolute inset-0 size-full opacity-60"
        />
        <Trilha
          viewBox="0 0 1440 820"
          preserveAspectRatio="xMidYMid slice"
          d={TRILHAS.ultramar}
          cor="ultramar"
          desenhar
          comParticula
          atraso={0.05}
          duracao={1.5}
          className="absolute inset-0 size-full opacity-40"
        />
      </div>

      <div className="container-site relative grid-site gap-y-14 lg:items-center">
        <div className="col-span-12 lg:col-span-6">
          <h1 id="hero-titulo" className="text-display">
            {TITULO.map((linha, i) => (
              <span key={linha} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                <span className="hero-linha block" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                  {linha}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-texto">
            <p className="mt-8 max-w-[34rem] text-lead text-grafite-suave">
              A Quarkions implanta um time de IA conectado ao WhatsApp, ao CRM e à agenda da
              sua clínica. Ele responde, qualifica, agenda e recupera oportunidades — e chama
              sua equipe quando precisa dela.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <BotaoDiagnostico origem="hero" />
              <Botao href="#como-funciona" variante="secundario">
                Ver como funciona
              </Botao>
            </div>
            <p className="mt-6 text-small text-grafite-suave">
              Diagnóstico de 30 minutos, sem custo. Implantação em até 10 dias úteis.
            </p>
          </div>
        </div>

        <div
          ref={painelRef}
          className="hero-painel col-span-12 md:col-span-8 md:col-start-3 lg:col-span-5 lg:col-start-8"
        >
          <HeroSimulacao ativo={simulacaoAtiva} />
        </div>
      </div>
    </section>
  );
}
