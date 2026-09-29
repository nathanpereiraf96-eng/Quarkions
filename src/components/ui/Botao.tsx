"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";
import { DUR, EASE_ORBITA } from "@/lib/motion";

const MotionLink = motion.create(Link);

const VARIANTES = {
  primario:
    "bg-ultramar text-white hover:bg-[color-mix(in_oklab,var(--ultramar),black_16%)]",
  secundario:
    "border-[1.5px] border-grafite text-grafite hover:bg-grafite hover:text-nevoa",
  "sobre-escuro": "bg-white text-camara hover:bg-linha",
} as const;

type Variante = keyof typeof VARIANTES;

type Base = {
  variante?: Variante;
  className?: string;
  children: React.ReactNode;
};

type ComoLink = Base & { href: string } & Omit<
    React.ComponentProps<typeof MotionLink>,
    keyof Base | "href"
  >;
type ComoBotao = Base & { href?: undefined } & Omit<
    HTMLMotionProps<"button">,
    keyof Base
  >;

const TOQUE = { scale: 0.97 };
const TRANSICAO = { duration: DUR.feedback, ease: EASE_ORBITA };

export function Botao(props: ComoLink | ComoBotao) {
  const { variante = "primario", className = "", children } = props;
  const classes = [
    "inline-flex h-11 items-center justify-center rounded-botao px-[22px] font-semibold whitespace-nowrap",
    "transition-colors duration-200 ease-orbita md:h-12",
    VARIANTES[variante],
    className,
  ].join(" ");

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variante: _v, className: _c, children: _ch, ...resto } = props;
    return (
      <MotionLink {...resto} className={classes} whileTap={TOQUE} transition={TRANSICAO}>
        {children}
      </MotionLink>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variante: _v, className: _c, children: _ch, href: _h, ...resto } = props;
  return (
    <motion.button
      type="button"
      {...resto}
      className={classes}
      whileTap={TOQUE}
      transition={TRANSICAO}
    >
      {children}
    </motion.button>
  );
}
