import Link from "next/link";
import { PreferenciasCookies } from "@/components/consentimento/BannerCookies";
import { Trilha } from "@/components/motion/Trilha";
import { Logo } from "@/components/ui/Logo";
import { NAVEGACAO, SITE } from "@/lib/site";

const LINKS = [...NAVEGACAO, { rotulo: "Política de privacidade", href: "/privacidade" }];

export function Footer() {
  const ano = new Date().getFullYear();
  const legal = [
    `© ${ano} Quarkions`,
    SITE.razaoSocial,
    SITE.cnpj && `CNPJ ${SITE.cnpj}`,
  ].filter(Boolean);

  return (
    <footer data-tema="escuro" className="relative overflow-hidden bg-camara text-white/70">
      <Trilha
        viewBox="0 0 1440 120"
        preserveAspectRatio="xMidYMid slice"
        d="M-20 96C220 92 420 40 640 44s380 58 560 34 220-50 260-58"
        className="pointer-events-none absolute inset-x-0 top-0 h-[120px] w-full opacity-35"
      />

      <div className="container-site relative grid-site gap-y-12 pt-28 pb-12">
        <div className="col-span-12 md:col-span-5">
          <Link href="/" className="inline-block text-white" aria-label="Quarkions, página inicial">
            <Logo />
          </Link>
          <p className="mt-5 max-w-[34ch]">
            Agentes de IA implantados na operação da sua clínica, com supervisão humana.
          </p>
        </div>

        <nav aria-label="Rodapé" className="col-span-12 sm:col-span-6 md:col-span-4">
          <ul className="space-y-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors duration-200 hover:text-white">
                  {l.rotulo}
                </Link>
              </li>
            ))}
            <li>
              <PreferenciasCookies />
            </li>
          </ul>
        </nav>

        <div className="col-span-12 space-y-3 sm:col-span-6 md:col-span-3">
          {SITE.email && (
            <p>
              <a
                href={`mailto:${SITE.email}`}
                className="transition-colors duration-200 hover:text-white"
              >
                {SITE.email}
              </a>
            </p>
          )}
        </div>

        <p className="col-span-12 border-t border-camara-linha pt-6 text-small">
          {legal.join(" · ")}
        </p>
      </div>
    </footer>
  );
}
