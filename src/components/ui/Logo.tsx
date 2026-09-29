/** Logo tipográfico provisório: a "partícula" + quarkions. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[1.375rem] leading-none font-[750] tracking-[-0.04em] ${className}`}
    >
      <span aria-hidden="true" className="size-[7px] rounded-pilula bg-ultramar" />
      quarkions
    </span>
  );
}
