/****************************************************
 * ORGANI$A - main.js (frontend/js/main.js)
 * - Proteção do dashboard
 * - Logout
 * - Tema (dark/light)
 * - Idioma (pt/en)
 * - CRUD (Receitas/Despesas) com modais
 * - Tabela + Filtro + Busca
 * - Gráficos com Chart.js (destroy para não bugar)
 ****************************************************/

/***********************
 * CONFIG
 ***********************/
const API_BASE = "https://organiza-backend-ikdh.onrender.com/api"; // backend
const LOGIN_PAGE = "login.html";

/***********************
 * AUTH / PROTEÇÃO
 ***********************/
const userRaw = localStorage.getItem("usuario");
let user = null;

try {
  user = userRaw ? JSON.parse(userRaw) : null;
} catch {
  user = null;
}

if (!user) {
  window.location.href = LOGIN_PAGE;
}
async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : ""
    },
    ...options
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "login.html";
    return;
  }

  return res.json();
}

/***********************
 * ELEMENTOS (DOM)
 ***********************/
const el = (id) => document.getElementById(id);

const greeting = el("greeting");
const displayName = el("displayName");
const logoutBtn = el("logoutBtn");

const themeSelect = el("themeSelect");
const languageSelect = el("languageSelect");

const addIncomeBtn = el("addIncomeBtn");
const addExpenseBtn = el("addExpenseBtn");

const startDate = el("startDate");
const endDate = el("endDate");
const searchInput = el("searchInput");
const applyFilterBtn = el("applyFilter");

const transactionsTable = el("transactionsTable");

// métricas
const m1Value = el("m1-value");
const m2Value = el("m2-value");
const m3Value = el("m3-value");
const sumReceitas = el("sumReceitas");
const sumDespesas = el("sumDespesas");
const sumSaldo = el("sumSaldo");

// canvas
const pieCanvas = el("pieChartMain");
const barCanvas = el("barCompare");
const lineCanvas = el("balanceChart");

/***********************
 * SAUDAÇÃO
 ***********************/
if (greeting) greeting.textContent = `Olá, ${user?.nome || "Usuario"}`;
if (displayName) displayName.textContent = user?.nome || "Usuario";

/***********************
 * LOGOUT
 ***********************/
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("theme");
    localStorage.removeItem("lang");
    window.location.href = LOGIN_PAGE;
  });
}

/***********************
 * TEMA (dark/light)
 ***********************/

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  // força recalcular estilos dos elementos principais
  document.querySelectorAll("body, .panel, .muted, .metric-value, .text-on-light")
    .forEach(el => {
      el.style.color = getComputedStyle(document.body).getPropertyValue("--text");
    });
}

(function initTheme() {
  const saved = localStorage.getItem("theme") || user?.tema || "dark";
  applyTheme(saved);
  if (themeSelect) themeSelect.value = saved;

  themeSelect?.addEventListener("change", () => {
    const t = themeSelect.value;
    localStorage.setItem("theme", t);
    applyTheme(t);
    // salva no usuário local
    user.tema = t;
    localStorage.setItem("usuario", JSON.stringify(user));
    renderAll(); // garante que tabela e gráficos se atualizem imediatamente
  });
})();

/***********************
 * IDIOMA (pt/en)
 ***********************/
const I18N = {
  pt: {
    labelFrom: "De:",
    labelTo: "Até:",
    btnFilter: "Filtrar",
    logoutText: "Sair",
    m1Title: "Receitas",
    evolutionTitle: "Evolução Financeira Mensal",
    recentTitle: "Lançamentos",
    addIncome: "Incluir Receita",
    addExpense: "Incluir Despesa",
    modalTitleIncome: "Receita",
    modalTitleExpense: "Despesa",
    fieldDate: "Data",
    fieldValue: "Valor",
    fieldCategory: "Categoria",
    fieldDesc: "Descrição",
    fieldType: "Tipo",
    typeIncome: "Receita",
    typeExpense: "Despesa",
    save: "Salvar",
    cancel: "Cancelar",
    edit: "Editar",
    del: "Excluir",
    confirmDel: "Deseja excluir este item?",
    empty: "Sem transações para exibir.",
  },
  en: {
    labelFrom: "From:",
    labelTo: "To:",
    btnFilter: "Filter",
    logoutText: "Logout",
    m1Title: "Income",
    evolutionTitle: "Monthly Financial Evolution",
    recentTitle: "Transactions",
    addIncome: "Add Income",
    addExpense: "Add Expense",
    modalTitleIncome: "Income",
    modalTitleExpense: "Expense",
    fieldDate: "Date",
    fieldValue: "Value",
    fieldCategory: "Category",
    fieldDesc: "Description",
    fieldType: "Type",
    typeIncome: "Income",
    typeExpense: "Expense",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    del: "Delete",
    confirmDel: "Do you want to delete this item?",
    empty: "No transactions to display.",
  }
};

let lang = localStorage.getItem("lang") || user?.idioma || "pt";

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.pt[key] || key;
}

function applyLanguage() {
  // ids do seu HTML
  if (el("labelFrom")) el("labelFrom").textContent = t("labelFrom");
  if (el("labelTo")) el("labelTo").textContent = t("labelTo");
  if (el("btnFilter")) el("btnFilter").textContent = t("btnFilter");
  if (el("logoutText")) el("logoutText").textContent = t("logoutText");
  if (el("m1-title")) el("m1-title").textContent = t("m1Title");
  if (el("evolution-title")) el("evolution-title").textContent = t("evolutionTitle");
  if (el("recent-title")) el("recent-title").textContent = t("recentTitle");
  if (addIncomeBtn) addIncomeBtn.textContent = `+ ${t("addIncome")}`;
  if (addExpenseBtn) addExpenseBtn.textContent = `- ${t("addExpense")}`;
}

(function initLanguage() {
  if (languageSelect) {
    languageSelect.value = lang;
    languageSelect.addEventListener("change", () => {
      lang = languageSelect.value;
      localStorage.setItem("lang", lang);
      user.idioma = lang;
      localStorage.setItem("usuario", JSON.stringify(user));
      applyLanguage();
      renderAll(); // re-render tabela/labels
    });
  }
  applyLanguage();
})();

/***********************
 * HELPERS
 ***********************/
function moneyBR(value) {
  const n = Number(value || 0);
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

function toISODateInput(value) {
  // aceita "YYYY-MM-DD" ou Date
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  // se vier "2025-12-13T..." corta
  if (typeof value === "string" && value.includes("T")) return value.slice(0, 10);
  return value;
}

function parseDate(d) {
  // d pode ser "YYYY-MM-DD" ou "DD/MM/YYYY"
  if (!d) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + "T00:00:00");
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
    const [dd, mm, yyyy] = d.split("/");
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  }
  // tenta Date nativa
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt;
}


