const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TESTE
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// ROTA DE TESTE DE PAGAMENTO (SEM MERCADO PAGO AINDA)
app.post("/criar-pagamento", (req, res) => {
  console.log("Recebido:", req.body);

  res.json({
    link: "https://www.mercadopago.com.br"
  });
});

// WEBHOOK
app.post("/webhook", (req, res) => {
  console.log("Webhook recebido");
  res.sendStatus(200);
});

// PORTA (ESSENCIAL PRO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});