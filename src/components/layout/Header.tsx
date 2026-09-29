"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { BotaoDiagnostico } from "@/components/diagnostico/BotaoDiagnostico";
import { Logo } from "@/components/ui/Logo";
import { DUR, EASE_ORBITA, useReducedMotionSafe } from "@/lib/motion";
import { NAVEGACAO } from "@/lib/site";
import { useFocoPreso } from "@/lib/useFocoPreso";

const LIMIAR_ROLAGEM = 24;

function inscreverRolagem(aviso: () => void) {
  window.addEventListener("scroll", aviso, { passive: true });
  return () => window.removeEventListener("scroll", aviso);
}

/** true quando a página rolou mais que o limiar. */
function useRolado() {
  return useSyncExternalStore(
    inscreverRolagem,
    () => window.scrollY > LIMIAR_ROLAGEM,
    () => false,
  );
}

/** true quando uma seção `data-tema="escuro"` está sob o header. */
function useSobreEscuro(header: React.RefObject<HTMLElement | null>) {
  const pathname = usePathname();
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    let observador: IntersectionObserver | undefined;
    const sob = new Set<Element>();

    const montar = () => {
      observador?.disconnect();
      sob.clear();
      const altura = header.current?.offsetHeight ?? 72;
      // Faixa observada: só a área ocupada pelo header no topo da viewport.
      observador = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            if (e.isIntersecting) sob.add(e.target);
            else sob.delete(e.target);
          }
          setEscuro(sob.size > 0);
        },
        { rootMargin: `0px 0px -${Math.max(window.innerHeight - altura, 0)}px 0px` },
      );
      document
        .querySelectorAll('[data-tema="escuro"]')
        .forEach((el) => observador?.observe(el));
    };

    montar();
    window.addEventListener("resize", montar);
    return () => {
      window.removeEventListener("resize", montar);
      observador?.disconnect();
    };
  }, [pathname, header]);

  return escuro;
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const idPainel = useId();

  const rolado = useRolado();
  const escuro = useSobreEscuro(headerRef);
  const reduzir = useReducedMotionSafe();

  const [aberto, setAberto] = useState(false);
  const [origem, setOrigem] = useState("calc(100% - 42px) 32px");

  const abrir = () => {
    const r = botaoMenuRef.current?.getBoundingClientRect();
    if (r) setOrigem(`${r.left + r.width / 2}px ${r.top + r.height / 2}px`);
    setAberto(true);
  };

  const fechar = useCallback(() => setAberto(false), []);

  // Menu aberto: foco preso no painel, Esc fecha, rolagem travada; ao fechar, o foco volta ao botão.
  useFocoPreso(painelRef, aberto, fechar);

  // Ao passar para o layout desktop, o menu deixa de existir.
  useEffect(() => {
    if (!aberto) return;
    const desktop = window.matchMedia("(min-width: 900px)");
    const aoMudarLargura = () => desktop.matches && setAberto(false);
    desktop.addEventListener("change", aoMudarLargura);
    return () => desktop.removeEventListener("change", aoMudarLargura);
  }, [aberto]);

  const fundo = rolado
    ? escuro
      ? "bg-camara/88 border-camara-linha backdrop-blur-[12px]"
      : "bg-nevoa/88 border-linha backdrop-blur-[12px]"
    : "bg-transparent border-transparent";
  const texto = escuro ? "foco-claro text-white" : "text-grafite";
  const linkSuave = escuro ? "text-white/75 hover:text-white" : "text-grafite-suave hover:text-grafite";

  const transicaoPainel = { duration: reduzir ? 0 : DUR.transicao, ease: EASE_ORBITA };
  const lista: Variants = {
    aberto: { transition: { staggerChildren: reduzir ? 0 : 0.04, delayChildren: reduzir ? 0 : 0.12 } },
    fechado: {},
  };
  const item: Variants = {
    fechado: { opacity: 0, y: reduzir ? 0 : 12 },
    aberto: { opacity: 1, y: 0, transition: { duration: reduzir ? 0 : DUR.transicao, ease: EASE_ORBITA } },
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 border-b transition-colors duration-200 ease-orbita ${fundo} ${texto}`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <Link href="/" aria-label="Quarkions, página inicial" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden nav:block">
            <ul className="flex items-center gap-8">
              {NAVEGACAO.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={`font-medium transition-colors duration-200 aria-[current=page]:text-current ${linkSuave}`}
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <BotaoDiagnostico origem="header" />
            </div>
            <button
              ref={botaoMenuRef}
              type="button"
              onClick={abrir}
              aria-expanded={aberto}
              aria-controls={idPainel}
              aria-label="Abrir menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-botao nav:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            ref={painelRef}
            id={idPainel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="foco-claro fixed inset-0 z-50 flex flex-col overflow-y-auto bg-camara text-white nav:hidden"
            initial={{ clipPath: `circle(0% at ${origem})` }}
            animate={{ clipPath: `circle(150% at ${origem})` }}
            exit={{ clipPath: `circle(0% at ${origem})` }}
            transition={transicaoPainel}
          >
            <div className="container-site flex h-16 shrink-0 items-center justify-between md:h-[72px]">
              <Link href="/" onClick={fechar} aria-label="Quarkions, página inicial">
                <Logo />
              </Link>
              <button
                type="button"
                onClick={fechar}
                aria-label="Fechar menu"
                className="-mr-2 inline-flex size-11 items-center justify-center rounded-botao"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav aria-label="Principal" className="container-site flex flex-1 flex-col pt-10 pb-12">
              <motion.ul variants={lista} initial="fechado" animate="aberto" className="space-y-2">
                {NAVEGACAO.map((l) => (
                  <motion.li key={l.href} variants={item}>
                    <Link
                      href={l.href}
                      onClick={fechar}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="block py-2 text-h2"
                    >
                      {l.rotulo}
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={item} className="pt-8">
                  <BotaoDiagnostico origem="menu" variante="sobre-escuro" onClick={fechar} />
                </motion.li>
              </motion.ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
