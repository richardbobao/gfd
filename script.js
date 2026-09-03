// Base de Dados de Produtos (12 produtos)
const produtos = [
    { id: 1, nome: "Smartphone Pro Max", categoria: "smartphones", preco: 4500, promo: true, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=1", desc: "128GB, Câmera Tripla" },
    { id: 2, nome: "Notebook Ultra", categoria: "notebooks", preco: 3800, promo: false, avaliacao: "⭐⭐⭐⭐☆", img: "https://picsum.photos/300/200?random=2", desc: "Intel i7, 16GB RAM, SSD 512GB" },
    { id: 3, nome: "Fone Bluetooth", categoria: "acessorios", preco: 250, promo: true, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=3", desc: "Cancelamento de ruído ativo" },
    { id: 4, nome: "Smartwatch Sport", categoria: "acessorios", preco: 600, promo: false, avaliacao: "⭐⭐⭐⭐☆", img: "https://picsum.photos/300/200?random=4", desc: "Monitor cardíaco e GPS" },
    { id: 5, nome: "Smartphone Lite", categoria: "smartphones", preco: 1800, promo: true, avaliacao: "⭐⭐⭐☆☆", img: "https://picsum.photos/300/200?random=5", desc: "64GB, Bateria de longa duração" },
    { id: 6, nome: "Notebook Gamer", categoria: "notebooks", preco: 6500, promo: false, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=6", desc: "RTX 3060, Tela 144Hz" },
    { id: 7, nome: "Teclado Mecânico", categoria: "acessorios", preco: 350, promo: true, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=7", desc: "RGB, Switch Blue" },
    { id: 8, nome: "Mouse Gamer", categoria: "acessorios", preco: 180, promo: false, avaliacao: "⭐⭐⭐⭐☆", img: "https://picsum.photos/300/200?random=8", desc: "16000 DPI, Ergonômico" },
    { id: 9, nome: "Tablet 10 Polegadas", categoria: "smartphones", preco: 2100, promo: false, avaliacao: "⭐⭐⭐⭐☆", img: "https://picsum.photos/300/200?random=9", desc: "Acompanha caneta stylus" },
    { id: 10, nome: "Monitor 27'' Curved", categoria: "acessorios", preco: 1400, promo: true, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=10", desc: "Full HD, 165Hz" },
    { id: 11, nome: "Carregador Por Indução", categoria: "acessorios", preco: 120, promo: false, avaliacao: "⭐⭐⭐☆☆", img: "https://picsum.photos/300/200?random=11", desc: "Carregamento rápido 15W" },
    { id: 12, nome: "Headset 7.1 Surround", categoria: "acessorios", preco: 400, promo: true, avaliacao: "⭐⭐⭐⭐⭐", img: "https://picsum.photos/300/200?random=12", desc: "Microfone com cancelamento de ruído" }
];

// Estado da Aplicação
let carrinho = [];
let favoritos = [];

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    renderizarProdutos(produtos);
    configurarEventos();
});

// Renderização dos Produtos
function renderizarProdutos(lista) {
    const grid = document.getElementById("grid-produtos");
    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = "<p class='mensagem-vazia'>Nenhum produto encontrado.</p>";
        return;
    }

    lista.forEach(prod => {
        const isFav = favoritos.includes(prod.id);
        const card = document.createElement("article");
        card.className = "card-produto";
        card.innerHTML = `
            ${prod.promo ? '<span class="badge-promo">PROMOÇÃO</span>' : ''}
            <button class="btn-fav" onclick="toggleFavorito(${prod.id})">${isFav ? '❤️' : '🤍'}</button>
            <img src="${prod.img}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p class="desc">${prod.desc}</p>
            <div class="avaliacao">${prod.avaliacao}</div>
            <div class="preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</div>
            <button class="btn-add-cart" onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
        `;
        grid.appendChild(card);
    });
}

// 1. Pesquisa de Produtos
document.getElementById("input-busca").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo) || p.desc.toLowerCase().includes(termo)
    );
    renderizarProdutos(filtrados);
});

