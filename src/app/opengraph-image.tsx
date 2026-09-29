import { OG_TAMANHO, OG_TIPO, imagemOg } from "@/lib/og";

export const alt = "Quarkions: agentes de IA para atendimento de clínicas";
export const size = OG_TAMANHO;
export const contentType = OG_TIPO;

export default function Image() {
  return imagemOg("Todo lead respondido em segundos. Toda exceção com a pessoa certa.");
}
