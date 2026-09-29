import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROTAS = ["/", "/como-implantamos", "/seguranca", "/sobre", "/diagnostico", "/privacidade"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROTAS.map((rota) => ({
    url: `${SITE.url}${rota === "/" ? "" : rota}`,
    changeFrequency: "monthly",
    priority: rota === "/" ? 1 : 0.7,
  }));
}
