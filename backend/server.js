const express = require("express");
const mercadopago = require("mercadopago");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// MERCADO PAGO
mercadopago.configure({
  access_token: "SEU_ACCESS_TOKEN"
});

// FIREBASE ADMIN
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ================= CRIAR PAGAMENTO =================
app.post("/criar-pagamento", async (req, res) => {

  const { nome, item, valor } = req.body;

  const preference = await mercadopago.preferences.create({
    items: [
      {
        title: item,
        quantity: 1,
        unit_price: Number(valor)
      }
    ],
    payer: { name: nome },
    notification_url: "https://SEU-SERVIDOR/webhook"
  });

  res.json({ link: preference.body.init_point });

});

// ================= WEBHOOK =================
app.post("/webhook", async (req, res) => {

  const payment = req.body;

  if(payment.type === "payment"){

    const data = await mercadopago.payment.findById(payment.data.id);

    if(data.body.status === "approved"){

      const info = data.body;

      await db.collection("pagamentos").add({
        nome: info.payer.first_name,
        item: info.description,
        valor: info.transaction_amount,
        status: "aprovado"
      });

      // atualizar cotas
      const produtos = await db.collection("produtos")
        .where("nome","==",info.description).get();

      produtos.forEach(async doc => {
        let p = doc.data();

        await doc.ref.update({
          cotasVendidas: p.cotasVendidas + 1
        });
      });

    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("rodando"));