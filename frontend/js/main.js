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
const API_BASE = "http://localhost:3000/api"; // backend
const LOGIN_PAGE = "login.html";

/***********************
 * AUTH / PROTEÇÃO
 ***********************/
const userRaw = localStorage.getItem("user");
let user = null;

try {
  user = userRaw ? JSON.parse(userRaw) : null;
} catch {
  user = null;
}

if (!user) {
  window.location.href = LOGIN_PAGE;
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
if (greeting) greeting.textContent = `Olá, ${user?.nome || "Usuário"}`;
if (displayName) displayName.textContent = user?.nome || "Usuário";

/***********************
 * LOGOUT
 ***********************/
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
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
    localStorage.setItem("user", JSON.stringify(user));
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
    recentTitle: "Despesas Recentes",
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
    recentTitle: "Recent Expenses",
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
      localStorage.setItem("user", JSON.stringify(user));
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

/***********************
 * API (fetch)
 ***********************/
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
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
 * STATE
 ***********************/
let receitas = [];
let despesas = [];

let pieChart = null;
let barChart = null;
let lineChart = null;

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
function renderCharts() {
  const filters = getFilters();

  const recFilt = receitas
    .map(r => normalizeItem(r, "receita"))
    .filter(it => matchesFilters(it, filters));

  const despFilt = despesas
    .map(d => normalizeItem(d, "despesa"))
    .filter(it => matchesFilters(it, filters));

  // destrói gráficos antigos (todos)
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();
  if (catChart) catChart.destroy();
  if (evolChart) evolChart.destroy();

  // lê as variáveis do tema (uma vez)
  const css = getComputedStyle(document.body);
  const text = (css.getPropertyValue("--text") || "#e6eef8").trim();
  const muted = (css.getPropertyValue("--muted") || "#aaa").trim();

  // paleta temática
  const green = "#22c55e";
  const red = "#ef4444";
  const blue = "#3b82f6";

  // ============================
  // PIE (Despesas por Tipo)
  // ============================
  const categorias = {};
  despFilt.forEach(d => {
    const cat = d.categoria || "Outros";
    categorias[cat] = (categorias[cat] || 0) + Number(d.valor);
  });

  if (pieCanvas) {
    pieChart = new Chart(pieCanvas, {
      type: "pie",
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          data: Object.values(categorias),
          backgroundColor: Object.keys(categorias).map((_, i) => {
            const palette = [red, blue, green, "#f59e0b", "#6366f1", "#14b8a6", "#a855f7"];
            return palette[i % palette.length];
          }),
          borderColor: "transparent"
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text } } }
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
});
