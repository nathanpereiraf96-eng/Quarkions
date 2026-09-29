export type Etapa = { titulo: string; descricao: string; medido: string };

export const ETAPAS: Etapa[] = [
  {
    titulo: "Recebe",
    descricao:
      "Leads do WhatsApp, do site e dos anúncios entram num só fluxo, sem planilha e sem cópia manual.",
    medido: "% de leads recebidos",
  },
  {
    titulo: "Responde",
    descricao:
      "O primeiro contato acontece em segundos, a qualquer hora, com contexto: a mensagem responde ao que a pessoa perguntou.",
    medido: "tempo até a primeira resposta",
  },
  {
    titulo: "Qualifica",
    descricao:
      "Perguntas definidas com a sua clínica separam quem está pronto para agendar de quem precisa de mais informação.",
    medido: "% de leads qualificados",
  },
  {
    titulo: "Agenda",
    descricao:
      "A ISIS oferece horários reais da agenda e registra tudo no CRM. Quem não responde recebe follow-up com regras de parada.",
    medido: "taxa de agendamento",
  },
  {
    titulo: "Transfere",
    descricao:
      "Dúvidas sobre convênio, reclamações, casos sensíveis e qualquer pergunta clínica vão para uma pessoa da sua equipe, com o histórico da conversa. A ISIS não faz diagnóstico.",
    medido: "tempo até o atendimento humano",
  },
];

// MotionValues interpolam cor a partir de valores literais (não leem CSS vars).
export const HEX = { ciano: "#22c3d6", ambar: "#f2b233", camara: "#0d0f2e", camaraLinha: "#2a2d5c" };

/** Partículas secundárias ao redor de um nó (coordenadas relativas ao nó). */
export const SECUNDARIAS = [
  "M4 -3C12 -10 18 -22 30 -26",
  "M5 2C16 4 26 12 34 22",
  "M-4 4C-10 12 -12 22 -22 30",
  "M-5 -1C-14 -4 -22 -12 -24 -24",
  "M1 -5C0 -14 6 -24 4 -36",
];
