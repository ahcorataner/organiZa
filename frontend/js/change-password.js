document.getElementById("btnSalvar").addEventListener("click", async () => {
  const senhaAtual = document.getElementById("senhaAtual").value.trim();
  const novaSenha = document.getElementById("novaSenha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.className = "error";

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    msg.textContent = "Preencha todos os campos.";
    return;
  }

  if (novaSenha !== confirmarSenha) {
    msg.textContent = "As senhas não coincidem.";
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    msg.textContent = "Usuário não autenticado.";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        senhaAtual,
        novaSenha
      })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Erro ao alterar senha.";
      return;
    }

    msg.className = "success";
    msg.textContent = "Senha alterada com sucesso!";

    // 🔒 logout automático (opcional e recomendado)
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    }, 1500);

  } catch (err) {
    msg.textContent = "Servidor indisponível.";
  }
});
