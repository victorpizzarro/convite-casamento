/* ==========================================================
   CONFIGURAÇÃO DO CONVITE  —  edite só este arquivo
   ========================================================== */
window.CONVITE = {
  noivo: "Fernando",
  noiva: "Sthefany",

  // Data e hora da cerimônia (fuso de Brasília). Formato: AAAA-MM-DDTHH:MM:SS-03:00
  // Horário ainda não definido: a contagem vai até 00h do dia. Quando definir, troque
  // 00:00:00 pelo horário (ex.: 17:00:00) e ponha mostrarHorario: true.
  data: "2027-01-09T00:00:00-03:00",
  mostrarHorario: false,
  duracaoHoras: 5, // usado no "Adicionar à agenda" (só com mostrarHorario: true)

  frase:
    "Com alegria no coração e a bênção de Deus, convidamos você para testemunhar o nosso amém.",
  versiculo: "“Acima de tudo, revistam-se do amor, que é o vínculo da perfeição.”",
  versiculoRef: "Colossenses 3:14",

  // Local ainda não definido. Quando confirmar, preencha os campos abaixo
  // (mapsUrl/wazeUrl vazios = os botões de mapa ficam escondidos).
  local: {
    nome: "Local a confirmar",
    endereco: "",
    observacao: "Assim que o local for definido, ele aparecerá aqui.",
    mapsUrl: "",
    wazeUrl: "",
  },

  presentes: {
    texto:
      "Sua presença é o nosso maior presente. Se quiser nos presentear, ficaremos muito felizes com uma contribuição para o nosso novo lar.",
    pixChave: "21990362487", // valor copiado pelo botão "Copiar" (vazio = mostra "em breve")
    pixExibir: "(21) 99036-2487", // como aparece na tela
    pixNome: "Fernando e Sthefany",
    listaUrl: "", // opcional: link de uma lista de presentes (deixe "" para esconder)
  },

  informacoes: [
    { titulo: "Traje", texto: "Esporte fino. Pedimos que evitem branco, off-white e verde-oliva." },
    { titulo: "Crianças", texto: "Serão muito bem-vindas! Indique na confirmação." },
  ],

  // WhatsApp dos noivos (com DDI+DDD, só números) — aparece como "falar com os noivos"
  whatsapp: "5521990362487",

  // Prazo para confirmar (texto livre; deixe "" para esconder)
  prazoConfirmacao: "",

  /* ---------- Fotos do casal (abertura em slides) ----------
     Coloque as imagens em assets/fotos/ e liste aqui. Vazio = pula direto para o convite. */
  fotos: [
    // "assets/fotos/01.jpg",
    // "assets/fotos/02.jpg",
    // "assets/fotos/03.jpg",
  ],
  segundosPorFoto: 3.2,

  // Música de fundo (opcional). Ex.: "assets/musica.mp3". Vazio = sem música.
  musica: "",

  /* ---------- Planilha (Google Apps Script) ----------
     Cole aqui a URL do "app da web" depois de publicar o Code.gs (veja o README).
     Enquanto estiver vazio, o site roda em MODO DEMONSTRAÇÃO (salva só no seu navegador). */
  apiUrl: "https://script.google.com/macros/s/AKfycbzK79-WSxNbaUo_Cx9TNi0_yZlm7DBsuPhZaTvXh8PpcmaVf8_O4E5LvKide1XapQAekw/exec",

  // Permitir confirmar sem link personalizado (sem ?c=...)?
  permitirSemCodigo: true,
  maxPessoasSemCodigo: 6,

  // Convidados de exemplo para o modo demonstração. Teste com  index.html?c=silva
  demoConvidados: {
    silva: { nome: "Família Silva", limite: 4, convidados: ["Maria Silva", "João Silva"] },
    ana: { nome: "Ana Paula", limite: 2, convidados: ["Ana Paula"] },
  },
};
