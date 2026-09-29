"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Nums } from "@/components/ui/Nums";
import { Pontos } from "@/components/ui/Pontos";
import { DUR, EASE_ORBITA, useReducedMotionSafe } from "@/lib/motion";

type Passo =
  | { tipo: "lead"; texto: string; em: number }
  | { tipo: "isis"; texto: string; em: number; digita: number }
  | { tipo: "handoff"; texto: string; em: number };

// Linha do tempo em ms. Cada resposta da ISIS é precedida de 700–900ms digitando.
const CHEGADA = 300;
const PRIMEIRA_RESPOSTA = 4300; // ISIS começa a digitar: cronômetro para em 00:04

const ROTEIRO: Passo[] = [
  { tipo: "lead", em: CHEGADA, texto: "Oi, boa noite! Vocês fazem implante? Quanto fica mais ou menos?" },
  {
    tipo: "isis",
    digita: PRIMEIRA_RESPOSTA,
    em: 5100,
    texto:
      "Boa noite! Fazemos sim. O valor depende da avaliação, porque cada caso é diferente. Posso te fazer duas perguntas rápidas para já deixar sua avaliação encaminhada?",
  },
  { tipo: "lead", em: 7300, texto: "Pode sim" },
  {
    tipo: "isis",
    digita: 8100,
    em: 8800,
    texto: "Você já tem algum dente faltando ou é para substituir uma prótese?",
  },
  { tipo: "lead", em: 10600, texto: "Uso uma ponte há anos e ela quebrou" },
  {
    tipo: "isis",
    digita: 11400,
    em: 12300,
    texto: "Entendi. Tenho avaliação na quinta às 9h ou às 14h30. Qual fica melhor?",
  },
  { tipo: "lead", em: 14300, texto: "14h30. Ah, vocês aceitam meu convênio?" },
  { tipo: "handoff", em: 15500, texto: "Transferido para a recepção · dúvida sobre convênio" },
  {
    tipo: "isis",
    digita: 16300,
    em: 17100,
    texto:
      "Anotei sua avaliação para quinta às 14h30. A Carla, da recepção, confirma seu convênio logo cedo.",
  },
];

const FIM = ROTEIRO[ROTEIRO.length - 1].em;
const SAIDA = FIM + 4000;
const REINICIO = SAIDA + DUR.transicao * 1000;

/** Instantes em que o que está na tela muda. */
const MARCOS = Array.from(
  new Set([
    ...ROTEIRO.flatMap((p) => (p.tipo === "isis" ? [p.digita, p.em] : [p.em])),
    ...[1, 2, 3, 4].map((s) => CHEGADA + s * 1000),
    SAIDA,
    REINICIO,
  ]),
).sort((a, b) => a - b);

function cronometro(t: number) {
  const s = Math.max(0, Math.floor((Math.min(t, PRIMEIRA_RESPOSTA) - CHEGADA) / 1000));
  return `00:${String(s).padStart(2, "0")}`;
}

function inscreverAba(aviso: () => void) {
  document.addEventListener("visibilitychange", aviso);
  return () => document.removeEventListener("visibilitychange", aviso);
}

function useAbaVisivel() {
  return useSyncExternalStore(
    inscreverAba,
    () => document.visibilityState === "visible",
    () => true,
  );
}

const ENTRADA = { duration: DUR.transicao, ease: EASE_ORBITA };

