import { OG_TAMANHO, OG_TIPO, imagemOg } from "@/lib/og";

export const alt = "Agendar diagnóstico com a Quarkions";
export const size = OG_TAMANHO;
export const contentType = OG_TIPO;

export default function Image() {
  return imagemOg("Vamos ver onde sua clínica está perdendo pacientes?");
}
