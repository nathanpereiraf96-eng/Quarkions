import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/motion/Providers";
import { Rastreamento } from "@/components/Rastreamento";
import { SCRIPT_CONSENTIMENTO } from "@/lib/consentimento-script";
import { jsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Quarkions | Agentes de IA para atendimento de clínicas",
  description:
    "Responda leads em segundos, qualifique, agende e recupere pacientes com IA conectada ao WhatsApp, CRM e agenda. Implantação em até 10 dias úteis.",
  openGraph: { siteName: "Quarkions", locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image" },
};

const ORGANIZACAO = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quarkions",
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  ...(SITE.email ? { email: SITE.email } : {}),
  ...(SITE.razaoSocial ? { legalName: SITE.razaoSocial } : {}),
  ...(SITE.cnpj ? { taxID: SITE.cnpj } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: o script de consentimento marca o <html> antes da hidratação.
    <html lang="pt-BR" className={`${schibsted.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CONSENTIMENTO }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ORGANIZACAO) }} />
        <a
          href="#conteudo"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-botao bg-ultramar px-4 py-3 font-semibold text-white focus-visible:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <Providers>
          <Header />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <Rastreamento />
      </body>
    </html>
  );
}
