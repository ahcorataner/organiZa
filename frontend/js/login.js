const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const errorDiv = document.getElementById("error");

    errorDiv.textContent = "";

    if (!email || !senha) {
      errorDiv.textContent = "Preencha email e senha.";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.error || "Erro ao logar";
        return;
      }

      // 🔐 salva usuário logado no localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // redireciona para o dashboard
      window.location.href = "index.html";
    } catch (err) {
      errorDiv.textContent = "Servidor indisponível";
      console.error(err);
    }
  });
}
