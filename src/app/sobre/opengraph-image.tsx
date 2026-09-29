import { OG_TAMANHO, OG_TIPO, imagemOg } from "@/lib/og";

export const alt = "Sobre a Quarkions";
export const size = OG_TAMANHO;
export const contentType = OG_TIPO;

export default function Image() {
  return imagemOg("Implantar bem é o que fazemos.");
}
