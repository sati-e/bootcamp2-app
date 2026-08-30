async function buscarDados(termo) {
  const area = document.getElementById("resultado");

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

botaoBuscar.addEventListener("click", realizarBusca);

campoBusca.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    realizarBusca();
  }
});