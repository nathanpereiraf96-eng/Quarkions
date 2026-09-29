import { ETAPAS } from "./etapas";

/** As 5 etapas em HTML puro: vão no HTML do servidor e ficam até a versão interativa carregar. */
export function EtapasEstaticas() {
  return (
    <div className="container-site">
      <ol className="max-w-texto space-y-12 border-l border-camara-linha pl-8">
        {ETAPAS.map((e, i) => (
          <li key={e.titulo}>
            <p className="text-small text-white/70">
              Etapa {i + 1} de {ETAPAS.length}
            </p>
            <h3 className="mt-2 text-h3">{e.titulo}</h3>
            <p className="mt-3 text-body text-white/85">{e.descricao}</p>
            <p className="mt-3 text-small text-white/70">
              O que é medido: <span className="text-white">{e.medido}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
