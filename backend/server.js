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