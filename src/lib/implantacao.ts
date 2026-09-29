/** As 6 etapas da implantação. Usadas na home (régua) e em /como-implantamos (lista completa). */
export const ETAPAS_IMPLANTACAO = [
  {
    dias: "Dias 0–1",
    marca: 0,
    titulo: "Kickoff",
    texto:
      "Mapeamos o fluxo, definimos o indicador de sucesso e registramos como ele está hoje. Acessos e responsáveis documentados.",
    quem: "Ambos",
    pronto: "fluxo, indicador, responsável e acessos estão documentados.",
  },
  {
    dias: "Dias 2–3",
    marca: 2,
    titulo: "Integrações",
    texto: "Conectamos os canais, o CRM e a agenda combinados. Os dados começam a entrar.",
    quem: "Quarkions",
    pronto: "os dados estão entrando corretamente e os erros aparecem.",
  },
  {
    dias: "Dias 3–5",
    marca: 3,
    titulo: "Roteiro e regras",
    texto:
      "Montamos com sua equipe as perguntas, as respostas, as regras de follow-up e os momentos de passar para uma pessoa.",
    quem: "Ambos",
    pronto: "existe uma versão testável, com cada regra registrada.",
  },
  {
    dias: "Dia 6",
    marca: 6,
    titulo: "Testes",
    texto: "Testamos situações normais, exceções e falhas. Sua equipe aprova o checklist.",
    quem: "Ambos",
    pronto: "o checklist de situações normais, exceções e falhas foi aprovado pela sua equipe.",
  },
  {
    dias: "Dia 7",
    marca: 7,
    titulo: "Início controlado",
    texto: "Primeiros atendimentos reais com volume limitado e acompanhamento de perto.",
    quem: "Ambos",
    pronto: "os primeiros atendimentos reais aconteceram com volume limitado.",
  },
  {
    dias: "Dias 8–10",
    marca: 10,
    titulo: "No ar",
    texto:
      "Ajustes finais, relatório semanal ativo e plano para desligar tudo rapidamente se algo sair do esperado.",
    quem: "Quarkions",
    pronto:
      "o atendimento está estável, o relatório semanal está ativo e o plano de desligamento foi testado.",
  },
] as const;
