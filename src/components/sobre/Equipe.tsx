/**
 * Seção "Equipe" da página /sobre — DESATIVADA.
 *
 * Só publicar com fotos reais da equipe, nomes e cargos autorizados por cada pessoa.
 * Nada de banco de imagens. Para ativar: preencher PESSOAS e descomentar <Equipe />
 * em src/app/sobre/page.tsx.
 */

type Pessoa = { nome: string; cargo: string; foto: string };

const PESSOAS: Pessoa[] = [];

export function Equipe() {
  if (PESSOAS.length === 0) return null;
  return (
    <section aria-labelledby="equipe-titulo" className="border-t border-linha py-12 md:py-16">
      <h2 id="equipe-titulo" className="text-h3">
        Quem faz a Quarkions
      </h2>
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PESSOAS.map((p) => (
          <li key={p.nome}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.foto} alt="" className="aspect-[4/5] w-full rounded-painel object-cover" />
            <p className="mt-4 font-semibold">{p.nome}</p>
            <p className="text-small text-grafite-suave">{p.cargo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
