import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CarregarPerto } from "./como-funciona/CarregarPerto";
import { EtapasEstaticas } from "./como-funciona/EtapasEstaticas";

/**
 * Seção-assinatura. O HTML do servidor traz as etapas estáticas; a trilha interativa
 * (`Interativo`) é carregada com dynamic() quando a seção se aproxima da tela.
 */
export function ComoFunciona() {
  return (
    <Section
      id="como-funciona"
      tema="escuro"
      aria-labelledby="como-funciona-titulo"
      className="border-t border-camara-linha"
    >
      <Container grid>
        <div className="col-span-12 lg:col-span-7">
          <h2 id="como-funciona-titulo" className="text-h2">
            Como a ISIS trabalha
          </h2>
          <p className="mt-6 max-w-texto text-lead text-white/75">
            Do primeiro contato até a sua equipe, cada lead segue uma trajetória definida — e
            medida.
          </p>
        </div>
      </Container>

      <div className="mt-16">
        <CarregarPerto>
          <EtapasEstaticas />
        </CarregarPerto>
      </div>
    </Section>
  );
}
