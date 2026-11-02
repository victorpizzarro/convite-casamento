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

  local: {
    nome: "Salão de festa Regina",
    endereco: "R. São Plácido, 306 - Paciência, Rio de Janeiro - RJ, 23580-030",
    observacao: "",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sal%C3%A3o%20de%20festa%20Regina%2C%20R.%20S%C3%A3o%20Pl%C3%A1cido%2C%20306%20-%20Paci%C3%AAncia%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2023580-030",
    wazeUrl: "https://waze.com/ul?q=Sal%C3%A3o%20de%20festa%20Regina%2C%20R.%20S%C3%A3o%20Pl%C3%A1cido%2C%20306%20-%20Paci%C3%AAncia%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2023580-030&navigate=yes",
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
  apiUrl: "https://script.google.com/macros/s/AKfycbyuvR9bi0OR2F0MYeklIO_2wPSEtO34UOvR5hOXK66yiK1J_iKR-dWrfuf2YLs5VjxyTA/exec",

  // Permitir confirmar sem link personalizado (sem ?c=...)?
  permitirSemCodigo: true,
  maxPessoasSemCodigo: 6,

  // Convidados de exemplo para o modo demonstração. Teste com  index.html?c=silva
  demoConvidados: {
    silva: { nome: "Família Silva", limite: 4, convidados: ["Maria Silva", "João Silva"] },
    ana: { nome: "Ana Paula", limite: 2, convidados: ["Ana Paula"] },
  },
};
