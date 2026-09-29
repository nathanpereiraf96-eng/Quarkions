type ContainerProps = {
  /** Aplica o grid de 12 colunas (gutter 24px). */
  grid?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Container({ grid = false, className = "", children }: ContainerProps) {
  return (
    <div className={`container-site ${grid ? "grid-site" : ""} ${className}`}>
      {children}
    </div>
  );
}
