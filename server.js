const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROTA TESTE
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// IMPORTANTE: PORTA DO RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN
});

app.post("/criar-pagamento", async (req, res) => {
  try {
    const { titulo, valor, nome } = req.body;

    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: titulo,
          unit_price: Number(valor),
          quantity: 1
        }
      ],
      payer: {
        name: nome
      }
    });

    res.json({
      link: preference.body.init_point
    });

  } catch (erro) {
    console.log(erro);
    res.status(500).send("Erro ao criar pagamento");
  }
});

let pagamentos = [];

app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", req.body);

  // Simples (mock inicial)
  pagamentos.push({
    nome: "Convidado",
    valor: 100
  });

  res.sendStatus(200);
});

// ROTA PRA LISTAR PAGAMENTOS
app.get("/pagamentos", (req, res) => {
  res.json(pagamentos);
});