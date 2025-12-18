// backend/services/mailer.js
const nodemailer = require("nodemailer");

// =======================
// CONFIGURAÇÃO DO TRANSPORT
// =======================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER, // ex: organisa.app@gmail.com
    pass: process.env.EMAIL_PASS  // senha de app do Gmail
  }
});

// =======================
// ENVIO DE EMAIL DE RESET
// =======================
async function sendResetEmail(to, resetLink) {
  const mailOptions = {
    from: `"ORGANI$A" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔐 Recuperação de senha - ORGANI$A",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background:#f9fafb">
        <div style="max-width: 600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px">
          
          <h2 style="color:#111827">Recuperação de Senha</h2>

          <p>Olá,</p>

          <p>
            Recebemos uma solicitação para redefinir sua senha no
            <strong>ORGANI$A</strong>.
          </p>

          <p>Clique no botão abaixo para criar uma nova senha:</p>

          <p style="margin: 20px 0;">
            <a href="${resetLink}"
               style="
                 background:#4f46e5;
                 color:#ffffff;
                 padding:12px 20px;
                 text-decoration:none;
                 border-radius:6px;
                 display:inline-block;
                 font-weight:bold;
               ">
              Redefinir senha
            </a>
          </p>

          <p style="color:#374151">
            ⏰ Este link expira em <strong>30 minutos</strong>.
          </p>

          <p style="font-size:12px; color:#6b7280; margin-top:20px">
            Se você não solicitou a redefinição de senha,
            pode ignorar este email com segurança.
          </p>

          <hr style="margin:30px 0">

          <p style="font-size:12px; color:#9ca3af">
            © ORGANI$A — Controle Financeiro Pessoal
          </p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendResetEmail
};
