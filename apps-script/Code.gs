/**
 * Convite — Fernando & Sthefany
 * Backend gratuito: Google Apps Script + Google Sheets.
 *
 * COMO USAR (resumo — detalhes no README.md):
 *  1. Crie uma planilha no Google Sheets > Extensões > Apps Script > cole este arquivo.
 *  2. Execute a função  configurarPlanilha()  uma vez (autorize quando pedir).
 *  3. Implantar > Nova implantação > App da Web > Executar como: Eu | Acesso: Qualquer pessoa.
 *  4. Copie a URL terminada em /exec para  js/config.js  (apiUrl).
 */

const ABA_CONVIDADOS = "Convidados";
const ABA_RESPOSTAS = "Respostas";
const ABA_RESUMO = "Resumo";

// ATENÇÃO: não use o parâmetro "c" na URL da API — o Google reserva e devolve erro 400.

// Aceitar confirmações de quem entrou sem link personalizado (sem ?c=...)?
const PERMITIR_SEM_CODIGO = true;
const MAX_PESSOAS_SEM_CODIGO = 6;

/* ============================================================
   1) CONFIGURAÇÃO INICIAL DA PLANILHA (rode uma vez)
   ============================================================ */
function configurarPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const verde = "#545f36", claro = "#eef1e2";

  // fórmulas com vírgula como separador (em pt-BR o Sheets espera ";" e dá #ERROR!)
  ss.setSpreadsheetLocale("en_US");

  // cria as 3 abas antes das fórmulas (elas se referenciam entre si)
  [ABA_CONVIDADOS, ABA_RESPOSTAS, ABA_RESUMO].forEach((n) => ss.getSheetByName(n) || ss.insertSheet(n));

  // ----- Convidados -----
  let sh = ss.getSheetByName(ABA_CONVIDADOS) || ss.insertSheet(ABA_CONVIDADOS);
  if (sh.getLastRow() === 0) {
    sh.getRange("A1:G1").setValues([["Código", "Convidado / Família", "Vagas", "Nomes (separe com ;)", "Status", "Link do convite", "WhatsApp"]]);
    sh.getRange("A2:D3").setValues([
      ["silva", "Família Silva", 4, "Maria Silva; João Silva"],
      ["ana", "Ana Paula", 2, "Ana Paula"],
    ]);
  }
  sh.getRange("E2").setFormula('=ARRAYFORMULA(IF(A2:A="","",IF(COUNTIF(Respostas!B:B,A2:A)>0,"Respondeu","Pendente")))');
  sh.getRange("F2").setFormula('=ARRAYFORMULA(IF(A2:A="","",IF(Resumo!$B$1="","(cole o link do site em Resumo!B1)",Resumo!$B$1&"?c="&A2:A)))');
  sh.getRange("G2").setFormula('=ARRAYFORMULA(IF(OR(A2:A="",Resumo!$B$1=""),"",HYPERLINK("https://wa.me/?text="&ENCODEURL("Olá, "&B2:B&"! Preparamos um convite especial para o nosso casamento. Abra, confirme sua presença e veja os detalhes: "&Resumo!$B$1&"?c="&A2:A),"Enviar no WhatsApp")))');
  estilizarCabecalho_(sh, "A1:G1", verde);
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, 1, 110); sh.setColumnWidth(2, 220); sh.setColumnWidth(3, 70); sh.setColumnWidth(4, 320); sh.setColumnWidth(5, 100); sh.setColumnWidth(6, 330); sh.setColumnWidth(7, 160);
  sh.getRange("A2:A").setNumberFormat("@");
  const regras = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Respondeu").setBackground("#d6e4c0").setRanges([sh.getRange("E2:E")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Pendente").setBackground("#f7e6c4").setRanges([sh.getRange("E2:E")]).build(),
  ];
  sh.setConditionalFormatRules(regras);

  // ----- Respostas -----
  sh = ss.getSheetByName(ABA_RESPOSTAS) || ss.insertSheet(ABA_RESPOSTAS);
  if (sh.getLastRow() === 0) {
    sh.getRange("A1:I1").setValues([["Data/hora", "Código", "Família", "Nome", "Status", "Criança?", "WhatsApp", "Restrição alimentar", "Recado"]]);
  }
  estilizarCabecalho_(sh, "A1:I1", verde);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 140); sh.setColumnWidth(4, 220); sh.setColumnWidth(8, 220); sh.setColumnWidth(9, 320);
  sh.getRange("B2:B").setNumberFormat("@");
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Vai").setBackground("#d6e4c0").setRanges([sh.getRange("E2:E")]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Não vai").setBackground("#f1d9cf").setRanges([sh.getRange("E2:E")]).build(),
  ]);

  // ----- Resumo -----
  sh = ss.getSheetByName(ABA_RESUMO) || ss.insertSheet(ABA_RESUMO);
  const manterLink = sh.getRange("B1").getValue();
  sh.clear();
  sh.getRange("A1").setValue("Link do site (GitHub Pages)");
  sh.getRange("B1").setValue(manterLink || "");
  sh.getRange("C1").setValue("← cole aqui o endereço do site, ex.: https://seuusuario.github.io/convite/");
  sh.getRange("A3:B3").setValues([["PAINEL", ""]]);
  const linhas = [
    ["Convites (famílias/grupos)", '=COUNTA(Convidados!A2:A)'],
    ["Vagas reservadas", '=SUM(Convidados!C2:C)'],
    ["Convites que já responderam", '=COUNTIF(Convidados!E2:E,"Respondeu")'],
    ["Convites pendentes", '=COUNTIF(Convidados!E2:E,"Pendente")'],
    ["Pessoas confirmadas (vão)", '=COUNTIF(Respostas!E2:E,"Vai")'],
    ["   • das quais crianças", '=COUNTIFS(Respostas!E2:E,"Vai",Respostas!F2:F,"Sim")'],
    ["   • adultos", '=B8-B9'],
    ["Pessoas que não vão", '=COUNTIF(Respostas!E2:E,"Não vai")'],
  ];
  sh.getRange(4, 1, linhas.length, 2).setValues(linhas.map((l) => [l[0], ""]));
  linhas.forEach((l, i) => sh.getRange(4 + i, 2).setFormula(l[1]));
  sh.getRange("A3:B3").setBackground(verde).setFontColor("#ffffff").setFontWeight("bold");
  sh.getRange("A1").setFontWeight("bold");
  sh.getRange("B1").setBackground("#fff7d6");
  sh.getRange("B4:B11").setFontSize(14).setFontWeight("bold").setHorizontalAlignment("left");
  sh.getRange("A8:B8").setBackground(claro);
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 360);
  ss.setActiveSheet(sh);

  const padrao = ss.getSheetByName("Página1") || ss.getSheetByName("Sheet1");
  if (padrao && ss.getSheets().length > 1) ss.deleteSheet(padrao);
  try { SpreadsheetApp.getUi().alert("Planilha pronta! Agora publique como App da Web (veja o README)."); } catch (_) { /* rodando fora da planilha */ }
}

