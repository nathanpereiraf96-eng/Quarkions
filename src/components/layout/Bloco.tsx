type BlocoProps = {
  id: string;
  titulo: string;
  /** Ponto antes do título: `ambar` só quando o assunto é pessoa/limite da IA. */
  marcador?: "ambar";
  children: React.ReactNode;
};

/** Bloco editorial das páginas de apoio: título à esquerda, texto à direita, separados por borda. */
export function Bloco({ id, titulo, marcador, children }: BlocoProps) {
  const idTitulo = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={idTitulo} className="grid-site gap-y-4 border-t border-linha py-12 md:py-16">
      <h2 id={idTitulo} className="col-span-12 text-h3 md:col-span-4">
        {marcador && (
          <span aria-hidden="true" className="mr-3 inline-block size-2 -translate-y-1 rounded-pilula bg-ambar" />
        )}
        {titulo}
      </h2>
      <div className="col-span-12 max-w-texto space-y-4 text-lead text-grafite md:col-span-8">{children}</div>
    </section>
  );
}
