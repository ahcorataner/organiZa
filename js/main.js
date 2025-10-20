// ---------- Configurações de idioma ----------
const i18n = {
  pt: {
    greeting: 'Olá, {name}',
    filter: 'Filtrar',
    logout: 'Sair',
    menu: {
      dashboard: 'Dashboard',
      accounts: 'Minhas Contas',
      cards: 'Cartões',
      transactions: 'Lançamentos',
      inteligencia: 'Inteligência Financeira', // ← adicionado aqui
      reports: 'Relatórios',
      settings: 'Configurações'
    },
    labels: {
      from: 'De:',
      to: 'Até:',
      search: 'Buscar transações...',
      evolution: 'Evolução Financeira Mensal'
    }
  },
  en: {
    greeting: 'Hello, {name}',
    filter: 'Filter',
    logout: 'Logout',
    menu: {
      dashboard: 'Dashboard',
      accounts: 'Accounts',
      cards: 'Cards',
      transactions: 'Transactions',
      inteligencia: 'Financial Intelligence', // ← adicionado aqui
      reports: 'Reports',
      settings: 'Settings'
    },
    labels: {
      from: 'From:',
      to: 'To:',
      search: 'Search transactions...',
      evolution: 'Monthly Financial Evolution'
    }
  }
};


// ---------- Preferências do usuário ----------
const prefs = {
  theme: localStorage.getItem('osa_theme') || 'dark',
  lang: localStorage.getItem('osa_lang') || 'pt',
  name: localStorage.getItem('osa_name') || 'Renata'
};

// ---------- Elementos DOM ----------
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const displayNameEl = document.getElementById('displayName');
const greetingEl = document.getElementById('greeting');
const editNameBtn = document.getElementById('editNameBtn');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');

// ---------- Charts ----------
let charts = {};

// ---------- Função principal de aplicação das preferências ----------
function applyPrefs() {
  // Tema
  document.body.setAttribute('data-theme', prefs.theme);
  themeSelect.value = prefs.theme;

  // Idioma
  languageSelect.value = prefs.lang;
  displayNameEl.innerText = prefs.name;
  greetingEl.innerText = i18n[prefs.lang].greeting.replace('{name}', prefs.name);

  // Menu
  const keys = ['dashboard','accounts','cards','transactions','inteligencia','reports','settings'];

  document.querySelectorAll('.menu-text').forEach((el, idx) => {
    el.innerText = i18n[prefs.lang].menu[keys[idx]];
  });

  // Labels e placeholders
  document.getElementById('labelFrom').innerText = i18n[prefs.lang].labels.from;
  document.getElementById('labelTo').innerText = i18n[prefs.lang].labels.to;
  searchInput.placeholder = i18n[prefs.lang].labels.search;
  document.getElementById('evolution-title').innerText = i18n[prefs.lang].labels.evolution;
  document.getElementById('btnFilter').innerText = i18n[prefs.lang].filter;
  logoutBtn.innerText = i18n[prefs.lang].logout;

  // Textos para tema claro
  document.querySelectorAll('.text-on-light').forEach(el => {
    if (prefs.theme === 'light') el.classList.add('text-on-light');
    else el.classList.remove('text-on-light');
  });

  reinitCharts();
}

// ---------- Eventos de seleção ----------
languageSelect.addEventListener('change', e => {
  prefs.lang = e.target.value;
  localStorage.setItem('osa_lang', prefs.lang);
  applyPrefs();
});

themeSelect.addEventListener('change', e => {
  prefs.theme = e.target.value;
  localStorage.setItem('osa_theme', prefs.theme);
  applyPrefs();
});

editNameBtn.addEventListener('click', () => {
  const newName = prompt(
    prefs.lang === 'en' ? 'Enter your name' : 'Digite seu nome',
    prefs.name
  );
  if (newName?.trim()) {
    prefs.name = newName.trim();
    localStorage.setItem('osa_name', prefs.name);
    applyPrefs();
  }
});

