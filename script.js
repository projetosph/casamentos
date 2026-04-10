const API = "https://casamento-backend-f7e4.onrender.com";

let produtos = [
  { nome: "Geladeira", valor: 3000, cota: 300, totalCotas: 10, compradas: 3, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c" },
  { nome: "Lua de Mel", valor: 5000, cota: 250, totalCotas: 20, compradas: 5, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" }
];

// ================= PRODUTOS =================
function renderProdutos(){

  let div = document.getElementById("produtos");
  if(!div) return;

  div.innerHTML = "";

  produtos.forEach((p,i)=>{

    let progresso = (p.compradas / p.totalCotas) * 100;
    let esgotado = p.compradas >= p.totalCotas;

    div.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.nome}</h3>

        <div class="progress">
          <div style="width:${progresso}%"></div>
        </div>

        <small>${p.compradas}/${p.totalCotas} cotas</small>

        <p>R$ ${p.cota} por cota</p>

        ${
          esgotado
          ? `<button disabled>Esgotado</button>`
          : `<button onclick="comprar(${i})">Comprar</button>`
        }

      </div>
    `;
  });

}

// ================= COMPRA =================
function comprar(i){

  let p = produtos[i];

  if(p.compradas >= p.totalCotas){
    alert("Item já completo");
    return;
  }

  let qtd = prompt("Quantas cotas?");
  if(!qtd || qtd <= 0) return;

  let total = qtd * p.cota;

  localStorage.setItem("compra", JSON.stringify({
    nome: p.nome,
    qtd,
    total
  }));

  window.location = "pagamento.html";
}

// ================= RESUMO =================
function resumo(){

  let r = document.getElementById("resumo");
  if(!r) return;

  let compra = JSON.parse(localStorage.getItem("compra"));

  if(!compra) return;

  r.innerHTML = `
    <p>${compra.nome}</p>
    <p>${compra.qtd} cotas</p>
    <p>Total: R$ ${compra.total}</p>
  `;
}

// ================= PAGAMENTO =================
function finalizarPagamento(){

  let nome = document.getElementById("nome").value;
  let tipo = document.querySelector('input[name="pag"]:checked');

  if(!nome){
    alert("Digite seu nome");
    return;
  }

  if(!tipo){
    alert("Escolha forma de pagamento");
    return;
  }

  let compra = JSON.parse(localStorage.getItem("compra"));

  let area = document.getElementById("areaPagamento");

  if(tipo.value === "pix"){

    area.innerHTML = `
      <h3>Pagamento via Pix</h3>

      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VALOR_${compra.total}">

      <p>Copie a chave:</p>
      <strong>PAULOALANA@PIX</strong>

      <p>Aguardando pagamento...</p>
    `;

  } else {

    fetch("https://casamento-backend-f7e4.onrender.com/criar-pagamento", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        nome: nome,
        valor: compra.total
      })
    })
    .then(res => res.json())
    .then(data => {

      window.open(data.link, "_blank");

      area.innerHTML = `
        <p>Pagamento aberto...</p>
        <p>Após pagar, seu nome aparecerá automaticamente 💜</p>
      `;

    })
    .catch(() => {
      alert("Erro ao conectar com servidor");
    });

  }
}

// ================= INIT =================
renderProdutos();
resumo();
carregarPagamentos();
setInterval(carregarPagamentos, 10000);

// ============ PRESENÇA =============
function confirmarPresenca() {
  const nome = document.getElementById("nome").value
  const quantidade = document.getElementById("quantidade").value
  const mensagem = document.getElementById("mensagem").value

  if (!nome || !quantidade) {
    alert("Preencha nome e quantidade")
    return
  }

  const lista = JSON.parse(localStorage.getItem("presencas")) || []

  lista.push({
    nome,
    quantidade,
    mensagem
  })

  localStorage.setItem("presencas", JSON.stringify(lista))

  alert("Presença confirmada!")

  document.getElementById("nome").value = ""
  document.getElementById("quantidade").value = ""
  document.getElementById("mensagem").value = ""

  carregarPresencas()
}

function carregarPresencas() {
  const lista = JSON.parse(localStorage.getItem("presencas")) || []
  const container = document.getElementById("listaPresenca")

  if (!container) return

  container.innerHTML = "<h3 style='margin-top:30px'>Confirmados</h3>"

  lista.forEach(p => {
    container.innerHTML += `
      <div style="margin-top:10px; font-size:13px;">
        <strong>${p.nome}</strong> - ${p.quantidade} pessoa(s)
      </div>
    `
  })
}

carregarPresencas()

// ================= SALVAR (CRIAR OU EDITAR) =================
function salvarProduto(){
  const nome = document.getElementById("nomeProduto").value
  const valor = document.getElementById("valorProduto").value
  const cota = document.getElementById("cotaProduto").value
  const imagem = document.getElementById("imagemProduto").value
  const editIndex = document.getElementById("editIndex").value

  if(!nome || !valor || !cota){
    alert("Preencha tudo")
    return
  }

  let produtos = JSON.parse(localStorage.getItem("produtos")) || []

  if(editIndex === ""){
    // NOVO
    produtos.push({
      nome,
      valor,
      cota,
      imagem,
      comprado:0
    })
  } else {
    // EDITAR
    produtos[editIndex] = {
      ...produtos[editIndex],
      nome,
      valor,
      cota,
      imagem
    }
  }

  localStorage.setItem("produtos", JSON.stringify(produtos))

  limparFormulario()
  carregarProdutosAdmin()
}

// ================= EDITAR =================
function editarProduto(index){
  let produtos = JSON.parse(localStorage.getItem("produtos"))

  const p = produtos[index]

  document.getElementById("nomeProduto").value = p.nome
  document.getElementById("valorProduto").value = p.valor
  document.getElementById("cotaProduto").value = p.cota
  document.getElementById("imagemProduto").value = p.imagem || ""

  document.getElementById("editIndex").value = index
}

// ================= EXCLUIR =================
function excluirProduto(index){
  if(!confirm("Deseja excluir este produto?")) return

  let produtos = JSON.parse(localStorage.getItem("produtos"))

  produtos.splice(index, 1)

  localStorage.setItem("produtos", JSON.stringify(produtos))

  carregarProdutosAdmin()
}

// ================= LISTAR =================
function carregarProdutosAdmin(){
  const lista = JSON.parse(localStorage.getItem("produtos")) || []
  const div = document.getElementById("listaProdutos")

  if(!div) return

  div.innerHTML = "<h3 style='margin-top:20px'>Presentes cadastrados</h3>"

  lista.forEach((p, index)=>{

    div.innerHTML += `
      <div style="
        margin-top:15px;
        padding:10px;
        border:1px solid #eee;
        border-radius:8px;
      ">

        ${p.imagem ? `<img src="${p.imagem}" style="width:60px; border-radius:6px;">` : ""}

        <div><strong>${p.nome}</strong></div>
        <div>R$ ${p.valor}</div>

        <button onclick="editarProduto(${index})">Editar</button>
        <button onclick="excluirProduto(${index})">Excluir</button>

      </div>
    `
  })
}

// ================= LIMPAR =================
function limparFormulario(){
  document.getElementById("nomeProduto").value = ""
  document.getElementById("valorProduto").value = ""
  document.getElementById("cotaProduto").value = ""
  document.getElementById("imagemProduto").value = ""
  document.getElementById("editIndex").value = ""
}

carregarProdutosAdmin()

// ================= PRESENÇAS =================
function carregarPresencasAdmin(){
  const lista = JSON.parse(localStorage.getItem("presencas")) || []
  const div = document.getElementById("presencas")

  if(!div) return

  lista.forEach(p=>{
    div.innerHTML += `
      <div style="margin-top:10px;">
        ${p.nome} - ${p.quantidade} pessoa(s)
      </div>
    `
  })
}

carregarProdutosAdmin()
carregarPresencasAdmin()

function carregarPresentes(){

  const lista = JSON.parse(localStorage.getItem("produtos")) || []
  const container = document.getElementById("listaPresentes")

  if(!container) return

  container.innerHTML = ""

  lista.forEach((p, index)=>{

    const totalCotas = Math.ceil(p.valor / p.cota)
    const progresso = (p.comprado / totalCotas) * 100

    container.innerHTML += `
      <div class="card">

        ${p.imagem ? `<img src="${p.imagem}">` : ""}

        <h3>${p.nome}</h3>

        <div class="progress">
          <div style="width:${progresso}%"></div>
        </div>

        <small>${p.comprado} de ${totalCotas} cotas</small>

        <button 
          onclick="comprarCota(${index})"
          ${p.comprado >= totalCotas ? "disabled" : ""}
        >
          ${p.comprado >= totalCotas ? "ESGOTADO" : "PRESENTEAR"}
        </button>

      </div>
    `
  })
}
function comprarCota(index){

  let produtos = JSON.parse(localStorage.getItem("produtos"))

  const nome = prompt("Digite seu nome para presentear:")

  if(!nome) return

  const totalCotas = Math.ceil(produtos[index].valor / produtos[index].cota)

  if(produtos[index].comprado >= totalCotas){
    alert("Produto esgotado")
    return
  }

  produtos[index].comprado++

  // salvar nome do presenteador
  if(!produtos[index].presentes){
    produtos[index].presentes = []
  }

  produtos[index].presentes.push(nome)

  localStorage.setItem("produtos", JSON.stringify(produtos))

  alert("Obrigado pelo presente ❤️")

  carregarPresentes()
}
carregarPresentes()

