/**
 * Algarismos tabulares sem alargar a pontuação: na Schibsted Grotesk o `tnum`
 * também dá largura de algarismo a ":" e ",", o que afasta "22 : 14".
 */
export function Nums({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`nums ${className}`}>
      {children.split(/(\d+)/).map((parte, i) =>
        /^\d+$/.test(parte) ? (
          parte
        ) : (
          <span key={i} className="[font-variant-numeric:normal]">
            {parte}
          </span>
        ),
      )}
    </span>
  );
}
