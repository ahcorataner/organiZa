const API_URL = "http://localhost:3000/api/auth";

const btn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const errorDiv = document.getElementById("error");

btn.addEventListener("click", async () => {
  errorDiv.textContent = "";

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  if (!email || !senha) {
    errorDiv.textContent = "Preencha email e senha.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      errorDiv.textContent = data.error || "Erro no login.";
      return;
    }

    // ✅ SALVA USUÁRIO LOGADO
    localStorage.setItem("usuario", JSON.stringify(data));

    // 🔁 REDIRECIONA PARA DASHBOARD
    window.location.href = "index.html";

  } catch (err) {
    errorDiv.textContent = "Erro ao conectar com o servidor.";
  }
});
