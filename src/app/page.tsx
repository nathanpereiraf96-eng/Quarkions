import type { Metadata } from "next";
import { ComoFunciona } from "@/components/home/ComoFunciona";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Implantacao } from "@/components/home/Implantacao";
import { Integracoes } from "@/components/home/Integracoes";
import { Medimos } from "@/components/home/Medimos";
import { ParaQuem } from "@/components/home/ParaQuem";
import { Problema } from "@/components/home/Problema";
import { Seguranca } from "@/components/home/Seguranca";
import { PERGUNTAS_FREQUENTES } from "@/lib/faq";
import { jsonLd, metadados } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Quarkions | Agentes de IA para atendimento de clínicas",
  descricao:
    "Responda leads em segundos, qualifique, agende e recupere pacientes com IA conectada ao WhatsApp, CRM e agenda. Implantação em até 10 dias úteis.",
  caminho: "/",
});

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PERGUNTAS_FREQUENTES.map(({ p, r }) => ({
    "@type": "Question",
    name: p,
    acceptedAnswer: { "@type": "Answer", text: r },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_JSON_LD) }} />
      <Hero />
      <Problema />
      <Integracoes />
      <ParaQuem />
      <ComoFunciona />
      <Implantacao />
      <Medimos />
      <Seguranca />
      <Faq />
      <CtaFinal />
    </>
  );
}
