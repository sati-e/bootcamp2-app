import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// conexao com o projeto no supabase
const supabase = createClient(
  "https://ryuffubfmknqctyqfmkn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5dWZmdWJmbWtucWN0eXFmbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMjE0ODYsImV4cCI6MjEwNDU5NzQ4Nn0.HRenKso1JO5SD7CLr8StOqjQug6leRTOugdJ2r5QgK4"
);

let listaPokemons = [];
let favoritos = []; // lista de favoritos carregada do banco
let pokemonAtual = null; // ultimo pokemon buscado, usado quando clica em favoritar

async function carregarListaPokemons() {
  try {
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000");
    const dados = await resposta.json();
    listaPokemons = dados.results.map((p) => p.name);
  } catch (erro) {
    console.error("Erro ao carregar lista de pokémons:", erro);
  }
}

carregarListaPokemons();

async function buscarDados(termo) {
  const area = document.getElementById("resultado");

  area.classList.remove("fade-in");
  area.innerHTML = "<p>Carregando...</p>";
  pokemonAtual = null;

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(termo)}`
    );

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const dados = await resposta.json();

    const tipos = dados.types.map((item) => item.type.name).join(", ");
    const imagem = dados.sprites.front_default;

    // guarda os dados do pokemon buscado pra poder favoritar depois
    pokemonAtual = {
      nome: dados.name,
      altura: dados.height,
      peso: dados.weight,
      tipos,
      imagem,
    };

    area.innerHTML = `
      <h2 class="uppercase">${dados.name}</h2>

      ${
        imagem
          ? `<img src="${imagem}" alt="${dados.name}">`
          : "<p>Imagem não disponível.</p>"
      }

      <p><strong>Altura:</strong> ${dados.height}</p>
      <p><strong>Peso:</strong> ${dados.weight}</p>
      <p><strong>Tipo:</strong> ${tipos}</p>

      ${criarBotaoCoracao(favoritos.find((f) => f.nome_item === dados.name))}
    `;

    document
      .getElementById("botao-favoritar")
      .addEventListener("click", () => alternarFavorito());

  } catch (erro) {
    area.innerHTML = `
      <p>❌ Pokémon não encontrado.</p>
      <p>Tente usar um nome ou número válido.</p>
    `;
  }

  // Força o navegador a "esquecer" o estado anterior da animação
  void area.offsetWidth;
  area.classList.add("fade-in");
}

// svg do coração, usado no resultado e na lista de favoritos
const SVG_CORACAO = `
  <svg viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
`;

// monta o coraçãozinho do resultado, cheio se ja for favorito
function criarBotaoCoracao(favorito) {
  const idFavorito = favorito ? favorito.id : "";

  return `
    <button id="botao-favoritar" class="coracao-btn${favorito ? " ativo" : ""}" type="button" data-id="${idFavorito}" aria-label="Favoritar">
      ${SVG_CORACAO}
    </button>
  `;
}

// clica no coração: se ja e favorito, tira; se nao e, salva
async function alternarFavorito() {
  if (!pokemonAtual) return;

  const botao = document.getElementById("botao-favoritar");
  const idAtual = botao.dataset.id;

  if (idAtual) {
    await removerFavorito(idAtual);
  } else {
    await salvarFavorito(pokemonAtual.nome);
  }
}

// deixa o coração do resultado atual sincronizado com o banco
function atualizarBotaoCoracao() {
  const botao = document.getElementById("botao-favoritar");
  if (!botao || !pokemonAtual) return;

  const favorito = favoritos.find((f) => f.nome_item === pokemonAtual.nome);

  if (favorito) {
    botao.classList.add("ativo");
    botao.dataset.id = favorito.id;
  } else {
    botao.classList.remove("ativo");
    botao.dataset.id = "";
  }
}

// CREATE — salvar um favorito
async function salvarFavorito(nome) {
  const { data, error } = await supabase
    .from("favoritos")
    .insert({ nome_item: nome })
    .select()
    .single();

  if (error) {
    console.error("Erro ao salvar favorito:", error);
    return;
  }

  // atualiza a lista local direto, sem precisar buscar tudo de novo
  favoritos.unshift(data);
  renderizarLista(favoritos);
  atualizarBotaoCoracao();
}

// READ — listar favoritos
async function listarFavoritos() {
  const { data, error } = await supabase
    .from("favoritos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao listar favoritos:", error);
    return;
  }

  favoritos = data;
  renderizarLista(favoritos);
  atualizarBotaoCoracao();
}

// DELETE — remover um favorito
async function removerFavorito(id) {
  const { error } = await supabase.from("favoritos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover favorito:", error);
    return;
  }

  favoritos = favoritos.filter((f) => String(f.id) !== String(id));
  renderizarLista(favoritos);
  atualizarBotaoCoracao();
}

const spriteCache = {}; // guarda a sprite de cada nome já buscado, pra nao repetir fetch

// busca a sprite de um pokemon pelo nome (usa cache se ja tiver)
async function buscarSprite(nome) {
  if (spriteCache[nome]) return spriteCache[nome];

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`);
    if (!resposta.ok) return null;

    const dados = await resposta.json();
    spriteCache[nome] = dados.sprites.front_default;
    return spriteCache[nome];
  } catch {
    return null;
  }
}

