let produtos = [
  {nome:"Geladeira",valor:3000,cota:300,img:"https://via.placeholder.com/200"},
  {nome:"Lua de Mel",valor:5000,cota:250,img:"https://via.placeholder.com/200"}
];

// LISTAR PRODUTOS
function renderProdutos(){
  let div = document.getElementById("produtos");
  if(!div) return;

  div.innerHTML = "";

  produtos.forEach((p,i)=>{
    div.innerHTML += `
    <div class="card">
      <img src="${p.img}">
      <h3>${p.nome}</h3>
      <p>Cota: R$ ${p.cota}</p>
      <button onclick="comprar(${i})">Comprar</button>
    </div>`;
  });
}

// COMPRAR
function comprar(i){
  let qtd = prompt("Quantas cotas?");
  if(!qtd) return;

  let total = qtd * produtos[i].cota;

  localStorage.setItem("compra", JSON.stringify({
    nome: produtos[i].nome,
    qtd,
    total
  }));

  window.location.href = "pagamento.html";
}

// RESUMO
function resumo(){
  let div = document.getElementById("resumo");
  if(!div) return;

  let compra = JSON.parse(localStorage.getItem("compra"));
  if(!compra) return;

  div.innerHTML = `
    <p>${compra.nome}</p>
    <p>${compra.qtd} cotas</p>
    <p>Total: R$ ${compra.total}</p>
  `;
}

// PAGAMENTO REAL
async function pagar(){
  let nome = document.getElementById("nome").value;
  let compra = JSON.parse(localStorage.getItem("compra"));

  if(!nome){
    alert("Digite seu nome");
    return;
  }

  let res = await fetch("https://casamento-backend-f7e4.onrender.com/criar-pagamento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: nome,
      item: compra.nome,
      valor: compra.total
    })
  });

  let data = await res.json();

  if(data.link){
    window.location.href = data.link;
  }else{
    alert("Erro ao gerar pagamento");
  }
}

renderProdutos();
resumo();