// Receitas
const api = {
  getReceitas: () => request(`${API_BASE}/receitas`),
  criarReceita: (payload) => request(`${API_BASE}/receitas`, { method: "POST", body: JSON.stringify(payload) }),
  updateReceita: (id, payload) => request(`${API_BASE}/receitas/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteReceita: (id) => request(`${API_BASE}/receitas/${id}`, { method: "DELETE" }),

  // Despesas
  getDespesas: () => request(`${API_BASE}/despesas`),
  criarDespesa: (payload) => request(`${API_BASE}/despesas`, { method: "POST", body: JSON.stringify(payload) }),
  updateDespesa: (id, payload) => request(`${API_BASE}/despesas/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteDespesa: (id) => request(`${API_BASE}/despesas/${id}`, { method: "DELETE" }),
};
/***********************
 * CARTÕES (localStorage)
 ***********************/
function getCartoes() {
  return JSON.parse(localStorage.getItem("cartoes")) || [];
}

function saveCartoes(cartoes) {
  localStorage.setItem("cartoes", JSON.stringify(cartoes));
}

function renderListaCartoes() {
  const container = document.getElementById("listaCartoes");
  if (!container) return;

  const cartoes = getCartoes();

  if (cartoes.length === 0) {
    container.innerHTML = `
      <p class="text-sm muted text-center py-4">
        Nenhum cartão cadastrado.
      </p>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-3">
      ${cartoes.map((c, i) => `
        <div class="p-3 rounded-md bg-white/5 flex justify-between items-center">
          <div>
            <p class="font-semibold">
              💳 ${c.nome}
            </p>
            <p class="text-xs muted">
              ${c.banco} • ${c.bandeira} • Limite: ${moneyBR(c.limite)}
            </p>
            <p class="text-xs muted">
              Fecha dia ${c.fechamento} • Vence dia ${c.vencimento}
            </p>
          </div>

          <button
            class="text-red-400 hover:text-red-500 text-sm"
            data-index="${i}"
          >
            🗑️
          </button>
        </div>
      `).join("")}
    </div>
  `;

  // excluir cartão
  container.querySelectorAll("button[data-index]").forEach(btn => {
    btn.onclick = () => {
      const index = Number(btn.dataset.index);
      const cartoes = getCartoes();
      cartoes.splice(index, 1);
      saveCartoes(cartoes);
      renderListaCartoes();
    };
  });
}
/***********************
 * CONTAS (localStorage)
 ***********************/
function getContas() {
  return JSON.parse(localStorage.getItem("contas")) || [];
}

function saveContas(contas) {
  localStorage.setItem("contas", JSON.stringify(contas));
}
function renderListaContas() {
  const container = document.getElementById("listaContas");
  if (!container) return;

  const contas = getContas();

  if (contas.length === 0) {
    container.innerHTML = `
      <p class="text-sm muted text-center py-4">
        Nenhuma conta cadastrada.
      </p>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-3">
      ${contas.map((c, i) => `
        <div class="p-3 rounded-md bg-white/5 flex justify-between items-center">
          <div>
            <p class="font-semibold">
              🏦 ${c.nome}
            </p>
            <p class="text-xs muted">
              Tipo: ${c.tipo} • Saldo: ${moneyBR(c.saldo)}
            </p>
          </div>

          <button
            class="text-red-400 hover:text-red-500 text-sm"
            data-index="${i}"
          >
            🗑️
          </button>
        </div>
      `).join("")}
    </div>
  `;

  // excluir conta
  container.querySelectorAll("button[data-index]").forEach(btn => {
    btn.onclick = () => {
      const index = Number(btn.dataset.index);
      const contas = getContas();
      contas.splice(index, 1);
      saveContas(contas);
      renderListaContas();
    };
  });
}
// ============================
// MODAL DE MINHAS CONTAS
// ============================
function openContasModal() {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-lg animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">🏦 Minhas Contas</h3>
        <button id="contaClose"
          class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">
          ✖
        </button>
      </div>

      <!-- 🔽 LISTA DE CONTAS -->
      <div id="listaContas" class="mb-6"></div>

      <!-- 🔽 FORMULÁRIO -->
      <div class="space-y-4">
        <div>
          <label class="text-sm muted">Nome da conta</label>
          <input id="contaNome" type="text"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light"
            placeholder="Ex: Conta Corrente Nubank">
        </div>

        <div>
          <label class="text-sm muted">Tipo</label>
          <select id="contaTipo"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm">
            <option value="">Selecione</option>
            <option>Conta Corrente</option>
            <option>Poupança</option>
            <option>Carteira</option>
            <option>Investimentos</option>
          </select>
        </div>

        <div>
          <label class="text-sm muted">Saldo inicial (R$)</label>
          <input id="contaSaldo" type="number" step="0.01"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light">
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button id="contaCancel"
          class="flex-1 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">
          Cancelar
        </button>

        <button id="contaSave"
          class="flex-1 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Salvar Conta
        </button>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  // 🔹 renderiza lista ao abrir
  renderListaContas();

  const close = () => (root.innerHTML = "");

  overlay.querySelector("#contaClose").onclick = close;
  overlay.querySelector("#contaCancel").onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  // 🔹 salvar conta
  overlay.querySelector("#contaSave").onclick = () => {
    const conta = {
      nome: el("contaNome").value.trim(),
      tipo: el("contaTipo").value,
      saldo: Number(el("contaSaldo").value || 0)
    };

    if (!conta.nome || !conta.tipo) {
      alert("Informe nome e tipo da conta.");
      return;
    }

    const contas = getContas();
    contas.push(conta);
    saveContas(contas);

    renderListaContas();

    el("contaNome").value = "";
    el("contaTipo").value = "";
    el("contaSaldo").value = "";

    alert("Conta cadastrada com sucesso!");
  };
}

/***********************
 * INSIGHT CAMBIAL
 ***********************/
function renderExchangeInsight(exchange) {
  const box = document.getElementById("exchangeInsight");
  if (!box) return;

  if (exchange.USD_BRL > 4.8) {
    box.innerText =
      "📈 Dólar elevado: exportadoras e investimentos internacionais tendem a se beneficiar.";
  } else {
    box.innerText =
      "📉 Dólar em queda: pode favorecer consumo e ativos domésticos.";
  }
}

/***********************
 * EXPORTAÇÃO DE RELATÓRIOS
 ***********************/
function exportCSV() {
  const rows = [
    ["Tipo", "Data", "Categoria", "Descrição", "Valor"],
  ];

  receitas.forEach(r => {
    rows.push([
      "Receita",
      r.data,
      r.categoria,
      r.descricao || "",
      r.valor
    ]);
  });

  despesas.forEach(d => {
    rows.push([
      "Despesa",
      d.data,
      d.categoria,
      d.descricao || "",
      -Math.abs(d.valor)
    ]);
  });

  const csvContent = rows.map(r => r.join(";")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "organisa-relatorio.csv";
  link.click();
}

function exportPDF() {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>Relatório Financeiro</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border: 1px solid #ccc; padding: 6px; }
        </style>
      </head>
      <body>
        <h1>Relatório Financeiro - ORGANI$A</h1>

        <h2>Receitas</h2>
        <table>
          <tr><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr>
          ${receitas.map(r => `
            <tr>
              <td>${r.data}</td>
              <td>${r.categoria}</td>
              <td>${r.descricao || ""}</td>
              <td>${moneyBR(r.valor)}</td>
            </tr>
          `).join("")}
        </table>

        <h2>Despesas</h2>
        <table>
          <tr><th>Data</th><th>Categoria</th><th>Descrição</th><th>Valor</th></tr>
          ${despesas.map(d => `
            <tr>
              <td>${d.data}</td>
              <td>${d.categoria}</td>
              <td>${d.descricao || ""}</td>
              <td>${moneyBR(d.valor)}</td>
            </tr>
          `).join("")}
        </table>

        <script>window.print()</script>
      </body>
    </html>
  `);
}

/***********************
 * STATE
 ***********************/
let receitas = [];
let despesas = [];

let pieChart = null;
let barChart = null;
let lineChart = null;
let sparkChart = null;
let miniDonutChart = null;
let stockChart = null;


// novos gráficos extras
let catChart = null;   // barDespesasPorCategoria
let evolChart = null;  // lineReceitasDespesas


/***********************
 * FILTRO
 ***********************/
function getFilters() {
  const start = parseDate(startDate?.value);
  const end = parseDate(endDate?.value);
  const term = (searchInput?.value || "").trim().toLowerCase();

  return { start, end, term };
}

function matchesFilters(item, filters) {
  const dateVal = parseDate(item.data || item.created_at || item.createdAt || item.dt || item.date);
  // se item não tiver data, deixa passar
  if (filters.start && dateVal && dateVal < filters.start) return false;
  if (filters.end && dateVal && dateVal > filters.end) return false;

  if (filters.term) {
    const hay = [
      item.categoria,
      item.descricao,
      item.tipo
    ].filter(Boolean).join(" ").toLowerCase();
    if (!hay.includes(filters.term)) return false;
  }

  return true;
}

/***********************
 * TABELA (render)
 ***********************/
function normalizeItem(item, tipo) {
  return {
    ...item,
    tipo,
    valor: Number(item.valor || 0),
    data: item.data || item.created_at || item.createdAt || item.dt || item.date || "",
    categoria: item.categoria || item.tipo || "—",
    descricao: item.descricao || item.nome || "—",
    id: item.id
  };
}

function renderTable() {
  if (!transactionsTable) return;

  const filters = getFilters();

  const all = [
    ...receitas.map(r => normalizeItem(r, "receita")),
    ...despesas.map(d => normalizeItem(d, "despesa")),
  ];

  const filtered = all
    .filter(it => matchesFilters(it, filters))
    .sort((a, b) => {
      const da = parseDate(a.data);
      const db = parseDate(b.data);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db - da;
    });

  if (filtered.length === 0) {
    transactionsTable.innerHTML = `
      <tr>
        <td class="py-3 muted" colspan="6">${t("empty")}</td>
      </tr>
    `;
    return;
  }

  transactionsTable.innerHTML = filtered.map(item => {
    const isDespesa = item.tipo === "despesa";
    const badge = isDespesa
      ? `<span class="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">${t("typeExpense")}</span>`
      : `<span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">${t("typeIncome")}</span>`;

    const val = isDespesa
      ? `<span class="text-red-400 font-semibold">-${moneyBR(item.valor).replace("R$ ", "R$ ")}</span>`
      : `<span class="text-green-400 font-semibold">+${moneyBR(item.valor).replace("R$ ", "R$ ")}</span>`;

    const d = item.data ? item.data : "—";

    return `
      <tr>
        <td class="py-3">${d}</td>
        <td class="py-3">${badge}</td>
        <td class="py-3">${val}</td>
        <td class="py-3 muted">${item.categoria || "—"}</td>
        <td class="py-3 muted">${item.descricao || "—"}</td>
        <td class="py-3">
          <div class="flex gap-2">
            <button class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs" data-action="edit" data-tipo="${item.tipo}" data-id="${item.id}">
              ✏️ ${t("edit")}
            </button>
            <button class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs" data-action="del" data-tipo="${item.tipo}" data-id="${item.id}">
              🗑️ ${t("del")}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // listeners (delegação)
  transactionsTable.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const action = btn.dataset.action;
      const tipo = btn.dataset.tipo;
      const id = Number(btn.dataset.id);

      if (action === "edit") {
        const item = (tipo === "receita" ? receitas : despesas).find(x => Number(x.id) === id);
        if (item) openModal(tipo, item);
      }

      if (action === "del") {
        if (!confirm(t("confirmDel"))) return;
        try {
          if (tipo === "receita") await api.deleteReceita(id);
          else await api.deleteDespesa(id);
          await loadAll();
          renderAll();
        } catch (e) {
          console.error(e);
          alert(e.message || "Erro ao excluir");
        }
      }
    });
  });
}

/***********************
 * MÉTRICAS
 ***********************/
function renderMetrics() {
  const filters = getFilters();

  const recFilt = receitas
    .map(r => normalizeItem(r, "receita"))
    .filter(it => matchesFilters(it, filters));

  const despFilt = despesas
    .map(d => normalizeItem(d, "despesa"))
    .filter(it => matchesFilters(it, filters));

  const totalReceitas = recFilt.reduce((s, r) => s + Number(r.valor), 0);
  const totalDespesas = despFilt.reduce((s, d) => s + Number(d.valor), 0);
  const saldo = totalReceitas - totalDespesas;

  if (m1Value) m1Value.textContent = moneyBR(totalReceitas);
  if (m2Value) m2Value.textContent = moneyBR(totalDespesas);
  if (m3Value) m3Value.textContent = `Saldo: ${moneyBR(saldo)}`;

  if (sumReceitas) sumReceitas.textContent = moneyBR(totalReceitas);
  if (sumDespesas) sumDespesas.textContent = moneyBR(totalDespesas);
  if (sumSaldo) sumSaldo.textContent = moneyBR(saldo);
}

/***********************
 * GRÁFICOS
 ***********************/

if (window.Chart && window.ChartDataLabels) {
  Chart.register(ChartDataLabels);
}

/* ============================
 * BOLSA / MERCADO (DADOS REAIS)
 * ============================ */
async function renderStockChart() {
  const canvas = document.getElementById("stockChart");
  if (!canvas) return;

  try {
    const res = await fetch(`${API_BASE}/market/stocks`);
    if (!res.ok) throw new Error("Erro ao buscar mercado");

    const market = await res.json();
    if (!market) return;

    // ====== CONFIG ======
    const colors = {
      "AAPL": "#6366f1",
      "PETR4.SA": "#22c55e",
      "VALE3.SA": "#10b981",
      "ITUB4.SA": "#f59e0b",
      "TSLA": "#ef4444"
    };

    // Usa AAPL como referência de datas
    const baseSymbol = Object.keys(market)[0];
    const labels = market[baseSymbol].map(p => p.date.slice(5));

    const datasets = Object.entries(market).map(([symbol, values]) => ({
      label: symbol.replace(".SA", ""),
      data: values.map(v => v.close),
      borderColor: colors[symbol] || "#999",
      tension: 0.3,
      fill: false
    }));

    if (stockChart) stockChart.destroy();

    const css = getComputedStyle(document.body);
    const text = css.getPropertyValue("--text") || "#e6eef8";
    const muted = css.getPropertyValue("--muted") || "#aaa";

    stockChart = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: text }
          },
          title: {
            display: true,
            text: "Mercado Financeiro — Dados Reais"
          }
        },
        scales: {
          x: {
            ticks: { color: muted }
          },
          y: {
            ticks: {
              color: muted,
              callback: v => "$" + v
            }
          }
        }
      }
    });
  } catch (e) {
    console.error("Erro mercado:", e);
  }
}
/* ============================
 * CÂMBIO (USD / EUR)
 * ============================ */
let exchangeChart = null;

function renderExchangeChart(data) {
  const canvas = document.getElementById("exchangeChart");
  if (!canvas) return;

  if (exchangeChart) exchangeChart.destroy();

  const labels = data.USD.map(d => d.date.slice(5));
  const usdValues = data.USD.map(d => d.value);
  const eurValues = data.EUR.map(d => d.value);

  const css = getComputedStyle(document.body);
  const text = css.getPropertyValue("--text") || "#e6eef8";
  const muted = css.getPropertyValue("--muted") || "#aaa";

  exchangeChart = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "USD / BRL",
          data: usdValues,
          borderColor: "#22c55e",
          tension: 0.3
        },
        {
          label: "EUR / BRL",
          data: eurValues,
          borderColor: "#3b82f6",
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: text } }
      },
      scales: {
        x: { ticks: { color: muted } },
        y: {
          ticks: {
            color: muted,
            callback: v => "R$ " + v.toFixed(2)
          }
        }
      }
    }
  });
}


// ============================
// CÂMBIO (USD / EUR)
// ============================
async function loadExchange() {
  try {
    const res = await fetch(`${API_BASE}/market/exchange/week`);
    if (!res.ok) throw new Error("Erro câmbio semanal");

    const data = await res.json();

    const lastUSD = data.USD.at(-1);
    const lastEUR = data.EUR.at(-1);

    el("usdValue").innerText = `USD/BRL: R$ ${lastUSD.value.toFixed(2)}`;
    el("eurValue").innerText = `EUR/BRL: R$ ${lastEUR.value.toFixed(2)}`;
    el("exchangeDate").innerText = `Atualizado em ${lastUSD.date}`;

    renderExchangeInsight({
      USD_BRL: lastUSD.value
    });
renderInvestmentSuggestions({
  profile: "moderado", // depois pode vir do usuário
  USD_BRL: lastUSD.value,
  EUR_BRL: lastEUR.value
});

    renderExchangeChart(data);

  } catch (e) {
    console.error("Erro câmbio:", e);
  }
}
function renderInvestmentSuggestions({ profile, USD_BRL, EUR_BRL }) {
  const box = document.getElementById("investmentSuggestions");
  if (!box) return;

  let currencyInsight = "";
  let assetInsight = "";
  let actionInsight = "";

  // ============================
  // 💱 CÂMBIO
  // ============================
  if (USD_BRL > 4.8) {
    currencyInsight = `
      <strong>Dólar:</strong> está valorizado frente ao real.
      Isso favorece:
      <ul class="list-disc pl-5 mt-1">
        <li>Empresas exportadoras (VALE, PETROBRAS)</li>
        <li>Investimentos internacionais</li>
      </ul>
      <p class="mt-1 text-yellow-300">
        ⚠️ Entrar agora exige cautela, pois o dólar já está caro.
      </p>
    `;
  } else {
    currencyInsight = `
      <strong>Dólar:</strong> está relativamente mais baixo.
      <p class="mt-1">
        💡 Pode ser um bom momento para diversificação internacional.
      </p>
    `;
  }

  if (EUR_BRL > USD_BRL) {
    currencyInsight += `
      <p class="mt-2">
        <strong>Euro:</strong> mais caro que o dólar.
        Indicado principalmente para quem tem gastos ou planos na Europa.
      </p>
    `;
  }

  // ============================
  // 📊 ATIVOS POR PERFIL
  // ============================
  if (profile === "conservador") {
    assetInsight = `
      <strong>Renda Fixa:</strong>
      <ul class="list-disc pl-5 mt-1">
        <li><strong>Tesouro Selic:</strong> acompanha a taxa básica de juros, baixo risco.</li>
        <li><strong>CDB ≥ 120% CDI:</strong> melhor rendimento que poupança, risco controlado.</li>
      </ul>
    `;

    actionInsight = `
      Priorize segurança e liquidez.
      Evite exposição cambial excessiva neste momento.
    `;
  }

  if (profile === "moderado") {
    assetInsight = `
      <strong>Renda Variável com controle:</strong>
      <ul class="list-disc pl-5 mt-1">
        <li>
          <strong>Fundos Multimercado:</strong>
          investem em juros, moedas e ações ao mesmo tempo,
          diluindo riscos.
        </li>
        <li>
          <strong>Ações brasileiras:</strong>
          VALE3 e PETR4 se beneficiam do dólar alto.
        </li>
      </ul>
    `;

    actionInsight = `
      Estratégia equilibrada:
      parte em renda fixa + parte em ações e fundos.
      Boa fase para exportadoras.
    `;
  }

  if (profile === "arrojado") {
    assetInsight = `
      <strong>Maior risco, maior potencial:</strong>
      <ul class="list-disc pl-5 mt-1">
        <li>
          <strong>Ações internacionais:</strong>
          AAPL, TSLA → exposição ao dólar.
        </li>
        <li>
          <strong>ETFs:</strong>
          IVVB11 (S&P 500), BOVA11 (Brasil).
        </li>
      </ul>
    `;

    actionInsight = `
      Volatilidade elevada.
      Ideal para quem aceita oscilações no curto prazo.
    `;
  }

  // ============================
  // 🧱 RENDER FINAL
  // ============================
  box.innerHTML = `
    <div class="space-y-4 text-sm">

      <div>
        <p class="font-semibold text-indigo-400">
          Perfil: ${profile.toUpperCase()}
        </p>
      </div>

      <div class="p-3 rounded-md bg-white/5">
        <p class="font-semibold mb-1">📌 Cenário Cambial</p>
        ${currencyInsight}
      </div>

      <div class="p-3 rounded-md bg-white/5">
        <p class="font-semibold mb-1">📊 Onde investir</p>
        ${assetInsight}
      </div>

      <div class="p-3 rounded-md bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20">
        <p class="font-semibold mb-1">🎯 Estratégia sugerida</p>
        <p>${actionInsight}</p>
      </div>

    </div>
  `;
}

/* ============================
 * GRÁFICOS FINANCEIROS
 * ============================ */
function renderCharts() {
  const filters = getFilters();

  const css = getComputedStyle(document.body);
  const text = (css.getPropertyValue("--text") || "#e6eef8").trim();
  const muted = (css.getPropertyValue("--muted") || "#aaa").trim();

  const green = "#22c55e";
  const red = "#ef4444";
  const blue = "#3b82f6";

  const recFilt = receitas
    .map(r => normalizeItem(r, "receita"))
    .filter(it => matchesFilters(it, filters));

  const despFilt = despesas
    .map(d => normalizeItem(d, "despesa"))
    .filter(it => matchesFilters(it, filters));

  // Destroi gráficos antigos
  pieChart?.destroy();
  barChart?.destroy();
  lineChart?.destroy();
  catChart?.destroy();
  evolChart?.destroy();
  sparkChart?.destroy();
  miniDonutChart?.destroy();

  // ============================
// ============================
// MINI GRÁFICO MENSAL (Receitas)
// + Melhor mês
// ============================
const sparkCanvas = el("spark1");

if (sparkChart) sparkChart.destroy();

if (sparkCanvas && recFilt.length > 0) {

  // ============================
  // AGRUPA RECEITAS POR MÊS
  // ============================
  const receitasPorMes = {};

  recFilt.forEach(r => {
    const d = parseDate(r.data);
    if (!d) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    receitasPorMes[key] = (receitasPorMes[key] || 0) + Number(r.valor);
  });

  // ordena meses
  const meses = Object.keys(receitasPorMes).sort();

  const valores = meses.map(m => receitasPorMes[m]);

  // labels amigáveis (Jan/2025)
  const labels = meses.map(m => {
    const [y, mm] = m.split("-");
    const nomes = [
      "Jan","Fev","Mar","Abr","Mai","Jun",
      "Jul","Ago","Set","Out","Nov","Dez"
    ];
    return `${nomes[Number(mm) - 1]}/${y}`;
  });

  // ============================
  // MELHOR MÊS
  // ============================
  let melhorValor = 0;
  let melhorMes = "—";

  valores.forEach((v, i) => {
    if (v > melhorValor) {
      melhorValor = v;
      melhorMes = labels[i];
    }
  });

  // atualiza texto no card
  const melhorMesEl = document.getElementById("bestMonth");
  if (melhorMesEl) {
    melhorMesEl.textContent =
      melhorValor > 0
        ? `${melhorMes} • ${moneyBR(melhorValor)}`
        : "—";
  }

  // ============================
  // GRÁFICO
  // ============================
  sparkChart = new Chart(sparkCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Receitas Mensais",
        data: valores,
        borderColor: "#22c55e",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Receitas: ${moneyBR(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: "rgba(255,255,255,0.06)"
          },
          ticks: {
            color: "#9ca3af",
            font: { size: 10 }
          }
        },
        y: {
          grid: {
            display: true,
            color: "rgba(255,255,255,0.06)"
          },
          ticks: {
            color: "#9ca3af",
            font: { size: 10 },
            callback: v => `R$ ${v}`
          }
        }
      }
    }
  });
}

// ============================
// MINI DONUT (Resumo Rápido)
// ============================
const miniCanvas = el("miniDonut");

if (miniDonutChart) miniDonutChart.destroy();

if (miniCanvas) {
  const totalR = recFilt.reduce((s, r) => s + r.valor, 0);
  const totalD = despFilt.reduce((s, d) => s + d.valor, 0);
  const total = totalR + totalD;

  miniDonutChart = new Chart(miniCanvas, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [totalR, totalD],
        backgroundColor: [green, red],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${moneyBR(ctx.parsed)}`
          }
        },
        datalabels: {
          color: text,
          font: { weight: "800", size: 13 },
          formatter: (value) => {
            if (!total) return "";
            return Math.round((value / total) * 100) + "%";
          }
        }
      }
    }
  });
}


  // ============================
