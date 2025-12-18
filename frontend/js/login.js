/****************************************************
 * ORGANI$A - login.js
 * - Login com API
 * - Salva token e usuário no localStorage
 * - Redireciona para dashboard
 ****************************************************/

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorDiv = document.getElementById("error");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede reload da página

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    errorDiv.textContent = "";

    if (!email || !senha) {
      errorDiv.textContent = "Preencha email e senha.";
      return;
    }

    try {
      const res = await fetch("https://organiza-backend-ikdh.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.error || "Erro ao logar";
        return;
      }

      // 🔐 salva token e usuário separadamente
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      console.log("Login OK:", data.usuario);

      // ✅ redirecionamento seguro para o dashboard
      setTimeout(() => {
  window.location.href = "index.html";
}, 100);


    } catch (err) {
      errorDiv.textContent = "Servidor indisponível";
      console.error(err);
    }
  });
});
document.getElementById("registerBtn")?.addEventListener("click", () => {
  window.location.href = "register.html";
});

document.getElementById("forgotBtn")?.addEventListener("click", () => {
  window.location.href = "forgot.html";
});
