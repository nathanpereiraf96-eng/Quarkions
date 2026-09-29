import type { Metadata } from "next";
import { metadados } from "@/lib/seo";
import Link from "next/link";
import { CtaFinal } from "@/components/home/CtaFinal";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadados({
  titulo: "Política de privacidade | Quarkions",
  descricao:
    "Como o site da Quarkions coleta, usa e protege os dados informados no pedido de diagnóstico.",
  caminho: "/privacidade",
});

const ATUALIZADA_EM = "29 de setembro de 2026";

/** Se algum dado institucional de SITE ficar vazio, a página mostra a lacuna em vez de omitir. */
const lacuna = (valor: string, rotulo: string) =>
  valor || <mark className="rounded-[4px] bg-linha px-1 text-grafite">[{rotulo} a preencher]</mark>;

const SECOES = [
  { id: "controlador", titulo: "Quem é o controlador" },
  { id: "dados", titulo: "Quais dados coletamos" },
  { id: "finalidade", titulo: "Para que usamos" },
  { id: "base-legal", titulo: "Base legal" },
  { id: "compartilhamento", titulo: "Com quem compartilhamos" },
  { id: "cookies", titulo: "Cookies e medição de audiência" },
  { id: "retencao", titulo: "Por quanto tempo guardamos" },
  { id: "direitos", titulo: "Seus direitos" },
  { id: "encarregado", titulo: "Contato do encarregado" },
  { id: "atualizacoes", titulo: "Atualizações desta política" },
];