// PIE (Despesas por Categoria)
// ============================
const categorias = {};

despFilt.forEach(d => {
  const cat = d.categoria || "Outros";
  categorias[cat] = (categorias[cat] || 0) + Number(d.valor);
});

if (pieCanvas && Object.keys(categorias).length > 0) {
  pieChart = new Chart(pieCanvas, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: Object.keys(categorias).map((_, i) => {
          const palette = [
            red,
            blue,
            green,
            "#f59e0b",
            "#6366f1",
            "#14b8a6",
            "#a855f7"
          ];
          return palette[i % palette.length];
        }),
        borderColor: "transparent"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: text
          }
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${moneyBR(ctx.parsed)}`
          }
        },
        datalabels: {
          color: "#fff",
          font: {
            weight: "700",
            size: 11
          },
          formatter: value => moneyBR(value)
        }
      }
    }
  });
}


  // ============================
  // BAR EXTRA (Despesas por Categoria)
  // ============================
  const categoriasDespesas = {};
  despFilt.forEach(d => {
    const cat = d.categoria || "Outros";
    categoriasDespesas[cat] = (categoriasDespesas[cat] || 0) + Number(d.valor);
  });

  const catLabels = Object.keys(categoriasDespesas);
  const catValues = Object.values(categoriasDespesas);

  const catCanvas = el("barDespesasPorCategoria");
  if (catCanvas) {
    catChart = new Chart(catCanvas, {
      type: "bar",
      data: {
        labels: catLabels,
        datasets: [{
          label: "Despesas por Categoria",
          data: catValues,
          backgroundColor: red
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text } } },
        scales: {
          x: { ticks: { color: muted } },
          y: { ticks: { color: muted } }
        }
      }
    });
  }

  // ============================
  // LINE EXTRA (Receitas vs Despesas por mês)
  // ============================
  const receitasPorMes = {};
  const despesasPorMes = {};

  const monthKey = (dt) => {
    const d = parseDate(dt);
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  };

  recFilt.forEach(r => {
    const k = monthKey(r.data);
    if (!k) return;
    receitasPorMes[k] = (receitasPorMes[k] || 0) + Number(r.valor);
  });
  despFilt.forEach(d => {
    const k = monthKey(d.data);
    if (!k) return;
    despesasPorMes[k] = (despesasPorMes[k] || 0) + Number(d.valor);
  });

  const meses = Object.keys({ ...receitasPorMes, ...despesasPorMes }).sort();
  const receitasData = meses.map(m => receitasPorMes[m] || 0);
  const despesasData = meses.map(m => despesasPorMes[m] || 0);

  const evolCanvas = el("lineReceitasDespesas");
  if (evolCanvas) {
    evolChart = new Chart(evolCanvas, {
      type: "line",
      data: {
        labels: meses.map(k => {
          const [y, m] = k.split("-");
          const map = {
            "01":"Jan","02":"Fev","03":"Mar","04":"Abr","05":"Mai","06":"Jun",
            "07":"Jul","08":"Ago","09":"Set","10":"Out","11":"Nov","12":"Dez"
          };
          return `${map[m] || m}/${y}`;
        }),
        datasets: [
          { label: "Receitas", data: receitasData, borderColor: green, tension: 0.3 },
          { label: "Despesas", data: despesasData, borderColor: red, tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text } } },
        scales: {
          x: { ticks: { color: muted } },
          y: { ticks: { color: muted } }
        }
      }
    });
  }

  // ============================
  // BAR (Receitas x Despesas total)
  // ============================
  if (barCanvas) {
    const totalR = recFilt.reduce((s, r) => s + Number(r.valor), 0);
    const totalD = despFilt.reduce((s, d) => s + Number(d.valor), 0);

    barChart = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: [t("typeIncome"), t("typeExpense")],
        datasets: [{
          label: "Valores",
          data: [totalR, totalD],
          backgroundColor: [green, red]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text } } },
        scales: {
          x: { ticks: { color: muted } },
          y: { ticks: { color: muted } }
        }
      }
    });
  }

  // ============================
  // LINE (Saldo acumulado por mês)
  // ============================
  const months = {};
  recFilt.forEach(r => {
    const k = monthKey(r.data);
    if (!k) return;
    months[k] = months[k] || { receitas: 0, despesas: 0 };
    months[k].receitas += Number(r.valor);
  });
  despFilt.forEach(d => {
    const k = monthKey(d.data);
    if (!k) return;
    months[k] = months[k] || { receitas: 0, despesas: 0 };
    months[k].despesas += Number(d.valor);
  });

  const keys = Object.keys(months).sort();
  const labels = keys.map(k => {
    const [y, m] = k.split("-");
    const map = {
      "01":"Jan","02":"Fev","03":"Mar","04":"Abr","05":"Mai","06":"Jun",
      "07":"Jul","08":"Ago","09":"Set","10":"Out","11":"Nov","12":"Dez"
    };
    return `${map[m] || m}/${y}`;
  });

  let acumulado = 0;
  const saldoData = keys.map(k => {
    const r = months[k].receitas || 0;
    const d = months[k].despesas || 0;
    acumulado += (r - d);
    return acumulado;
  });

  if (lineCanvas) {
    lineChart = new Chart(lineCanvas, {
      type: "line",
      data: {
        labels: labels.length ? labels : ["—"],
        datasets: [{
          label: "Saldo acumulado",
          data: saldoData.length ? saldoData : [0],
          tension: 0.25,
          borderColor: blue,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text } } },
        scales: {
          x: { ticks: { color: muted } },
          y: { ticks: { color: muted } }
        }
      }
    });
  }
}

/***********************
 * MODAL (Add/Edit)
 ***********************/
function ensureModalRoot() {
  let root = document.getElementById("modalRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "modalRoot";
    document.body.appendChild(root);
  }
  return root;
}

function openModal(tipo, existing = null) {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const isReceita = tipo === "receita";
  const title = isReceita ? t("modalTitleIncome") : t("modalTitleExpense");

  const defaultData = existing ? {
    data: toISODateInput(existing.data),
    valor: existing.valor ?? "",
    categoria: existing.categoria ?? "",
    descricao: existing.descricao ?? "",
  } : {
    data: toISODateInput(new Date()),
    valor: "",
    categoria: "",
    descricao: "",
  };

  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 modal-overlay";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-5 w-full max-w-md animate-popup">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">${existing ? `${t("edit")} ${title}` : `${title}`}</h3>
        <button id="modalClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="text-sm muted">${t("fieldDate")}</label>
          <input id="mData" type="date" class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light" value="${defaultData.data}">
        </div>
        <div>
          <label class="text-sm muted">${t("fieldValue")}</label>
          <input id="mValor" type="number" step="0.01" class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light" value="${defaultData.valor}">
        </div>
        <div>
          <label class="text-sm muted">${t("fieldCategory")}</label>
          <input id="mCategoria" type="text" class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light" value="${defaultData.categoria}">
        </div>
        <div>
          <label class="text-sm muted">${t("fieldDesc")}</label>
          <input id="mDescricao" type="text" class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light" value="${defaultData.descricao}">
        </div>
      </div>

      <div class="flex gap-2 mt-5">
        <button id="modalCancel" class="flex-1 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">${t("cancel")}</button>
        <button id="modalSave" class="flex-1 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold">${t("save")}</button>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  const close = () => (root.innerHTML = "");

  overlay.querySelector("#modalClose")?.addEventListener("click", close);
  overlay.querySelector("#modalCancel")?.addEventListener("click", close);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("#modalSave")?.addEventListener("click", async () => {
    const payload = {
      data: overlay.querySelector("#mData")?.value || null,
      valor: Number(overlay.querySelector("#mValor")?.value || 0),
      categoria: overlay.querySelector("#mCategoria")?.value || "",
      descricao: overlay.querySelector("#mDescricao")?.value || "",
    };

    try {
      if (existing && existing.id) {
        // UPDATE
        if (isReceita) await api.updateReceita(existing.id, payload);
        else await api.updateDespesa(existing.id, payload);
      } else {
        // CREATE
        if (isReceita) await api.criarReceita(payload);
        else await api.criarDespesa(payload);
      }

      close();
      await loadAll();
      renderAll();
    } catch (e) {
      console.error(e);
      alert(e.message || "Erro ao salvar");
    }
  });
}

/***********************
 * BOTÕES (Add)
 ***********************/
addIncomeBtn?.addEventListener("click", () => openModal("receita"));
addExpenseBtn?.addEventListener("click", () => openModal("despesa"));

/***********************
 * LOAD DATA
 ***********************/
async function loadAll() {
  try {
    // carrega do backend
    const [r, d] = await Promise.all([api.getReceitas(), api.getDespesas()]);
    receitas = Array.isArray(r) ? r : [];
    despesas = Array.isArray(d) ? d : [];
  } catch (e) {
    console.error("Erro ao carregar API:", e);
    // mantém arrays antigos, mas avisa
  }
}

/***********************
 * RENDER ALL
 ***********************/
function renderAll() {
  applyLanguage();
  renderMetrics();
  renderTable();
  renderCharts();

  // 🌍 Mercado e câmbio
  renderStockChart();
  loadExchange();
}


/***********************
 * FILTROS (eventos)
 ***********************/
applyFilterBtn?.addEventListener("click", () => renderAll());
searchInput?.addEventListener("input", () => renderAll());
startDate?.addEventListener("change", () => renderAll());
endDate?.addEventListener("change", () => renderAll());

/***********************
 * INIT
 ***********************/
document.addEventListener("DOMContentLoaded", async () => {
  await loadAll();
  renderAll();
  renderStockChart(); // 👈 CHAMADA CORRETA
});

// ============================
// MODAL DE CONFIGURAÇÕES
// ============================
function openSettingsModal() {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-lg animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">⚙️ Configurações</h3>
        <button id="settingsClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>

      <div class="space-y-4">

        <!-- Nome -->
        <div>
          <label class="text-sm muted">Nome do usuário</label>
          <input
            id="settingsName"
            type="text"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light"
            value="${user?.nome || ""}"
          />
        </div>

        <!-- Tema -->
        <div>
          <label class="text-sm muted">Tema</label>
          <select
            id="settingsTheme"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm"
          >
            <option value="dark">🌙 Escuro</option>
            <option value="light">☀️ Claro</option>
          </select>
        </div>

        <!-- Idioma -->
        <div>
          <label class="text-sm muted">Idioma</label>
          <select
            id="settingsLang"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm"
          >
            <option value="pt">🇧🇷 Português</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button
          id="settingsCancel"
          class="flex-1 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
        >
          Cancelar
        </button>

        <button
          id="settingsSave"
          class="flex-1 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          Salvar
        </button>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  // valores atuais
  overlay.querySelector("#settingsTheme").value = user?.tema || "dark";
  overlay.querySelector("#settingsLang").value = user?.idioma || "pt";

  const close = () => (root.innerHTML = "");

  overlay.querySelector("#settingsClose").onclick = close;
  overlay.querySelector("#settingsCancel").onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  // SALVAR
  overlay.querySelector("#settingsSave").onclick = () => {
    const nome = overlay.querySelector("#settingsName").value.trim();
    const tema = overlay.querySelector("#settingsTheme").value;
    const idioma = overlay.querySelector("#settingsLang").value;

    if (nome) user.nome = nome;
    user.tema = tema;
    user.idioma = idioma;

    localStorage.setItem("usuario", JSON.stringify(user));
    localStorage.setItem("theme", tema);
    localStorage.setItem("lang", idioma);

    applyTheme(tema);
    applyLanguage();

    if (displayName) displayName.textContent = user.nome;
    if (greeting) greeting.textContent = `Olá, ${user.nome}`;

    renderAll();
    close();
  };
}

// ============================
// BOTÃO CONFIGURAÇÕES
// ============================
document
  .querySelector('a[href="#settings"]')
  ?.addEventListener("click", e => {
    e.preventDefault();
    openSettingsModal();
  });

  // ============================
// MODAL DE RELATÓRIOS
// ============================
function openReportsModal() {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-md animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">📊 Relatórios</h3>
        <button id="reportsClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>

      <p class="text-sm muted mb-4">
        Os relatórios respeitam os filtros aplicados (datas e busca).
      </p>

      <div class="space-y-3">
        <button
          id="exportCSV"
          class="w-full px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          ⬇️ Exportar CSV
        </button>

        <button
          id="exportPDF"
          class="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          ⬇️ Exportar PDF
        </button>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  const close = () => (root.innerHTML = "");

  overlay.querySelector("#reportsClose").onclick = close;
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("#exportCSV").onclick = exportCSV;
  overlay.querySelector("#exportPDF").onclick = exportPDF;
}
// ============================
// BOTÃO RELATÓRIOS
// ============================
document
  .querySelector('a[href="#reports"]')
  ?.addEventListener("click", e => {
    e.preventDefault();
    openReportsModal();
  });
// ============================
// MODAL DE RECENTES (Receitas / Despesas)
// ============================
function openRecentModal(tipo) {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const isReceita = tipo === "receita";
  const titulo = isReceita ? "💰 Receitas Recentes" : "🔁 Despesas Recentes";
  const dados = isReceita ? receitas : despesas;

  const ultimos = [...dados]
    .slice(-10)
    .reverse();

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-2xl animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">${titulo}</h3>
        <button id="recentClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>

      <div class="overflow-auto max-h-[60vh]">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10">
              <th class="py-2 text-left">Data</th>
              <th class="py-2 text-left">Categoria</th>
              <th class="py-2 text-left">Descrição</th>
              <th class="py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${
              ultimos.length === 0
                ? `<tr><td colspan="4" class="py-4 muted text-center">Sem registros</td></tr>`
                : ultimos.map(i => `
                  <tr class="border-b border-white/5">
                    <td class="py-2">${i.data}</td>
                    <td class="py-2">${i.categoria}</td>
                    <td class="py-2">${i.descricao || "—"}</td>
                    <td class="py-2 text-right ${
                      isReceita ? "text-green-400" : "text-red-400"
                    }">
                      ${moneyBR(i.valor)}
                    </td>
                  </tr>
                `).join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  const close = () => (root.innerHTML = "");
  overlay.querySelector("#recentClose").onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });
}

// ============================
// MODAL DE LANÇAMENTOS (TODOS)
// ============================
function openLancamentosModal() {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const todos = [
    ...receitas.map(r => normalizeItem(r, "receita")),
    ...despesas.map(d => normalizeItem(d, "despesa"))
  ].sort((a, b) => {
    const da = parseDate(a.data);
    const db = parseDate(b.data);
    if (!da || !db) return 0;
    return db - da;
  });

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-4xl animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">📊 Lançamentos</h3>
        <button id="lancClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>

      <div class="overflow-auto max-h-[65vh]">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10">
              <th class="py-2 text-left">Data</th>
              <th class="py-2 text-left">Tipo</th>
              <th class="py-2 text-left">Categoria</th>
              <th class="py-2 text-left">Descrição</th>
              <th class="py-2 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${
              todos.length === 0
                ? `<tr><td colspan="5" class="py-4 muted text-center">Sem registros</td></tr>`
                : todos.map(i => `
                  <tr class="border-b border-white/5">
                    <td class="py-2">${i.data}</td>
                    <td class="py-2">
                      <span class="px-2 py-1 rounded-full text-xs ${
                        i.tipo === "receita"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }">
                        ${i.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td class="py-2">${i.categoria}</td>
                    <td class="py-2">${i.descricao || "—"}</td>
                    <td class="py-2 text-right font-semibold ${
                      i.tipo === "receita" ? "text-green-400" : "text-red-400"
                    }">
                      ${i.tipo === "receita" ? "+" : "-"}${moneyBR(i.valor)}
                    </td>
                  </tr>
                `).join("")
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

  root.appendChild(overlay);

  const close = () => (root.innerHTML = "");
  overlay.querySelector("#lancClose").onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });
}

// ============================
// MODAL DE CARTÕES DE CRÉDITO
// ============================
function openCartoesModal() {
  const root = ensureModalRoot();
  root.innerHTML = "";

  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50";

  overlay.innerHTML = `
    <div class="panel rounded-lg p-6 w-full max-w-lg animate-popup">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">💳 Cartões de Crédito</h3>
        <button id="cartaoClose" class="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20">✖</button>
      </div>