// 2. Filtro por Categoria
function filtrarCategoria(cat) {
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");

    if (cat === 'todos') {
        renderizarProdutos(produtos);
    } else if (cat === 'promocao') {
        renderizarProdutos(produtos.filter(p => p.promo));
    } else {
        renderizarProdutos(produtos.filter(p => p.categoria === cat));
    }
}

// 3. Gerenciamento do Carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    carrinho.push(produto);
    atualizarCarrinho();
    exibirNotificacao(`${produto.nome} adicionado ao carrinho! 🔔`);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const listaCart = document.getElementById("itens-carrinho");
    const count = document.getElementById("cart-count");
    const totalEl = document.getElementById("valor-total");

    count.innerText = carrinho.length;

    if (carrinho.length === 0) {
        listaCart.innerHTML = "<p class='mensagem-vazia'>Seu carrinho está vazio.</p>";
        totalEl.innerText = "0,00";
        return;
    }

    listaCart.innerHTML = "";
    let total = 0;

    carrinho.forEach((prod, index) => {
        total += prod.preco;
        const item = document.createElement("div");
        item.className = "item-carrinho";
        item.innerHTML = `
            <div>
                <strong>${prod.nome}</strong>
                <br><small>R$ ${prod.preco.toFixed(2).replace('.', ',')}</small>
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho(${index})">Remover</button>
        `;
        listaCart.appendChild(item);
    });

    totalEl.innerText = total.toFixed(2).replace('.', ',');
}

// 4. Lista de Favoritos
function toggleFavorito(id) {
    const index = favoritos.indexOf(id);
    if (index === -1) {
        favoritos.push(id);
    } else {
        favoritos.splice(index, 1);
    }
    document.getElementById("fav-count").innerText = favoritos.length;
    renderizarProdutos(produtos);
    renderizarFavoritos();
}

function renderizarFavoritos() {
    const gridFav = document.getElementById("grid-favoritos");
    const prodsFav = produtos.filter(p => favoritos.includes(p.id));

    if (prodsFav.length === 0) {
        gridFav.innerHTML = "<p class='mensagem-vazia'>Nenhum produto favoritado ainda.</p>";
        return;
    }

    gridFav.innerHTML = "";
    prodsFav.forEach(prod => {
        const card = document.createElement("article");
        card.className = "card-produto";
        card.innerHTML = `
            <h3>${prod.nome}</h3>
            <div class="preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</div>
            <button class="btn-add-cart" onclick="adicionarAoCarrinho(${prod.id})">Adicionar ao Carrinho</button>
        `;
        gridFav.appendChild(card);
    });
}

// 5. Finalização de Compra (Checkout)
function abrirCheckout() {
    if (carrinho.length === 0) {
        alert("Adicione pelo menos um produto ao carrinho antes de finalizar!");
        return;
    }
    document.getElementById("checkout").classList.remove("hidden");
    document.getElementById("checkout").scrollIntoView({ behavior: 'smooth' });
}

function finalizarCompra(event) {
    event.preventDefault();
    alert("🎉 Compra realizada com sucesso! Obrigado pela preferência.");
    carrinho = [];
    atualizarCarrinho();
    document.getElementById("form-checkout").reset();
    document.getElementById("checkout").classList.add("hidden");
}

// Utilitários (Modo Escuro, Menu Responsivo e Toast)
function configurarEventos() {
    // Alternar Tema
    document.getElementById("theme-toggle").addEventListener("click", () => {
        const currentTheme = document.body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", newTheme);
        document.getElementById("theme-toggle").innerText = newTheme === "dark" ? "☀️" : "🌙";
    });

    // Menu Responsivo
    document.getElementById("menu-toggle").addEventListener("click", () => {
        document.getElementById("nav-menu").classList.toggle("active");
    });
}

function exibirNotificacao(mensagem) {
    const toast = document.getElementById("toast");
    toast.innerText = mensagem;
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}
