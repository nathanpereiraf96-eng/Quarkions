"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EASE_ORBITA } from "@/lib/motion";
import { trackUmaVezNaSessao } from "@/lib/rastreamento";
import { ETAPAS, HEX } from "./etapas";
import { No } from "./No";

// Trilha de câmara de nuvens: curvatura que muda de raio (viewBox 700×800).
const D =
  "M60 92C150 48 262 58 350 118C430 172 528 176 602 246C672 312 640 404 548 430C452 458 338 418 250 452C150 490 88 560 112 640C134 712 238 742 346 716C446 692 540 700 640 762";

/** Posição de cada nó no path (fração do comprimento). */
const F = [0.04, 0.27, 0.5, 0.73, 0.96];

// Scroll → posição da partícula, com pausa em cada nó (o texto tem tempo de ser lido).
const PROGRESSO = [0, 0.06, 0.12, 0.26, 0.32, 0.46, 0.52, 0.66, 0.72, 0.86, 1];
const POSICAO = [0, F[0], F[0], F[1], F[1], F[2], F[2], F[3], F[3], F[4], F[4]];
/** Progresso de scroll no meio da pausa de cada etapa (destino dos botões). */
const PARADA = [0.09, 0.29, 0.49, 0.69, 0.93];

const EM_PATH = { offsetPath: `path("${D}")`, offsetRotate: "0deg", offsetAnchor: "0 0" } as const;

export function TrilhaSticky() {
  const alvo = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: alvo, offset: ["start start", "end end"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  const posicao = useTransform(suave, PROGRESSO, POSICAO);
  const distancia = useTransform(posicao, (f) => `${f * 100}%`);
  // Último trecho (etapa 4 → 5) passa de ciano a âmbar.
  // Traço manual (pathLength=1): começa no nó 4 e cresce até a partícula.
  const tracoFinal = useTransform(posicao, (f) => `${Math.max(0, f - F[3])} 2`);
  const opacidadeFinal = useTransform(posicao, [F[3], F[4]], [0, 1]);
  const corParticula = useTransform(posicao, [(F[3] + F[4]) / 2, F[4]], [HEX.ciano, HEX.ambar]);

  // Estado do React só muda quando a partícula cruza um nó.
  const [alcancado, setAlcancado] = useState(-1);
  const concluido = useRef(false);
  useMotionValueEvent(posicao, "change", (f) => {
    let k = -1;
    for (let i = 0; i < F.length; i++) if (f >= F[i] - 0.002) k = i;
    setAlcancado(k);
    if (k === F.length - 1 && !concluido.current) {
      concluido.current = true;
      trackUmaVezNaSessao("como_funciona_concluido");
    }
  });
  const ativa = Math.max(0, alcancado);

  const irPara = (i: number) => {
    const el = alvo.current;
    if (!el) return;
    const topo = el.getBoundingClientRect().top + window.scrollY;
    const percurso = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: topo + PARADA[i] * percurso, behavior: "smooth" });
  };

  return (
    <div ref={alvo} className="relative h-[500vh]">
      <div className="sticky top-0 flex h-dvh items-center pt-[72px]">
        <div className="container-site grid-site items-center">
          <div className="col-span-5">
            <ol className="grid">
              {ETAPAS.map((e, i) => {
                const estado = i === ativa ? "ativa" : i < ativa ? "antes" : "depois";
                return (
                  <motion.li
                    key={e.titulo}
                    className={`[grid-area:1/1] ${estado === "ativa" ? "" : "pointer-events-none"}`}
                    initial={false}
                    animate={estado}
                    variants={{
                      ativa: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.3, ease: EASE_ORBITA } },
                      antes: { opacity: 0, y: -12, transition: { duration: 0.3, ease: EASE_ORBITA } },
                      depois: { opacity: 0, y: 12, transition: { duration: 0.3, ease: EASE_ORBITA } },
                    }}
                  >
                    <p className="text-small text-white/70">
                      Etapa {i + 1} de {ETAPAS.length}
                    </p>
                    <h3 className="mt-4 text-h2">{e.titulo}</h3>
                    <p className="mt-5 max-w-[42ch] text-body text-white/80">{e.descricao}</p>
                    <p className="mt-6 text-small text-white/70">
                      O que é medido: <span className="text-white">{e.medido}</span>
                    </p>
                  </motion.li>
                );
              })}
            </ol>
            <p className="sr-only" aria-live="polite">
              {alcancado >= 0 ? `Etapa ${ativa + 1} de ${ETAPAS.length}: ${ETAPAS[ativa].titulo}` : ""}
            </p>

            <nav aria-label="Etapas" className="mt-12 flex gap-2">
              {ETAPAS.map((e, i) => {
                const cheia = i <= ativa;
                const cor = cheia ? (i === 4 ? "bg-ambar" : "bg-ciano") : "bg-camara-linha";
                return (
                  <button
                    key={e.titulo}
                    type="button"
                    onClick={() => irPara(i)}
                    aria-label={`Ir para a etapa ${i + 1}: ${e.titulo}`}
                    aria-current={i === ativa ? "step" : undefined}
                    className="group flex h-8 w-12 items-center"
                  >
                    <span className={`h-1 w-full rounded-pilula transition-colors duration-200 ${cor} group-hover:opacity-80`} />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="col-span-7 flex justify-end">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 700 800"
              className="h-[min(calc(100dvh-160px),720px)] w-auto max-w-full overflow-visible"
              fill="none"
            >
              {/* 1. Trilha-fantasma */}
              <path d={D} stroke={HEX.camaraLinha} strokeWidth={1} />
              {/* 2. Trilha percorrida */}
              <motion.path d={D} stroke={HEX.ciano} strokeWidth={1.5} strokeLinecap="round" style={{ pathLength: posicao }} />
              <motion.path
                d={D}
                pathLength={1}
                stroke={HEX.ambar}
                strokeWidth={1.5}
                strokeDashoffset={-F[3]}
                style={{ strokeDasharray: tracoFinal, opacity: opacidadeFinal }}
              />

              {/* 4. Nós (e 5. partículas secundárias, dentro de cada nó) */}
              {F.map((f, i) => (
                <g key={i} style={{ ...EM_PATH, offsetDistance: `${f * 100}%` }}>
                  <No alcancado={alcancado >= i} humano={i === 4} raio={6} />
                </g>
              ))}

              {/* Rótulo do nó 5 */}
              <g style={{ ...EM_PATH, offsetDistance: `${F[4] * 100}%` }}>
                <motion.g
                  initial={false}
                  animate={{ opacity: alcancado >= 4 ? 1 : 0, x: alcancado >= 4 ? 0 : -6 }}
                  transition={{ duration: 0.3, ease: EASE_ORBITA }}
                >
                  <rect x={-132} y={-44} width={104} height={30} rx={15} fill={HEX.ambar} />
                  <text x={-80} y={-24} textAnchor="middle" fontSize={15} fontWeight={600} fill="#1b2033">
                    Sua equipe
                  </text>
                </motion.g>
              </g>

              {/* 3. Partícula */}
              <motion.g style={{ ...EM_PATH, offsetDistance: distancia }}>
                <motion.circle r={11} style={{ fill: corParticula }} opacity={0.3} />
                <motion.circle r={4} style={{ fill: corParticula }} />
              </motion.g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