export default function Privacidade() {
  const email = SITE.email;

  return (
    <>
      <PageHero
        titulo="Política de privacidade"
        lead="Como o site da Quarkions coleta, usa e protege os dados que você informa — em especial no pedido de diagnóstico."
      />

      <div className="bg-nevoa pb-[clamp(80px,10vw,140px)]">
        <Container grid className="gap-y-10">
          <nav
            aria-label="Índice da política"
            className="col-span-12 hidden lg:col-span-3 lg:block"
          >
            <ol className="sticky top-28 space-y-2 border-l border-linha pl-5 text-small">
              {SECOES.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-grafite-suave transition-colors duration-200 hover:text-grafite">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="col-span-12 max-w-texto space-y-12 lg:col-span-8 lg:col-start-5 [&_h2]:scroll-mt-28 [&_h2]:text-h3 [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
            <p className="!mt-0 text-small text-grafite-suave">Última atualização: {ATUALIZADA_EM}.</p>

            <section aria-labelledby="controlador">
              <h2 id="controlador">Quem é o controlador</h2>
              <p>
                O controlador dos dados coletados neste site é {lacuna(SITE.razaoSocial, "razão social")},
                inscrita no CNPJ {lacuna(SITE.cnpj, "CNPJ")}, que opera a marca Quarkions.
              </p>
            </section>

            <section aria-labelledby="dados">
              <h2 id="dados">Quais dados coletamos</h2>
              <p>No formulário de diagnóstico, coletamos o que você informa:</p>
              <ul>
                <li>nome, e-mail e número de WhatsApp;</li>
                <li>nome e cidade da clínica;</li>
                <li>
                  informações sobre o atendimento: tipo de clínica, volume aproximado de contatos,
                  canais usados, uso de CRM e, se você quiser, onde sente que perde pacientes.
                </li>
              </ul>
              <p>
                Registramos também de onde o pedido saiu: a página, o botão usado e os parâmetros
                de campanha do link de acesso (UTM), quando existirem. Por segurança, o endereço IP
                é usado temporariamente para limitar envios repetidos e não é gravado junto com o
                pedido. Se você aceitou os cookies, o IP e o navegador usados também seguem para a
                medição de anúncios descrita abaixo.
              </p>
              <p>
                Não pedimos dados de saúde de pacientes neste site. Por favor, não inclua esse tipo
                de informação no campo de texto livre.
              </p>
            </section>

            <section aria-labelledby="finalidade">
              <h2 id="finalidade">Para que usamos</h2>
              <ul>
                <li>entrar em contato para agendar e realizar o diagnóstico que você pediu;</li>
                <li>preparar a conversa com base no que você contou sobre o seu atendimento;</li>
                <li>enviar, se fizer sentido, uma proposta comercial;</li>
                <li>entender quais páginas e campanhas trazem pedidos, para melhorar o site;</li>
                <li>
                  se você aceitar os cookies, medir o resultado dos nossos anúncios no Google e na
                  Meta (Facebook e Instagram).
                </li>
              </ul>
              <p>Não vendemos seus dados e não os usamos para outras finalidades.</p>
            </section>

            <section aria-labelledby="base-legal">
              <h2 id="base-legal">Base legal</h2>
              <p>
                O tratamento se apoia no <strong>consentimento</strong> que você dá ao enviar o
                formulário (art. 7º, I, da LGPD) e no <strong>legítimo interesse</strong> em
                responder ao seu contato comercial e dar seguimento a ele (art. 7º, IX). A medição
                de audiência e de anúncios depende só do consentimento dado no aviso de cookies.
                Você pode retirar qualquer consentimento a qualquer momento, pelo contato indicado
                abaixo ou em “Preferências de cookies”, no rodapé.
              </p>
            </section>

            <section aria-labelledby="compartilhamento">
              <h2 id="compartilhamento">Com quem compartilhamos</h2>
              <p>Com fornecedores necessários para o site funcionar:</p>
              <ul>
                <li>o provedor de hospedagem do site;</li>
                <li>o provedor de banco de dados onde os pedidos ficam guardados;</li>
                <li>o serviço de e-mail usado para avisar nossa equipe sobre um novo pedido.</li>
              </ul>
              <p>E, só se você aceitar os cookies, com plataformas de medição e anúncios:</p>
              <ul>
                <li>
                  <strong>Google</strong> (Google Tag Manager e Google Analytics): páginas visitadas
                  e etapas do pedido de diagnóstico, sem nome, e-mail, telefone ou texto livre;
                </li>
                <li>
                  <strong>Meta</strong> (Facebook e Instagram): o aviso de que um pedido foi feito e,
                  pelo nosso servidor, seu e-mail, telefone, primeiro nome e cidade em formato
                  criptografado (hash) de mão única, junto com o endereço IP e o navegador — para
                  saber quais anúncios geraram pedidos.
                </li>
              </ul>
              <p>
                Esses fornecedores tratam os dados apenas conforme nossas instruções. Alguns deles
                podem armazenar dados fora do Brasil; nesses casos, adotamos as salvaguardas
                previstas na LGPD. Também podemos compartilhar dados quando exigido por lei ou
                ordem de autoridade.
              </p>
            </section>

            <section aria-labelledby="cookies">
              <h2 id="cookies">Cookies e medição de audiência</h2>
              <p>
                Usamos armazenamento local do navegador, essencial para o site funcionar — por
                exemplo, para lembrar os parâmetros de campanha durante a sua visita.
              </p>
              <p>
                As ferramentas de medição (Google Tag Manager, Google Analytics e Meta Pixel) só são
                carregadas se você aceitar no aviso de cookies. Elas gravam cookies como{" "}
                <code>_ga</code>, <code>_fbp</code> e <code>_fbc</code>. Sua escolha fica guardada por
                180 dias.
              </p>
              <p>
                Para mudar de ideia, use “Preferências de cookies”, no rodapé. Se você recusar
                depois de ter aceitado, apagamos esses cookies e as ferramentas deixam de ser
                carregadas.
              </p>
            </section>

            <section aria-labelledby="retencao">
              <h2 id="retencao">Por quanto tempo guardamos</h2>
              <p>
                Guardamos os dados do pedido de diagnóstico por até 24 meses após o último
                contato, ou pelo prazo necessário para cumprir obrigações legais. Se você se tornar
                cliente, os dados passam a seguir as regras do contrato. Depois disso, eles são
                excluídos ou anonimizados.
              </p>
            </section>

            <section aria-labelledby="direitos">
              <h2 id="direitos">Seus direitos</h2>
              <p>Pelo art. 18 da LGPD, você pode pedir, a qualquer momento:</p>
              <ul>
                <li>confirmação de que tratamos seus dados e acesso a eles;</li>
                <li>correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
                <li>portabilidade dos dados a outro fornecedor;</li>
                <li>eliminação dos dados tratados com base no seu consentimento;</li>
                <li>informação sobre com quem compartilhamos seus dados;</li>
                <li>informação sobre a possibilidade de não consentir e suas consequências;</li>
                <li>revogação do consentimento.</li>
              </ul>
              <p>
                Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados
                (ANPD).
              </p>
            </section>

            <section aria-labelledby="encarregado">
              <h2 id="encarregado">Contato do encarregado</h2>
              <p>
                Para exercer seus direitos ou tirar dúvidas sobre esta política, escreva para{" "}
                {email ? (
                  <a href={`mailto:${email}`} className="font-semibold text-ultramar underline underline-offset-2">
                    {email}
                  </a>
                ) : (
                  lacuna("", "e-mail do encarregado")
                )}
                . Respondemos em até 15 dias.
              </p>
            </section>

            <section aria-labelledby="atualizacoes">
              <h2 id="atualizacoes">Atualizações desta política</h2>
              <p>
                Podemos atualizar esta política quando o site mudar. A data no topo indica a versão
                em vigor. Mudanças relevantes serão destacadas nesta página.
              </p>
              <p>
                <Link href="/" className="font-semibold text-ultramar underline underline-offset-2">
                  Voltar para a página inicial
                </Link>
              </p>
            </section>
          </article>
        </Container>
      </div>

      <CtaFinal />
    </>
  );
}
