/** Três pontos do indicador "digitando" (hero e envio do formulário). */
export function Pontos({ pausado = false, className = "" }: { pausado?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-[digitando_1s_ease-in-out_infinite] rounded-pilula bg-current"
          style={{ animationDelay: `${i * 0.15}s`, animationPlayState: pausado ? "paused" : "running" }}
        />
      ))}
    </span>
  );
}
