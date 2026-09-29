"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  transform,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/motion";
import { trackUmaVezNaSessao } from "@/lib/rastreamento";
import { ETAPAS, HEX } from "./etapas";
import { No } from "./No";

const LARGURA = 64;
const PASSO = 4;

/** Eixo da trilha: ondulação com dois períodos, para o raio da curva variar. */
const xDe = (y: number) => 32 + 13 * Math.sin(y / 74) + 5 * Math.sin(y / 23 + 1);

function caminho(de: number, ate: number) {
  const pontos: string[] = [];
  for (let y = de; y < ate; y += PASSO) pontos.push(`${xDe(y).toFixed(1)} ${y.toFixed(1)}`);
  pontos.push(`${xDe(ate).toFixed(1)} ${ate.toFixed(1)}`);
  return `M${pontos.join("L")}`;
}

type Medidas = { altura: number; ys: number[] };

/** Versão empilhada: mobile e movimento reduzido. */
export function TrilhaLista() {
  const reduzir = useReducedMotionSafe();
  const idClip = useId();
  const listaRef = useRef<HTMLOListElement>(null);
  const [medidas, setMedidas] = useState<Medidas | null>(null);
  const medidasRef = useRef<Medidas | null>(null);

  // Posição de cada nó = altura do título de cada etapa.
  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const obs = new ResizeObserver(() => {
      const itens = Array.from(lista.children) as HTMLElement[];
      const m = { altura: lista.offsetHeight, ys: itens.map((li) => li.offsetTop + 16) };
      // Oculta (display: none) na versão sticky: nada a medir.
      const valida = m.altura > 0 && m.ys[4] > m.ys[3];
      medidasRef.current = valida ? m : null;
      setMedidas(valida ? m : null);
    });
    obs.observe(lista);
    return () => obs.disconnect();
  }, []);

  // A partícula acompanha a linha de 60% da tela.
  const { scrollYProgress } = useScroll({ target: listaRef, offset: ["start 60%", "end 60%"] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });
  const y = useTransform(suave, (p) => {
    const m = medidasRef.current;
    if (!m) return 0;
    return Math.min(Math.max(p * m.altura, m.ys[0]), m.ys[m.ys.length - 1]);
  });
  const x = useTransform(y, xDe);
  const escala = useTransform(y, (v) => {
    const m = medidasRef.current;
    return m && m.altura > 0 ? v / m.altura : 0;
  });
  const cor = useTransform(y, (v) => {
    const m = medidasRef.current;
    if (!m) return HEX.ciano;
    return transform(v, [(m.ys[3] + m.ys[4]) / 2, m.ys[4]], [HEX.ciano, HEX.ambar]);
  });
  const opacidadeFinal = useTransform(y, (v) => {
    const m = medidasRef.current;
    if (!m) return 0;
    return Math.min(Math.max((v - m.ys[3]) / (m.ys[4] - m.ys[3]), 0), 1);
  });

  const [ativa, setAtiva] = useState(0);
  const concluido = useRef(false);
  useMotionValueEvent(y, "change", (v) => {
    const m = medidasRef.current;
    if (!m) return;
    let k = 0;
    m.ys.forEach((yk, i) => {
      if (v >= yk - 4) k = i;
    });
    setAtiva(k);
    if (k === m.ys.length - 1 && !concluido.current && !reduzir) {
      concluido.current = true;
      trackUmaVezNaSessao("como_funciona_concluido");
    }
  });

  const alcancado = (i: number) => reduzir || i <= ativa;

  return (
    <div className="relative">
      {medidas && (
        <svg
          aria-hidden="true"
          focusable="false"
          width={LARGURA}
          height={medidas.altura}
          viewBox={`0 0 ${LARGURA} ${medidas.altura}`}
          className="absolute top-0 left-0 overflow-visible"
          fill="none"
        >
          <defs>
            <clipPath id={idClip}>
              <motion.rect
                x={-20}
                y={0}
                width={LARGURA + 40}
                height={medidas.altura}
                style={{ scaleY: reduzir ? 1 : escala, transformBox: "fill-box", transformOrigin: "top" }}
              />
            </clipPath>
          </defs>

          <path d={caminho(medidas.ys[0], medidas.ys[4])} stroke={HEX.camaraLinha} strokeWidth={1} />
          <g clipPath={`url(#${idClip})`}>
            <path d={caminho(medidas.ys[0], medidas.ys[4])} stroke={HEX.ciano} strokeWidth={1.5} />
            {!reduzir && (
              <motion.path
                d={caminho(medidas.ys[3], medidas.ys[4])}
                stroke={HEX.ambar}
                strokeWidth={1.5}
                style={{ opacity: opacidadeFinal }}
              />
            )}
          </g>

          {medidas.ys.map((yk, i) => (
            <g key={i} transform={`translate(${xDe(yk)} ${yk})`}>
              <No alcancado={alcancado(i)} humano={i === 4} estatico={reduzir} />
            </g>
          ))}

          {!reduzir && (
            <motion.g style={{ x, y }}>
              <motion.circle r={9} style={{ fill: cor }} opacity={0.3} />
              <motion.circle r={3.5} style={{ fill: cor }} />
            </motion.g>
          )}
        </svg>
      )}

      <ol ref={listaRef} className="space-y-14 pl-20">
        {ETAPAS.map((e, i) => (
          <li
            key={e.titulo}
            className={`transition-opacity duration-500 ease-orbita ${
              reduzir || i === ativa ? "opacity-100" : "opacity-60"
            }`}
          >
            <p className="text-small text-white/70">
              Etapa {i + 1} de {ETAPAS.length}
            </p>
            <h3 className="mt-2 flex flex-wrap items-center gap-3 text-h3">
              {e.titulo}
              {i === 4 && (
                <span className="rounded-pilula bg-ambar px-3 py-0.5 text-small font-semibold text-grafite">
                  Sua equipe
                </span>
              )}
            </h3>
            <p className="mt-3 max-w-texto text-body text-white/85">{e.descricao}</p>
            <p className="mt-3 text-small text-white/70">
              O que é medido: <span className="text-white">{e.medido}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