export function HeroSimulacao({ ativo }: { ativo: boolean }) {
  const reduzir = useReducedMotionSafe();
  const abaVisivel = useAbaVisivel();
  const painelRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);

  const [naTela, setNaTela] = useState(true);
  const [pausado, setPausado] = useState(false);
  const [{ t, ciclo }, setEstado] = useState({ t: 0, ciclo: 0 });

  const rodando = ativo && naTela && abaVisivel && !pausado && !reduzir;

  // Pausa quando o painel sai da tela.
  useEffect(() => {
    const el = painelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Relógio da simulação: avança de marco em marco; ao pausar, guarda o tempo parcial.
  useEffect(() => {
    if (!rodando) return;
    let inicio = performance.now() - tRef.current;
    let proximo = REINICIO;
    let id = 0;

    const agendar = () => {
      const agora = tRef.current;
      proximo = MARCOS.find((m) => m > agora) ?? REINICIO;
      id = window.setTimeout(() => {
        if (proximo >= REINICIO) {
          tRef.current = 0;
          inicio = performance.now();
          setEstado((e) => ({ t: 0, ciclo: e.ciclo + 1 }));
        } else {
          tRef.current = proximo;
          setEstado((e) => ({ ...e, t: proximo }));
        }
        agendar();
      }, proximo - agora);
    };
    agendar();

    return () => {
      window.clearTimeout(id);
      tRef.current = Math.min(performance.now() - inicio, proximo - 1);
    };
  }, [rodando]);

  // Com movimento reduzido: conversa inteira, estática.
  const tela = reduzir ? FIM : t;
  const visiveis = ROTEIRO.filter((p) => p.em <= tela);
  const digitando = ROTEIRO.some((p) => p.tipo === "isis" && p.digita <= tela && tela < p.em);
  const saindo = tela >= SAIDA;

  // Rola suavemente até a última mensagem.
  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({ top: lista.scrollHeight, behavior: reduzir ? "auto" : "smooth" });
  }, [visiveis.length, digitando, reduzir]);

  const entrada = reduzir ? false : { opacity: 0, y: 8 };

  return (
    <figure className="m-0">
      <div
        ref={painelRef}
        role="group"
        aria-label="Simulação ilustrativa de atendimento pelo WhatsApp"
        className="relative flex h-[460px] flex-col overflow-hidden rounded-painel border border-linha bg-white lg:h-[580px]"
      >
        {/* Borda pisca em âmbar uma vez no handoff */}
        <AnimatePresence>
          {visiveis.some((p) => p.tipo === "handoff") && !reduzir && !saindo && (
            <motion.span
              key={`borda-${ciclo}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-painel border-2 border-ambar"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.transicao, ease: EASE_ORBITA }}
            />
          )}
        </AnimatePresence>

        <header className="border-b border-linha px-5 pt-4 pb-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-small text-grafite-suave">Simulação de atendimento</p>
            {!reduzir && (
              <button
                type="button"
                onClick={() => setPausado((p) => !p)}
                aria-label={pausado ? "Reproduzir simulação" : "Pausar simulação"}
                title={pausado ? "Reproduzir simulação" : "Pausar simulação"}
                className="-mr-2 inline-flex size-9 items-center justify-center rounded-botao text-grafite-suave transition-colors duration-200 hover:text-grafite"
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="currentColor">
                  {pausado ? (
                    <path d="M4.5 2.8v10.4a.5.5 0 0 0 .77.42l8.1-5.2a.5.5 0 0 0 0-.84l-8.1-5.2a.5.5 0 0 0-.77.42Z" />
                  ) : (
                    <path d="M4 2.5h2.5v11H4zM9.5 2.5H12v11H9.5z" />
                  )}
                </svg>
              </button>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <p className="text-h3">
              <span className="sr-only">Horário: </span>23:47
            </p>
            <span className="rounded-pilula border border-linha px-2.5 py-0.5 text-small text-grafite-suave">
              Fora do horário
            </span>
          </div>
        </header>

        <motion.div
          ref={listaRef}
          role="log"
          aria-live="off"
          className="flex-1 space-y-3 overflow-y-auto px-5 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          animate={{ opacity: saindo ? 0 : 1 }}
          transition={ENTRADA}
        >
          {visiveis.map((p, i) => (
            <motion.div
              key={`${ciclo}-${i}`}
              initial={entrada}
              animate={{ opacity: 1, y: 0 }}
              transition={ENTRADA}
            >
              <Mensagem passo={p} reduzir={reduzir} />
            </motion.div>
          ))}
          <AnimatePresence>
            {digitando && (
              <motion.div
                key="digitando"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: DUR.feedback } }}
                transition={ENTRADA}
              >
                <Digitando pausado={!rodando} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <footer className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-linha px-5 py-3.5 text-small">
          <p className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-grafite-suave">Primeira resposta</span>
            <Nums className="font-semibold">{reduzir ? "00:04" : cronometro(tela)}</Nums>
          </p>
          <p className="whitespace-nowrap text-grafite-suave">Conversa ilustrativa</p>
        </footer>
      </div>

      <details className="sr-only mt-4 text-small focus-within:not-sr-only">
        <summary className="cursor-pointer text-grafite-suave">Ler a conversa completa</summary>
        <ol className="mt-3 space-y-2">
          {ROTEIRO.map((p, i) => (
            <li key={i}>
              {p.tipo === "lead" && <>Paciente: {p.texto}</>}
              {p.tipo === "isis" && <>ISIS: {p.texto}</>}
              {p.tipo === "handoff" && <>{p.texto}.</>}
            </li>
          ))}
        </ol>
      </details>
    </figure>
  );
}

function Mensagem({ passo, reduzir }: { passo: Passo; reduzir: boolean }) {
  if (passo.tipo === "lead") {
    return (
      <p className="ml-auto w-fit max-w-[85%] rounded-[14px] rounded-br-[4px] bg-nevoa px-3.5 py-2.5 text-[0.9375rem] leading-snug">
        {passo.texto}
      </p>
    );
  }

  if (passo.tipo === "handoff") {
    return (
      <div className="flex items-center gap-2.5 rounded-botao bg-ambar px-3.5 py-2.5 text-small font-semibold text-grafite">
        <motion.span
          aria-hidden="true"
          className="inline-flex shrink-0"
          initial={reduzir ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DUR.transicao, ease: EASE_ORBITA, delay: 0.15 }}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
            <circle cx="8" cy="5" r="3" />
            <path d="M2.5 14.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5z" />
          </svg>
        </motion.span>
        {passo.texto}
      </div>
    );
  }

  return (
    <div className="max-w-[85%]">
      <p className="mb-1 flex items-center gap-1.5 text-small font-semibold text-ultramar">
        <span aria-hidden="true" className="size-[5px] rounded-pilula bg-ultramar" />
        ISIS
      </p>
      <p className="w-fit rounded-[14px] rounded-tl-[4px] border border-ultramar px-3.5 py-2.5 text-[0.9375rem] leading-snug">
        {passo.texto}
      </p>
    </div>
  );
}

function Digitando({ pausado }: { pausado: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="flex w-fit items-center rounded-[14px] rounded-tl-[4px] border border-ultramar px-3.5 py-3.5 text-ultramar"
    >
      <Pontos pausado={pausado} />
    </div>
  );
}
