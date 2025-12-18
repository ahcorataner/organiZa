document.getElementById("forgotBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.className = "";

  if (!email) {
    msg.textContent = "Informe um email válido.";
    msg.className = "error";
    return;
  }

  try {
    const res = await fetch("https://organiza-backend-ikdh.onrender.com/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    msg.textContent =
      data.message || "Se o email existir, enviaremos instruções.";
    msg.className = "success";

  } catch (err) {
    msg.textContent = "Servidor indisponível.";
    msg.className = "error";
  }
});
