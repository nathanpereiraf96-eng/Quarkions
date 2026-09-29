type SectionProps = {
  /** `branco`: seção clara com fundo branco, para contraste com as de névoa. */
  tema?: "claro" | "branco" | "escuro";
  id?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"section">, "id" | "className" | "children">;

const TEMAS = {
  claro: "bg-nevoa text-grafite",
  branco: "bg-white text-grafite",
  escuro: "bg-camara text-white",
} as const;

export function Section({
  tema = "claro",
  id,
  className = "",
  children,
  ...resto
}: SectionProps) {
  return (
    <section
      id={id}
      data-tema={tema}
      className={`py-[clamp(80px,12vw,160px)] ${TEMAS[tema]} ${className}`}
      {...resto}
    >
      {children}
    </section>
  );
}
