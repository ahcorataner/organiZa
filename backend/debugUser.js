const { get } = require("./config/db");

(async () => {
  const email = "renata@test.com";
  const u = await get("SELECT id, email, senha FROM usuarios WHERE email = ?", [email]);
  console.log(u);
  process.exit(0);
})();
