/**
 * Convite — Fernando & Sthefany
 * Backend gratuito: Google Apps Script + Google Sheets.
 *
 * Convite universal: todos recebem o mesmo link e cada convidado preenche
 * o nome de quem vai. As respostas caem na aba "Respostas" e a aba "Resumo"
 * mostra os contadores.
 *
 * COMO USAR (resumo — detalhes no README.md):
 *  1. Crie uma planilha no Google Sheets > Extensões > Apps Script > cole este arquivo.
 *  2. Execute a função  configurarPlanilha()  uma vez (autorize quando pedir).
 *  3. Implantar > Nova implantação > App da Web > Executar como: Eu | Acesso: Qualquer pessoa.
 *  4. Copie a URL terminada em /exec para  js/config.js  (apiUrl).
 */

const ABA_RESPOSTAS = "Respostas";
const ABA_RESUMO = "Resumo";

// Máximo de pessoas por confirmação (mantenha igual a maxPessoas em js/config.js)
const MAX_PESSOAS = 6;

/* ============================================================
   1) CONFIGURAÇÃO INICIAL DA PLANILHA (rode uma vez)
   ============================================================ */
function configurarPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const verde = "#545f36", claro = "#eef1e2";

  // fórmulas com vírgula como separador (em pt-BR o Sheets espera ";" e dá #ERROR!)
  ss.setSpreadsheetLocale("en_US");

  // cria as abas antes das fórmulas (uma referencia a outra)
  [ABA_RESPOSTAS, ABA_RESUMO].forEach((n) => ss.getSheetByName(n) || ss.insertSheet(n));

  // ----- Respostas -----
  let sh = ss.getSheetByName(ABA_RESPOSTAS);
  if (sh.getLastRow() === 0) {
    sh.getRange("A1:H1").setValues([["Data/hora", "Código", "Família", "Nome", "Status", "Criança?", "WhatsApp", "Recado"]]);
  }
  estilizarCabecalho_(sh, "A1:H1", verde);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 140); sh.setColumnWidth(4, 220); sh.setColumnWidth(8, 320);
  sh.getRange("B2:B").setNumberFormat("@");
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Vai").setBackground("#d6e4c0").setRanges([sh.getRange("E2:E")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Não vai").setBackground("#f1d9cf").setRanges([sh.getRange("E2:E")]).build(),
  ]);

  // ----- Resumo -----
  sh = ss.getSheetByName(ABA_RESUMO);
  sh.clear();
  sh.getRange("A1:B1").setValues([["PAINEL", ""]]);
  const linhas = [
    ["Pessoas confirmadas (vão)", '=COUNTIF(Respostas!E2:E,"Vai")'],
    ["   • das quais crianças", '=COUNTIFS(Respostas!E2:E,"Vai",Respostas!F2:F,"Sim")'],
    ["   • adultos", '=B2-B3'],
    ["Pessoas que não vão", '=COUNTIF(Respostas!E2:E,"Não vai")'],
  ];
  sh.getRange(2, 1, linhas.length, 1).setValues(linhas.map((l) => [l[0]]));
  linhas.forEach((l, i) => sh.getRange(2 + i, 2).setFormula(l[1]));
  sh.getRange("A1:B1").setBackground(verde).setFontColor("#ffffff").setFontWeight("bold");
  sh.getRange("B2:B5").setFontSize(14).setFontWeight("bold").setHorizontalAlignment("left");
  sh.getRange("A2:B2").setBackground(claro);
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 120);
  ss.setActiveSheet(sh);

  // remove abas antigas (versão com links personalizados e planilha em branco padrão)
  ["Convidados", "Página1", "Sheet1"].forEach((n) => {
    const velha = ss.getSheetByName(n);
    if (velha && ss.getSheets().length > 1) ss.deleteSheet(velha);
  });
  try { SpreadsheetApp.getUi().alert("Planilha pronta! Agora publique como App da Web (veja o README)."); } catch (_) { /* rodando fora da planilha */ }
}

function estilizarCabecalho_(sh, range, cor) {
  sh.getRange(range).setBackground(cor).setFontColor("#ffffff").setFontWeight("bold").setVerticalAlignment("middle");
}

/* ============================================================
   2) API
   ============================================================ */
function doGet() {
  return json_({ ok: true, msg: "API do convite no ar." });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const body = JSON.parse(e.postData.contents);
    if (body.action !== "rsvp") return json_({ ok: false, error: "Ação inválida." });
    return json_(salvarResposta_(body));
  } catch (err) {
    return json_({ ok: false, error: "Erro ao salvar: " + err });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// evita que um texto vire fórmula na planilha
function seguro_(v) {
  v = String(v == null ? "" : v).trim().slice(0, 400);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function salvarResposta_(b) {
  const pessoas = (Array.isArray(b.pessoas) ? b.pessoas : []).filter((p) => p && String(p.nome || "").trim());
  if (!pessoas.length) return { ok: false, error: "Informe pelo menos um nome." };
  if (pessoas.length > MAX_PESSOAS) return { ok: false, error: "Você pode confirmar até " + MAX_PESSOAS + " pessoas por vez." };

  const sh = SpreadsheetApp.getActive().getSheetByName(ABA_RESPOSTAS);
  const codigo = "avulso-" + Utilities.getUuid().slice(0, 6); // identifica quem enviou junto
  const agora = new Date();
  const linhas = pessoas.map((p) => [
    agora, codigo, seguro_(pessoas[0].nome),
    seguro_(p.nome), p.status === "Não vai" ? "Não vai" : "Vai", p.crianca ? "Sim" : "Não",
    seguro_(b.telefone), seguro_(b.recado),
  ]);
  sh.getRange(sh.getLastRow() + 1, 1, linhas.length, 8).setValues(linhas);
  sh.getRange(sh.getLastRow() - linhas.length + 1, 1, linhas.length, 1).setNumberFormat("dd/MM/yyyy HH:mm");
  return { ok: true };
}
