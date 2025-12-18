document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorDiv = document.getElementById("error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    errorDiv.textContent = "";

    if (!nome || !email || !senha) {
      errorDiv.textContent = "Preencha nome, email e senha.";
      return;
    }

    try {
      const res = await fetch("http://https://organiza-backend-ikdh.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.error || "Erro ao registrar";
        return;
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      errorDiv.textContent = "Servidor indisponível";
    }
  });
});
