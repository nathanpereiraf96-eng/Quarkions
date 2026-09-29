import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_TAMANHO = { width: 1200, height: 630 };
export const OG_TIPO = "image/png";

const CAMARA = "#0D0F2E";
const CIANO = "#22C3D6";
const AMBAR = "#F2B233";
const ULTRAMAR = "#3B3BF5";

const fontes = Promise.all([
  readFile(join(process.cwd(), "assets/SchibstedGrotesk-700.ttf")),
  readFile(join(process.cwd(), "assets/SchibstedGrotesk-800.ttf")),
]);

// Trilha de câmara de nuvens: entra pela esquerda, curva e termina no ponto âmbar.
const TRILHA = "M-20 520C180 500 300 380 470 400S760 520 900 440 1040 300 1080 250";

/** Imagem Open Graph: fundo camara, trilha ciano terminando em âmbar, logo e título. */
export async function imagemOg(titulo: string) {
  const [bold, extra] = await fontes;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CAMARA,
          padding: "72px 80px",
          fontFamily: "Schibsted Grotesk",
          position: "relative",
        }}
      >
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path d={TRILHA} fill="none" stroke={CIANO} strokeWidth="2.5" strokeOpacity="0.7" />
          <circle cx="1080" cy="250" r="26" fill={AMBAR} fillOpacity="0.25" />
          <circle cx="1080" cy="250" r="11" fill={AMBAR} />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: ULTRAMAR }} />
          <div style={{ fontSize: 44, fontWeight: 800, color: "white", letterSpacing: "-0.04em" }}>
            quarkions
          </div>
        </div>

        <div
          style={{
            display: "flex",
            maxWidth: 900,
            fontSize: titulo.length > 60 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "white",
          }}
        >
          {titulo}
        </div>
      </div>
    ),
    {
      ...OG_TAMANHO,
      fonts: [
        { name: "Schibsted Grotesk", data: bold, weight: 700, style: "normal" },
        { name: "Schibsted Grotesk", data: extra, weight: 800, style: "normal" },
      ],
    },
  );
}
