import { OG_TAMANHO, OG_TIPO, imagemOg } from "@/lib/og";

export const alt = "Segurança e LGPD na Quarkions";
export const size = OG_TAMANHO;
export const contentType = OG_TIPO;

export default function Image() {
  return imagemOg("Segurança, privacidade e supervisão humana");
}