function estilizarCabecalho_(sh, range, cor) {
  sh.getRange(range).setBackground(cor).setFontColor("#ffffff").setFontWeight("bold").setVerticalAlignment("middle");
}

/* ============================================================
   2) API
   ============================================================ */
function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action === "guest") return json_(buscarConvidado_(String(p.codigo || "")));
    return json_({ ok: true, msg: "API do convite no ar." });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
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
const norm_ = (s) => String(s || "").trim().toLowerCase();

function lerConvidado_(codigo) {
  const sh = SpreadsheetApp.getActive().getSheetByName(ABA_CONVIDADOS);
  const dados = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 4).getValues();
  for (const [cod, nome, vagas, nomes] of dados) {
    if (cod !== "" && norm_(cod) === norm_(codigo)) {
      return {
        codigo: String(cod).trim(), nome: String(nome), limite: Number(vagas) || 1,
        nomes: String(nomes || "").split(";").map((s) => s.trim()).filter(Boolean),
      };
    }
  }
  return null;
}

function buscarConvidado_(codigo) {
  if (!codigo) return { ok: true, found: false };
  const c = lerConvidado_(codigo);
  if (!c) return { ok: true, found: false };

  const sh = SpreadsheetApp.getActive().getSheetByName(ABA_RESPOSTAS);
  const n = Math.max(sh.getLastRow() - 1, 0);
  const linhas = n ? sh.getRange(2, 1, n, 9).getValues().filter((r) => norm_(r[1]) === norm_(c.codigo)) : [];
  const fixos = c.nomes.map(norm_);

  let convidados, extra = { telefone: "", restricao: "", recado: "" };
  if (linhas.length) {
    convidados = linhas.map((r) => ({ nome: r[3], status: r[4], crianca: r[5] === "Sim", fixo: fixos.includes(norm_(r[3])) }));
    extra = { telefone: String(linhas[0][6] || ""), restricao: String(linhas[0][7] || ""), recado: String(linhas[0][8] || "") };
  } else {
    convidados = (c.nomes.length ? c.nomes : [c.nome]).map((nome) => ({ nome, status: "Vai", crianca: false, fixo: true }));
  }
  return { ok: true, found: true, nome: c.nome, limite: c.limite, respondeu: linhas.length > 0, convidados, ...extra };
}

// evita que um texto vire fórmula na planilha
function seguro_(v) {
  v = String(v == null ? "" : v).trim().slice(0, 400);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function salvarResposta_(b) {
  const ss = SpreadsheetApp.getActive();
  let codigo = String(b.codigo || "").trim();
  let familia = "";
  let limite = MAX_PESSOAS_SEM_CODIGO;

  if (codigo) {
    const c = lerConvidado_(codigo);
    if (!c) return { ok: false, error: "Convite não encontrado. Confira o link." };
    codigo = c.codigo; familia = c.nome; limite = c.limite;
  } else {
    if (!PERMITIR_SEM_CODIGO) return { ok: false, error: "Use o link personalizado do seu convite." };
    codigo = "avulso-" + Utilities.getUuid().slice(0, 6);
  }

  const pessoas = (Array.isArray(b.pessoas) ? b.pessoas : []).filter((p) => p && String(p.nome || "").trim());
  if (!pessoas.length) return { ok: false, error: "Informe pelo menos um nome." };
  if (pessoas.length > limite) return { ok: false, error: "Seu convite reserva até " + limite + " lugar(es)." };

  const sh = ss.getSheetByName(ABA_RESPOSTAS);
  // remove respostas anteriores do mesmo código (permite alterar)
  if (sh.getLastRow() > 1) {
    const cods = sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues();
    for (let i = cods.length - 1; i >= 0; i--) if (norm_(cods[i][0]) === norm_(codigo)) sh.deleteRow(i + 2);
  }

  const agora = new Date();
  const linhas = pessoas.map((p) => [
    agora, codigo, familia || seguro_(pessoas[0].nome),
    seguro_(p.nome), p.status === "Não vai" ? "Não vai" : "Vai", p.crianca ? "Sim" : "Não",
    seguro_(b.telefone), seguro_(b.restricao), seguro_(b.recado),
  ]);
  sh.getRange(sh.getLastRow() + 1, 1, linhas.length, 9).setValues(linhas);
  sh.getRange(sh.getLastRow() - linhas.length + 1, 1, linhas.length, 1).setNumberFormat("dd/MM/yyyy HH:mm");
  return { ok: true };
}
