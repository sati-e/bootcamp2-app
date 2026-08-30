let listaPokemons = [];

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

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(termo)}`
    );

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const dados = await resposta.json();

    const tipos = dados.types
      .map((item) => item.type.name)
      .join(", ");

    const imagem = dados.sprites.front_default;

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
    `;

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

const campoBusca = document.getElementById("campo-busca");
const botaoBuscar = document.getElementById("botao-buscar");

function realizarBusca() {
  const termo = campoBusca.value
    .toLowerCase()
    .trim();

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
    listaSugestoes.innerHTML = ""; // ← linha nova
    realizarBusca();
  }
});