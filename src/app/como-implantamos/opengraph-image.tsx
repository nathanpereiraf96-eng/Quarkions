import { OG_TAMANHO, OG_TIPO, imagemOg } from "@/lib/og";

export const alt = "Como a Quarkions implanta a ISIS em até 10 dias úteis";
export const size = OG_TAMANHO;
export const contentType = OG_TIPO;

export default function Image() {
  return imagemOg("Como implantamos a ISIS na sua clínica");
}
