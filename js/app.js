/* ==========================================================
   Convite — Fernando & Sthefany
   ========================================================== */
(() => {
  "use strict";
  const C = window.CONVITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const params = new URLSearchParams(location.search);
  const CODE = (params.get("c") || "").trim();
  const API = (C.apiUrl || "").trim();
  const DEMO = !API;

  /* ---------------------------------------------------------
     Galhos de eucalipto (SVG gerado)
     --------------------------------------------------------- */
  function rng(seed) { // mulberry32
    return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const GREENS = ["#6f7f4f", "#7f8f5f", "#8f9e70", "#a3b087", "#b6c19d", "#5c6b3e"];

  function branchSVG(seed, len = 300, pairs = 8, bend = -0.16) {
    const r = rng(seed);
    const P0 = [0, 0], C1 = [len * 0.5, len * bend], P1 = [len, len * 0.1];
    const pt = (t) => [
      (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * C1[0] + t * t * P1[0],
      (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * C1[1] + t * t * P1[1],
    ];
    const tan = (t) => Math.atan2(2 * (1 - t) * (C1[1] - P0[1]) + 2 * t * (P1[1] - C1[1]), 2 * (1 - t) * (C1[0] - P0[0]) + 2 * t * (P1[0] - C1[0]));
    let leaves = "";
    const leaf = (x, y, deg, s) => {
      const col = GREENS[Math.floor(r() * GREENS.length)];
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})">
        <ellipse cx="${(s * 0.95).toFixed(1)}" cy="0" rx="${(s * 0.95).toFixed(1)}" ry="${(s * 0.74).toFixed(1)}" fill="${col}" opacity=".93"/>
        <path d="M0 0 L${(s * 1.7).toFixed(1)} 0" stroke="#fff" stroke-opacity=".28" stroke-width=".9" fill="none"/></g>`;
    };
    for (let i = 1; i <= pairs; i++) {
      const t = i / pairs, [x, y] = pt(t), a = tan(t);
      const s = 25 * (1 - 0.5 * t) + r() * 7;
      for (const side of [-1, 1]) {
        if (i === pairs && side === 1) continue;
        const ang = (i === pairs ? 0 : side * (52 + r() * 28)) + (a * 180) / Math.PI;
        leaves += leaf(x, y, ang, i === pairs ? s * 1.1 : s * (0.85 + r() * 0.3));
      }
    }
    const stem = `M0 0 Q${C1[0]} ${C1[1]} ${P1[0]} ${P1[1]}`;
    return `<svg viewBox="-30 -${len * 0.35} ${len + 80} ${len * 0.8}" aria-hidden="true"><g class="sway">
      <path d="${stem}" stroke="#5c6b3e" stroke-width="2.2" fill="none" stroke-linecap="round"/>${leaves}</g></svg>`;
  }

  const BRANCHES = { tl: [3, 300, 9, 0.16], tr: [7, 250, 8, 0.2], bl: [11, 230, 7, 0.14], br: [5, 260, 8, 0.18] };
  $$("[data-branch]").forEach((el) => { const [s, l, p, b] = BRANCHES[el.dataset.branch]; el.innerHTML = branchSVG(s, l, p, b); });

  // fundo do envelope
  const envBg = $(".leaves-bg");
  [
    { s: 21, l: 300, p: 9, css: "top:-30px;left:-60px;width:330px;transform:rotate(30deg)" },
    { s: 22, l: 260, p: 8, css: "bottom:-40px;right:-70px;width:300px;transform:rotate(210deg)" },
    { s: 23, l: 220, p: 7, css: "top:8%;right:-80px;width:230px;transform:scaleX(-1) rotate(20deg)" },
    { s: 24, l: 220, p: 7, css: "bottom:6%;left:-90px;width:240px;transform:rotate(-24deg)" },
  ].forEach((b) => {
    const d = document.createElement("div"); d.className = "b"; d.style.cssText = b.css;
    d.innerHTML = branchSVG(b.s, b.l, b.p, 0.16); d.querySelector("svg").style.width = "100%"; envBg.append(d);
  });

  /* ---------------------------------------------------------
     Textos do convite (a partir do config.js)
     --------------------------------------------------------- */
  const when = new Date(C.data);
  const fmt = (o) => new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", ...o }).format(when);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  (() => {
    $("#phrase").textContent = C.frase;
    $("#verse").textContent = C.versiculo; $("#verse-ref").textContent = C.versiculoRef || "";
    $("#when-date").textContent = `${fmt({ day: "2-digit" })} de ${fmt({ month: "long" })} de ${fmt({ year: "numeric" })}`;
    if (C.mostrarHorario) {
      const [hh, mm] = fmt({ hour: "2-digit", minute: "2-digit", hour12: false }).split(":");
      $("#when-time").innerHTML = `${cap(fmt({ weekday: "long" }))} &nbsp;|&nbsp; <b>${+hh}h${mm !== "00" ? mm : ""}</b>`;
    } else {
      $("#when-time").textContent = cap(fmt({ weekday: "long" }));
    }
    if (C.prazoConfirmacao) { const d = $("#deadline"); d.textContent = C.prazoConfirmacao; d.hidden = false; }
    document.title = `${C.noivo} & ${C.noiva} — Convite de Casamento`;
  })();

  // contagem regressiva
  (function countdown() {
    const el = $("#countdown");
    const tick = () => {
      const ms = when - Date.now();
      if (ms <= 0) { el.hidden = true; return; }
      const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      const cell = (n, l) => `<div class="cd"><b>${String(n).padStart(2, "0")}</b><small>${l}</small></div>`;
      el.innerHTML = cell(d, "dias") + cell(h, "horas") + cell(m, "min") + cell(s, "seg");
    };
    tick(); setInterval(tick, 1000);
  })();

  /* ---------------------------------------------------------
     Fluxo: envelope → fotos → convite
     --------------------------------------------------------- */
  const envScreen = $("#envelope-screen"), envelope = $("#envelope"), intro = $("#intro-screen"), invite = $("#invite");
  let opened = false;

  const audio = C.musica ? Object.assign(new Audio(C.musica), { loop: true, volume: 0.6 }) : null;
  const musicBtn = $("#music");
  if (audio) {
    musicBtn.hidden = false;
    musicBtn.onclick = () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); };
    audio.onplay = () => musicBtn.setAttribute("aria-pressed", "true");
    audio.onpause = () => musicBtn.setAttribute("aria-pressed", "false");
  }

  async function openEnvelope() {
    if (opened) return; opened = true;
    envelope.classList.add("open");
    $("#env-hint").style.opacity = 0;
    audio?.play().catch(() => {});
    if (C.fotos.length) C.fotos.forEach((src) => { const i = new Image(); i.src = src; });
    await wait(3000);
    envScreen.classList.add("leaving");
    await wait(700);
    C.fotos.length ? playIntro() : showInvite();
    await wait(300); envScreen.hidden = true;
  }
  $("#seal").addEventListener("click", (e) => { e.stopPropagation(); openEnvelope(); });
  envelope.addEventListener("click", openEnvelope);

  let introDone = false;
  async function playIntro() {
    const box = $("#slides");
    C.fotos.forEach((src) => { const d = document.createElement("div"); d.className = "slide"; d.style.backgroundImage = `url("${src}")`; box.append(d); });
    intro.hidden = false;
    const slides = $$(".slide", box);
    $("#skip").onclick = finish;
    for (let i = 0; i < slides.length && !introDone; i++) {
      slides[i].classList.add("on");
      await wait(C.segundosPorFoto * 1000);
      if (introDone) return;
      if (i < slides.length - 1) slides[i].classList.remove("on");
    }
    finish();
    function finish() {
      if (introDone) return; introDone = true;
      showInvite(); intro.classList.add("leaving"); setTimeout(() => (intro.hidden = true), 1000);
    }
  }

  function showInvite() {
    invite.hidden = false;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => invite.classList.add("show")));
    greet();
  }

  async function greet() {
    if (!CODE) return;
    try {
      const g = await apiGuest(CODE);
      if (g && g.found) { const el = $("#greeting"); el.innerHTML = `Convite para <b>${esc(g.nome)}</b>`; el.hidden = false; }
    } catch { /* silencioso */ }
  }

  /* ---------------------------------------------------------
     API (Google Apps Script) + modo demonstração
     --------------------------------------------------------- */
  const DEMO_KEY = "convite-demo-respostas";
  const demoStore = () => { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "{}"); } catch { return {}; } };

  async function http(url, opts = {}) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 20000);
    try { const r = await fetch(url, { ...opts, signal: ctl.signal }); return await r.json(); } finally { clearTimeout(t); }
  }

  async function apiGuest(code) {
    if (DEMO) {
      await wait(350);
      const base = C.demoConvidados[code.toLowerCase()];
      if (!base) return { ok: true, found: false };
      const saved = demoStore()[code.toLowerCase()];
      const fixed = base.convidados.map((n) => n.toLowerCase());
      const pessoas = saved ? saved.pessoas.map((p) => ({ ...p, fixo: fixed.includes(p.nome.toLowerCase()) })) : base.convidados.map((nome) => ({ nome, status: "Vai", crianca: false, fixo: true }));
      return { ok: true, found: true, nome: base.nome, limite: base.limite, respondeu: !!saved, convidados: pessoas, telefone: saved?.telefone || "", restricao: saved?.restricao || "", recado: saved?.recado || "" };
    }
    return http(`${API}?action=guest&codigo=${encodeURIComponent(code)}`);
  }

  async function apiSend(payload) {
    if (DEMO) {
      await wait(700);
      const s = demoStore(); const key = (payload.codigo || "avulso-" + Date.now()).toLowerCase();
      s[key] = { ...payload, quando: new Date().toISOString() };
      localStorage.setItem(DEMO_KEY, JSON.stringify(s));
      return { ok: true };
    }
    return http(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  }

  /* ---------------------------------------------------------
     Painéis
     --------------------------------------------------------- */
  const sheet = $("#sheet"), sheetBody = $("#sheet-body");
  let lastFocus = null;

  function openSheet(html) {
    lastFocus = document.activeElement;
    sheetBody.innerHTML = html;
    sheet.classList.remove("closing"); sheet.hidden = false;
    document.body.style.overflow = "hidden";
    $(".sheet-panel").scrollTop = 0;
    $(".sheet-x").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.classList.add("closing");
    setTimeout(() => { sheet.hidden = true; sheet.classList.remove("closing"); sheetBody.innerHTML = ""; document.body.style.overflow = ""; lastFocus?.focus?.({ preventScroll: true }); }, 280);
  }
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

  const head = (eyebrow, title, sub = "") => `<div class="sh-head"><p class="eyebrow">${eyebrow}</p><h2 id="sheet-title">${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>`;

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200); }

  const VIEWS = {
    local() {
      const L = C.local;
      return head("Cerimônia & recepção", "Como chegar") + `
        <div class="block"><h3>Local</h3><p>${esc(L.nome)}</p>${L.endereco ? `<p class="muted">${esc(L.endereco)}</p>` : ""}${L.observacao ? `<p class="muted">${esc(L.observacao)}</p>` : ""}</div>
        <div class="block"><h3>${C.mostrarHorario ? "Data e horário" : "Data"}</h3><p>${esc($("#when-date").textContent)}</p><p class="muted">${esc($("#when-time").textContent.replace(/\s+/g, " "))}</p></div>
        ${L.mapsUrl || L.wazeUrl ? `<div class="btn-row">
          ${L.mapsUrl ? `<a class="btn solid" href="${esc(L.mapsUrl)}" target="_blank" rel="noopener">Google Maps</a>` : ""}
          ${L.wazeUrl ? `<a class="btn" href="${esc(L.wazeUrl)}" target="_blank" rel="noopener">Waze</a>` : ""}
        </div>` : ""}`;
    },
    presentes() {
      const P = C.presentes;
      return head("Com carinho", "Presentes", esc(P.texto)) + `
        ${P.pixChave ? `<div class="block"><h3>Chave Pix</h3><p>${esc(P.pixNome)}</p>
          <div class="pix"><span id="pix-key">${esc(P.pixExibir || P.pixChave)}</span><button type="button" id="pix-copy">Copiar</button></div></div>` : `<div class="block"><h3>Em breve</h3><p class="muted">Em breve divulgaremos as opções por aqui.</p></div>`}
        ${P.listaUrl ? `<div class="btn-row"><a class="btn solid" href="${esc(P.listaUrl)}" target="_blank" rel="noopener">Ver lista de presentes</a></div>` : ""}`;
    },
    info() {
      const wa = C.whatsapp ? `<div class="btn-row"><a class="btn solid" target="_blank" rel="noopener" href="https://wa.me/${esc(C.whatsapp)}?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre o casamento.")}">Falar com os noivos</a></div>` : "";
      return head("Para você se preparar", "Informações") + C.informacoes.map((i) => `<div class="block"><h3>${esc(i.titulo)}</h3><p>${esc(i.texto)}</p></div>`).join("") + wa;
    },
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]"); if (!t) return;
    const k = t.dataset.open;
    if (k === "rsvp") return openRSVP();
    openSheet(VIEWS[k]());
    if (k === "presentes" && C.presentes.pixChave) $("#pix-copy").onclick = async () => {
      try { await navigator.clipboard.writeText(C.presentes.pixChave); } catch {
        const r = document.createRange(); r.selectNodeContents($("#pix-key")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand("copy"); s.removeAllRanges();
      }
      toast("Chave Pix copiada");
    };
  });

  /* ---------------------------------------------------------
     RSVP
     --------------------------------------------------------- */
  let state = null; // { limite, fixedCount, pessoas, telefone, restricao, recado, respondeu, nome }

  async function openRSVP() {
    openSheet(head("Confirmação", "Confirmar presença") + `<div class="loading"><div class="spin"></div>Buscando seu convite…</div>`);
    try {
      if (CODE) {
        const g = await apiGuest(CODE);
        if (!g || !g.found) return renderNotFound();
        state = { nome: g.nome, limite: g.limite, pessoas: g.convidados.map((p) => ({ ...p })), telefone: g.telefone || "", restricao: g.restricao || "", recado: g.recado || "", respondeu: !!g.respondeu };
      } else {
        if (!C.permitirSemCodigo) return renderNotFound();
        state = { nome: "", limite: C.maxPessoasSemCodigo, pessoas: [{ nome: "", status: "Vai", crianca: false }], telefone: "", restricao: "", recado: "", respondeu: false };
      }
      renderForm();
    } catch (err) { renderError("Não consegui carregar agora. Verifique sua internet e tente de novo."); }
  }

  function renderNotFound() {
    const wa = C.whatsapp ? `<div class="btn-row"><a class="btn solid" target="_blank" rel="noopener" href="https://wa.me/${esc(C.whatsapp)}">Falar com os noivos</a></div>` : "";
    sheetBody.innerHTML = head("Ops", "Convite não encontrado", "Confira se o link está completo ou fale com a gente.") + wa;
  }
  function renderError(msg) {
    sheetBody.innerHTML = head("Ops", "Algo deu errado", esc(msg)) + `<div class="btn-row"><button class="btn solid" type="button" id="retry">Tentar novamente</button></div>`;
    $("#retry").onclick = openRSVP;
  }

  function personRow(p, i) {
    return `<div class="person" data-i="${i}">
      <div class="person-top">
        <input type="text" class="p-nome" placeholder="Nome completo" value="${esc(p.nome)}" autocomplete="off" ${p.fixo ? "" : ""} aria-label="Nome da pessoa ${i + 1}" maxlength="80">
        ${p.fixo ? "" : `<button type="button" class="rm" data-rm="${i}" aria-label="Remover">×</button>`}
      </div>
      <div class="person-opts">
        <div class="seg" role="radiogroup" aria-label="Presença">
          <label><input type="radio" name="st-${i}" value="Vai" ${p.status !== "Não vai" ? "checked" : ""}><span>Vou</span></label>
          <label class="no"><input type="radio" name="st-${i}" value="Não vai" ${p.status === "Não vai" ? "checked" : ""}><span>Não vou</span></label>
        </div>
        <label class="chk"><input type="checkbox" class="p-kid" ${p.crianca ? "checked" : ""}> Criança</label>
      </div></div>`;
  }

  function renderForm() {
    const s = state;
    const sub = s.nome ? `Olá, <b>${esc(s.nome)}</b>! Marque quem estará conosco.` : "Preencha o nome de quem irá ao casamento.";
    sheetBody.innerHTML = head("Confirmação", "Confirmar presença", sub) + `
      <form class="form" id="rsvp-form" novalidate>
        ${s.respondeu ? `<p class="already">Você já respondeu — pode alterar sua resposta abaixo.</p>` : ""}
        <div class="people" id="people">${s.pessoas.map(personRow).join("")}</div>
        <button type="button" class="add" id="add" ${s.pessoas.length >= s.limite ? "hidden" : ""}>+ Adicionar pessoa</button>
        <p class="note" id="limit-note">${s.limite ? `Seu convite reserva até ${s.limite} lugar${s.limite > 1 ? "es" : ""}.` : ""}</p>
        <div class="field"><label for="f-tel">WhatsApp (opcional)</label><input type="tel" id="f-tel" inputmode="tel" placeholder="(00) 00000-0000" value="${esc(s.telefone)}" maxlength="30"></div>
        <div class="field"><label for="f-res">Restrição alimentar (opcional)</label><input type="text" id="f-res" placeholder="Ex.: vegetariano, alergia a amendoim" value="${esc(s.restricao)}" maxlength="140"></div>
        <div class="field"><label for="f-rec">Recado para os noivos (opcional)</label><textarea id="f-rec" maxlength="400" placeholder="Deixe uma mensagem carinhosa…">${esc(s.recado)}</textarea></div>
        <p class="err" id="err" hidden></p>
        <button class="btn solid" type="submit" id="send">Enviar confirmação</button>
        ${DEMO ? demoNote() : ""}
      </form>`;
    const form = $("#rsvp-form");
    form.addEventListener("submit", submitRSVP);
    $("#add").onclick = () => { sync(); state.pessoas.push({ nome: "", status: "Vai", crianca: false }); renderForm(); $$(".p-nome").pop().focus(); };
    $$("[data-rm]").forEach((b) => (b.onclick = () => { sync(); state.pessoas.splice(+b.dataset.rm, 1); renderForm(); }));
  }

  function demoNote() {
    const saved = JSON.stringify(demoStore(), null, 2);
    return `<div class="demo-tag"><b>Modo demonstração</b> — a planilha ainda não foi conectada, então as respostas ficam só neste navegador.
      <details><summary>Ver o que foi salvo</summary><pre>${esc(saved === "{}" ? "(nada ainda)" : saved)}</pre></details></div>`;
  }

  function sync() {
    $$(".person").forEach((row, i) => {
      const p = state.pessoas[i]; if (!p) return;
      p.nome = $(".p-nome", row).value.trim();
      p.status = $(`input[name="st-${i}"]:checked`, row)?.value || "Vai";
      p.crianca = $(".p-kid", row).checked;
    });
    state.telefone = $("#f-tel").value.trim(); state.restricao = $("#f-res").value.trim(); state.recado = $("#f-rec").value.trim();
  }

  async function submitRSVP(e) {
    e.preventDefault(); sync();
    const err = $("#err"); err.hidden = true;
    const pessoas = state.pessoas.filter((p) => p.nome);
    if (!pessoas.length) { err.textContent = "Informe pelo menos um nome."; err.hidden = false; return; }
    if (state.pessoas.some((p) => !p.nome)) { err.textContent = "Preencha o nome de todos ou remova a linha vazia."; err.hidden = false; return; }
    const btn = $("#send"); btn.disabled = true; btn.innerHTML = `<span class="spin"></span>Enviando…`;
    try {
      const res = await apiSend({
        action: "rsvp", codigo: CODE, pessoas: pessoas.map(({ nome, status, crianca }) => ({ nome, status, crianca })),
        telefone: state.telefone, restricao: state.restricao, recado: state.recado,
      });
      if (!res || !res.ok) throw new Error(res?.error || "Falha ao enviar");
      state.pessoas = pessoas; renderDone();
    } catch (ex) {
      err.textContent = ex.message && ex.message !== "Failed to fetch" && !/abort/i.test(ex.name) ? ex.message : "Não foi possível enviar. Verifique sua internet e tente novamente.";
      err.hidden = false; btn.disabled = false; btn.textContent = "Enviar confirmação";
    }
  }

  function renderDone() {
    const going = state.pessoas.filter((p) => p.status === "Vai");
    const title = going.length ? "Presença confirmada!" : "Resposta enviada";
    const sub = going.length ? "Que alegria ter você com a gente nesse dia tão especial." : "Sentiremos a sua falta, mas agradecemos o carinho.";
    sheetBody.innerHTML = `<div class="done">
      <div class="check"><svg viewBox="0 0 24 24"><path d="M5 12.500 10 17.500 19 7.500"/></svg></div>
      ${head("Obrigado", title, sub)}
      <ul>${state.pessoas.map((p) => `<li class="${p.status === "Vai" ? "yes" : "no"}"><span>${esc(p.nome)}${p.crianca ? " (criança)" : ""}</span><small>${p.status === "Vai" ? "Confirmado" : "Não vai"}</small></li>`).join("")}</ul>
      <div class="btn-row">
        ${going.length ? `<button class="btn solid" type="button" id="ics">Adicionar à agenda</button>` : ""}
        ${CODE ? `<button class="btn" type="button" id="edit">Alterar resposta</button>` : ""}
      </div>
      ${DEMO ? demoNote() : ""}</div>`;
    $(".sheet-panel").scrollTop = 0;
    if (going.length) $("#ics").onclick = downloadICS;
    if (CODE) $("#edit").onclick = () => { state.respondeu = true; renderForm(); };
  }

  function downloadICS() {
    const z = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const day = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(d).replace(/-/g, "");
    const end = new Date(when.getTime() + C.duracaoHoras * 36e5);
    const [ds, de] = C.mostrarHorario
      ? [`DTSTART:${z(when)}`, `DTEND:${z(end)}`]
      : [`DTSTART;VALUE=DATE:${day(when)}`, `DTEND;VALUE=DATE:${day(new Date(when.getTime() + 864e5))}`];
    const t = (s) => String(s).replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Convite//PT-BR", "BEGIN:VEVENT",
      `UID:casamento-${when.getTime()}@convite`, `DTSTAMP:${z(new Date())}`, ds, de,
      `SUMMARY:${t(`Casamento ${C.noivo} & ${C.noiva}`)}`, `LOCATION:${t(`${C.local.nome} - ${C.local.endereco}`)}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Amanhã é o casamento!", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar" })), download: "casamento.ics" });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* atalho para desenvolvimento: index.html?pular=1 abre direto o convite */
  if (params.get("pular")) { opened = true; envScreen.hidden = true; showInvite(); }
})();
