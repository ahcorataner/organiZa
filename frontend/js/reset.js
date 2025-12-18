// 🔍 Validação inicial do token ao abrir a página
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const msg = document.getElementById("msg");

if (!token) {
  msg.textContent = "Link inválido ou expirado.";
  msg.className = "error";
  document.getElementById("resetBtn").disabled = true;
}


// =======================
// RESET PASSWORD
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetBtn");
  const msg = document.getElementById("msg");

  // pega o token da URL (?token=...)
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    msg.textContent = "Token inválido ou ausente.";
    msg.className = "error";
    resetBtn.disabled = true;
    return;
  }

  resetBtn.addEventListener("click", async () => {
    const senha = document.getElementById("senha").value.trim();
    const confirmar = document.getElementById("confirmar").value.trim();

    msg.textContent = "";
    msg.className = "";

    if (!senha || !confirmar) {
      msg.textContent = "Preencha todos os campos.";
      msg.className = "error";
      return;
    }

    if (senha.length < 6) {
      msg.textContent = "A senha deve ter no mínimo 6 caracteres.";
      msg.className = "error";
      return;
    }

    if (senha !== confirmar) {
      msg.textContent = "As senhas não coincidem.";
      msg.className = "error";
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token,
            novaSenha: senha
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        msg.textContent = data.error || "Erro ao redefinir senha.";
        msg.className = "error";
        return;
      }

      msg.textContent = "Senha redefinida com sucesso! Redirecionando...";
      msg.className = "success";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } catch (err) {
      console.error(err);
      msg.textContent = "Servidor indisponível.";
      msg.className = "error";
    }
  });
});