<!-- 🔽 LISTA DE CARTÕES CADASTRADOS -->
<div id="listaCartoes" class="mb-6 space-y-2"></div>

      <div class="space-y-4">
        <div>
          <label class="text-sm muted">Nome do cartão</label>
          <input id="cNome" type="text"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light">
        </div>

        <div>
          <label class="text-sm muted">Banco</label>
          <input id="cBanco" type="text"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light">
        </div>

        <div>
          <label class="text-sm muted">Bandeira</label>
          <select id="cBandeira"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm">
            <option value="">Selecione</option>
            <option>Visa</option>
            <option>Mastercard</option>
            <option>Elo</option>
            <option>American Express</option>
            <option>Hipercard</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-sm muted">Limite (R$)</label>
            <input id="cLimite" type="number" step="0.01"
              class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light">
          </div>

          <div>
            <label class="text-sm muted">Fechamento</label>
            <input id="cFechamento" type="number" min="1" max="31"
              class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm">
          </div>
        </div>

        <div>
          <label class="text-sm muted">Vencimento</label>
          <input id="cVencimento" type="number" min="1" max="31"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm">
        </div>

        <div>
          <label class="text-sm muted">Observações</label>
          <textarea id="cObs" rows="2"
            class="w-full mt-1 rounded-md bg-transparent border border-white/10 px-3 py-2 text-sm text-on-light"></textarea>
        </div>
      </div>

      <div class="flex gap-2 mt-6">
        <button id="cartaoCancel"
          class="flex-1 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20">
          Cancelar
        </button>

        <button id="cartaoSave"
          class="flex-1 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
          Salvar Cartão
        </button>
      </div>
    </div>
  `;

  root.appendChild(overlay);
  renderListaCartoes();

  const close = () => (root.innerHTML = "");

  overlay.querySelector("#cartaoClose").onclick = close;
  overlay.querySelector("#cartaoCancel").onclick = close;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  overlay.querySelector("#cartaoSave").onclick = () => {
  const cartao = {
    nome: el("cNome").value.trim(),
    banco: el("cBanco").value.trim(),
    bandeira: el("cBandeira").value,
    limite: Number(el("cLimite").value || 0),
    fechamento: el("cFechamento").value,
    vencimento: el("cVencimento").value,
    obs: el("cObs").value.trim()
  };

  if (!cartao.nome || !cartao.banco) {
    alert("Informe ao menos nome e banco do cartão.");
    return;
  }

  const cartoes = getCartoes();
  cartoes.push(cartao);
  saveCartoes(cartoes);

  renderListaCartoes();

  alert("Cartão cadastrado com sucesso!");

  // opcional: limpar formulário
  el("cNome").value = "";
  el("cBanco").value = "";
  el("cBandeira").value = "";
  el("cLimite").value = "";
  el("cFechamento").value = "";
  el("cVencimento").value = "";
  el("cObs").value = "";
};
}
// ============================
// BOTÕES DO SIDEBAR - RECENTES
// ============================
document
  .getElementById("btnDespesasRecentes")
  ?.addEventListener("click", () => {
    openRecentModal("despesa");
  });

document
  .getElementById("btnReceitasRecentes")
  ?.addEventListener("click", () => {
    openRecentModal("receita");
  });
  document
  .querySelector('a[href="#cards"]')
  ?.addEventListener("click", e => {
    e.preventDefault();
    openCartoesModal();
  });
  // ============================
// MODAL: TROCAR SENHA
// ============================
function openChangePasswordModal() {
  const root = ensureModalRoot();
  root.innerHTML = `
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="panel rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">🔐 Trocar Senha</h3>

        <input id="senhaAtual" type="password" placeholder="Senha atual"
          class="w-full mb-3 px-3 py-2 rounded-md bg-white/5">

        <input id="novaSenha" type="password" placeholder="Nova senha"
          class="w-full mb-4 px-3 py-2 rounded-md bg-white/5">

        <div class="flex gap-2">
          <button id="cancelSenha"
            class="flex-1 px-4 py-2 rounded-md bg-white/10">
            Cancelar
          </button>

          <button id="saveSenha"
            class="flex-1 px-4 py-2 rounded-md bg-indigo-600 text-white">
            Salvar
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("cancelSenha").onclick = () => root.innerHTML = "";

  document.getElementById("saveSenha").onclick = async () => {
    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const token = localStorage.getItem("token");

    const res = await fetch("https://organiza-backend-ikdh.onrender.com/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ senhaAtual, novaSenha })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erro ao trocar senha");
      return;
    }

    alert("Senha alterada com sucesso!");
    root.innerHTML = "";
  };
}

  // ============================
// BOTÃO SIDEBAR - LANÇAMENTOS
// ============================
document
  .getElementById("btnLancamentos")
  ?.addEventListener("click", e => {
    e.preventDefault();
    openLancamentosModal();
  });
// ============================
// BOTÃO SIDEBAR - MINHAS CONTAS
// ============================
document
  .querySelector('a[href="#accounts"]')
  ?.addEventListener("click", e => {
    e.preventDefault();
    openContasModal();
  });
// ============================
// BOTÃO SIDEBAR - DASHBOARD
// ============================
document
  .querySelector('a[href="#dashboard"]')
  ?.addEventListener("click", e => {
    e.preventDefault();

    document
      .getElementById("dashboardTop")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  });
document.getElementById("btnChangePassword")?.addEventListener("click", () => {
  openChangePasswordModal();
});

