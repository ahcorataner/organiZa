console.log("API.JS CARREGADO!");

const API_URL = "https://organiza-backend-ikdh.onrender.com/api";

// =========================
// FUNÇÃO BASE (FETCH)
// =========================
async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Erro HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

// =========================
// RECEITAS
// =========================
export function getReceitas() {
  return request(`${API_URL}/receitas`);
}

export function criarReceita(data) {
  return request(`${API_URL}/receitas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteReceita(id) {
  return request(`${API_URL}/receitas/${id}`, {
    method: "DELETE",
  });
}

// =========================
// DESPESAS
// =========================
export function getDespesas() {
  return request(`${API_URL}/despesas`);
}

export function criarDespesa(data) {
  return request(`${API_URL}/despesas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteDespesa(id) {
  return request(`${API_URL}/despesas/${id}`, {
    method: "DELETE",
  });
}

// =========================
// CONTAS
// =========================
export function getContas() {
  return request(`${API_URL}/contas`);
}

export function criarConta(data) {
  return request(`${API_URL}/contas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteConta(id) {
  return request(`${API_URL}/contas/${id}`, {
    method: "DELETE",
  });
}

// =========================
// FUNÇÃO AUXILIAR (LEGADO)
// =========================
// Mantida para compatibilidade com main.js atual
export function deleteTransacao(tipo, id) {
  if (tipo === "receita") return deleteReceita(id);
  if (tipo === "despesa") return deleteDespesa(id);
  throw new Error("Tipo de transação inválido");
}
// =========================
// UPDATE
// =========================
export function updateReceita(id, data) {
  return request(`${API_URL}/receitas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function updateDespesa(id, data) {
  return request(`${API_URL}/despesas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}