logoutBtn.addEventListener('click', () => {
  alert(`${prefs.lang === 'en' ? 'Logout' : 'Sair'} realizado!`);
});

document.getElementById('applyFilter').addEventListener('click', () => {
  alert(`${prefs.lang === 'en' ? 'Filters applied' : 'Filtros aplicados'} ✅`);
});

// ---------- Paletas de cores ----------
function palette(which) {
  const dark = {
    primary: ['#60a5fa','#3b82f6'],
    accent: ['#7c3aed','#a78bfa'],
    success: ['#34d399','#10b981'],
    warm: ['#f97316','#f59e0b'],
    reds: ['#fb7185','#f43f5e']
  };
  const light = {
    primary: ['#2563eb','#60a5fa'],
    accent: ['#6d28d9','#a78bfa'],
    success: ['#059669','#34d399'],
    warm: ['#ea580c','#f97316'],
    reds: ['#dc2626','#fb7185']
  };
  return prefs.theme === 'light' ? light[which] : dark[which];
}

// ---------- Gradiente ----------
function createGradient(ctx, chartArea, colors) {
  if (!chartArea) return colors[0];
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  return gradient;
}

// ---------- Destrói gráficos anteriores ----------
function destroyCharts() {
  Object.values(charts).forEach(c => { try { c.destroy(); } catch(e){} });
  charts = {};
}

// ---------- Inicialização de gráficos ----------
function initSparks() {
  const ctx = document.getElementById('spark1').getContext('2d');
  const s1 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(12).keys()],
      datasets: [{ data:[50,70,80,90,110,120,150,160,140,170,180,200], borderWidth:2, fill:true, tension:0.35 }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      elements:{point:{radius:2}},
      scales:{x:{display:false},y:{display:false}},
      plugins:[{
        id:'bgLine',
        beforeDatasetsDraw: chart => {
          const ctx = chart.ctx, area = chart.chartArea;
          chart.data.datasets[0].backgroundColor = createGradient(ctx, area, palette('primary'));
          chart.data.datasets[0].borderColor = palette('primary')[0];
        }
      }],
      legend:{display:false},
      tooltip:{enabled:false}
    }
  });
  charts.spark1 = s1;
}

function initPie() {
  const ctx = document.getElementById('pieChartMain').getContext('2d');
  const data = { labels:['Alimentação','Transporte','Lazer','Saúde','Educação'], datasets:[{ data:[30,25,20,15,10] }]};
  const pie = new Chart(ctx, {
    type:'pie',
    data,
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{ position:'bottom', labels:{color: prefs.theme==='light'?'#0b1220':'#e6eef8', boxWidth:12, padding:12 }},
        tooltip:{ callbacks:{ label: ctx => `${ctx.label}: ${ctx.raw}%` }}
      }
    },
    plugins:[{
      id:'pieColors',
      beforeInit: chart => {
        chart.data.datasets[0].backgroundColor = ['#7c3aed','#60a5fa','#fb7185','#f59e0b','#34d399'];
        chart.data.datasets[0].hoverOffset = 8;
      }
    }]
  });
  charts.pie = pie;
}

