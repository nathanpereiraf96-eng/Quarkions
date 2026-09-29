import { Trilha } from "@/components/motion/Trilha";

type PageHeroProps = {
  titulo: string;
  lead: React.ReactNode;
  children?: React.ReactNode;
};

/** Topo das páginas de apoio: h1, lead e uma trilha estática em `linha` no canto direito. */
export function PageHero({ titulo, lead, children }: PageHeroProps) {
  return (
    <section
      data-tema="claro"
      className="relative overflow-hidden bg-nevoa pt-[clamp(48px,8vw,112px)] pb-[clamp(56px,8vw,112px)]"
    >
      <Trilha
        viewBox="0 0 640 360"
        d="M40 -10C120 120 300 190 460 170s180 40 200 90"
        cor="linha"
        className="pointer-events-none absolute top-0 right-0 h-[260px] w-[min(640px,90%)] sm:h-[360px]"
      />
      <Trilha
        viewBox="0 0 640 360"
        d="M300 -10C330 80 420 150 660 150"
        cor="linha"
        className="pointer-events-none absolute top-0 right-0 h-[260px] w-[min(640px,90%)] opacity-70 sm:h-[360px]"
      />

      <div className="container-site relative grid-site">
        <div className="col-span-12 lg:col-span-9">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] font-[720] tracking-[-0.03em]">
            {titulo}
          </h1>
          <p className="mt-6 max-w-texto text-lead text-grafite-suave">{lead}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