// desenha a lista de favoritos na tela
function renderizarLista(favoritos) {
  const lista = document.getElementById("lista-favoritos");
  lista.innerHTML = "";

  if (!favoritos || favoritos.length === 0) {
    lista.innerHTML = '<li class="favoritos-vazio">Nenhum favorito ainda.</li>';
    return;
  }

  favoritos.forEach((favorito) => {
    const item = document.createElement("li");
    item.className = "item-favorito";

    item.innerHTML = `
      <img class="sprite-favorito" alt="${favorito.nome_item}">
      <span class="nome-favorito">${favorito.nome_item}</span>
      <button class="coracao-btn coracao-lista ativo" type="button" aria-label="Remover ${favorito.nome_item} dos favoritos">
        ${SVG_CORACAO}
      </button>
    `;

    item
      .querySelector(".coracao-lista")
      .addEventListener("click", () => removerFavorito(favorito.id));

    lista.appendChild(item);

    // a sprite carrega depois, sem travar o resto da lista
    buscarSprite(favorito.nome_item).then((url) => {
      if (url) item.querySelector(".sprite-favorito").src = url;
    });
  });
}

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");

function realizarBusca() {
  const termo = campoBusca.value.toLowerCase().trim();

  if (!termo) {
    document.getElementById("resultado").innerHTML =
      "<p>Digite o nome ou número de um Pokémon.</p>";
    return;
  }

  buscarDados(termo);
}

const listaSugestoes = document.getElementById("sugestoes");

function mostrarSugestoes(termo) {
  listaSugestoes.innerHTML = "";
  if (!termo) return;

  const correspondencias = listaPokemons
    .filter((nome) => nome.startsWith(termo))
    .slice(0, 5);

  correspondencias.forEach((nome) => {
    const item = document.createElement("li");
    item.textContent = nome;

    item.addEventListener("click", () => {
      campoBusca.value = nome;
      listaSugestoes.innerHTML = "";
      realizarBusca();
    });

    listaSugestoes.appendChild(item);
  });
}

campoBusca.addEventListener("input", () => {
  const termo = campoBusca.value.toLowerCase().trim();
  mostrarSugestoes(termo);
});

document.addEventListener("click", (evento) => {
  if (!evento.target.closest(".campo-wrapper")) {
    listaSugestoes.innerHTML = "";
  }
});

campoBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    listaSugestoes.innerHTML = "";
    realizarBusca();
  }
});

// clique na lupa tambem busca (antes so funcionava com enter)
botaoBuscar.addEventListener("click", realizarBusca);

// carrega os favoritos assim que a pagina abre
listarFavoritos();