function initBarCompare() {
  const ctx = document.getElementById('barCompare').getContext('2d');
  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const receitas = [4000,4200,3800,4500,4100,4300,4400,4600,4200,4700,4900,5200];
  const despesas = [2500,3200,2800,3500,2900,3100,3300,3400,3000,3600,3800,4000];
  const bar = new Chart(ctx, {
    type:'bar',
    data:{
      labels,
      datasets:[
        { label:'Receitas', data:receitas, borderRadius:6, backgroundColor: createGradient(ctx, ctx.canvas.getBoundingClientRect(), palette('success')) },
        { label:'Despesas', data:despesas, borderRadius:6, backgroundColor: createGradient(ctx, ctx.canvas.getBoundingClientRect(), palette('reds')) }
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      scales:{ y:{ beginAtZero:true, ticks:{ callback: v => 'R$ '+v } }, x:{ stacked:false } },
      plugins:{ legend:{ labels:{ color: prefs.theme==='light'?'#0b1220':'#e6eef8' } }, tooltip:{ mode:'index', intersect:false } }
    }
  });
  charts.barCompare = bar;
}

function initBalanceChart() {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const receitas = [4000,4200,3800,4500,4100,4300,4400,4600,4200,4700,4900,5200];
  const despesas = [2500,3200,2800,3500,2900,3100,3300,3400,3000,3600,3800,4000];
  let cumulative = [], sum = 0;
  for (let i=0;i<labels.length;i++) sum += (receitas[i]-despesas[i]), cumulative.push(sum);

  const line = new Chart(ctx,{
    type:'line',
    data:{ labels, datasets:[{ label:'Saldo Acumulado', data:cumulative, tension:0.36, borderWidth:2, fill:true }] },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(255,255,255,0.03)' }, beginAtZero:false, ticks:{ callback:v=>'R$ '+v } } },
      plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:ctx=>`R$ ${ctx.formattedValue}` } } },
      elements:{ line:{ backgroundColor: ctx=>{ const chart=ctx.chart, {chartArea} = chart; if(!chartArea) return palette('primary')[0]; return createGradient(chart.ctx, chartArea, palette('primary')); }, borderColor: palette('primary')[0] }, point:{ radius:3, hoverRadius:5 } }
    }
  });
  charts.balance = line;
}

function initMiniDonut() {
  const ctx = document.getElementById('miniDonut').getContext('2d');
  const data = { labels:['Receitas','Despesas'], datasets:[{ data:[4300,2800] }]};
  const donut = new Chart(ctx,{
    type:'doughnut',
    data,
    options:{ cutout:'60%', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } },
    plugins:[{
      id:'donutColors',
      beforeInit: chart => { chart.data.datasets[0].backgroundColor = [palette('success')[0], palette('reds')[0]]; }
    }]
  });
  charts.donut = donut;
}

function initAllCharts() {
  destroyCharts();
  initSparks();
  initPie();
  initBarCompare();
  initBalanceChart();
  initMiniDonut();

  const totalReceitas = 5200;
  const totalDespesas = 4000;
  document.getElementById('sumReceitas').innerText = 'R$ '+totalReceitas.toLocaleString('pt-BR');
  document.getElementById('sumDespesas').innerText = 'R$ '+totalDespesas.toLocaleString('pt-BR');
  document.getElementById('sumSaldo').innerText = 'R$ '+(totalReceitas-totalDespesas).toLocaleString('pt-BR');
  document.getElementById('m1-value').innerText = 'R$ '+(totalReceitas*12).toLocaleString('pt-BR');
  document.getElementById('m2-value').innerText = 'R$ '+(totalDespesas*12).toLocaleString('pt-BR');
  document.getElementById('m3-value').innerText = 'Saldo: R$ '+((totalReceitas-totalDespesas)*12).toLocaleString('pt-BR');
}

function reinitCharts() { initAllCharts(); }

// ---------- Inicialização ----------
applyPrefs();
window.addEventListener('load', () => {
  initAllCharts();

  document.querySelectorAll('.sidebar-item').forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('bg-white/3'));
      s.classList.add('bg-white/3');
    });
  });
});

// ---------- Botões adicionais ----------
document.getElementById('recurringBtn').addEventListener('click', () => {
  alert(`${prefs.lang==='en'?'Recurring expenses':'Despesas Recorrentes'} — aqui você pode administrar suas assinaturas e contas recorrentes.`);
});
document.getElementById('extraBtn').addEventListener('click', () => {
  alert(`${prefs.lang==='en'?'Extra expenses':'Despesas Extras'} — registre despesas pontuais como consertos ou presentes.`);
});
