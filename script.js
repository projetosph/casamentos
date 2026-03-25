// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= PRODUTOS =================
let produtos = [
  {nome:"Geladeira",valor:3000,cota:300,img:"https://via.placeholder.com/200"},
  {nome:"Lua de Mel",valor:5000,cota:250,img:"https://via.placeholder.com/200"}
];

// ================= LISTA =================
function renderProdutos(){

let div = document.getElementById("produtos");
if(!div) return;

div.innerHTML = "";

produtos.forEach((p,i)=>{
  div.innerHTML += `
  <div class="card">
    <img src="${p.img}">
    <h3>${p.nome}</h3>
    <p>Cota: R$${p.cota}</p>
    <button onclick="comprar(${i})">Comprar</button>
  </div>
  `;
});

}

window.comprar = function(i){
  let qtd = prompt("Quantas cotas?");
  let total = qtd * produtos[i].cota;

  localStorage.setItem("compra",JSON.stringify({
    nome:produtos[i].nome,
    qtd,
    total
  }));

  window.location = "pagamento.html";
}

// ================= PAGAMENTO =================
window.pagar = async function(){

  let nome = document.getElementById("nome").value;
  let compra = JSON.parse(localStorage.getItem("compra"));

  if(!nome){
    alert("Digite seu nome");
    return;
  }

  // SALVA NO FIREBASE
  await addDoc(collection(db, "pagamentos"), {
    nome: nome,
    item: compra.nome,
    valor: compra.total,
    data: new Date()
  });

  // LINK MERCADO PAGO (SEU LINK AQUI)
  window.open("https://link.mercadopago.com.br/presentescasanova", "_blank");

  alert("Obrigado pelo presente 💜");
}

// ================= LISTA DE PRESENTES =================
async function carregarPagamentos(){

  let div = document.getElementById("listaPagamentos");
  if(!div) return;

  const querySnapshot = await getDocs(collection(db, "pagamentos"));

  div.innerHTML = "";

  querySnapshot.forEach((doc) => {
    let p = doc.data();
    div.innerHTML += `<p>💖 ${p.nome} presenteou ${p.item}</p>`;
  });

}

renderProdutos();
carregarPagamentos();