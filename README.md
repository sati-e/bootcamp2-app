# Pokemon Search - Bootcamp PokeAPI

## Autor
Satie Kumeda Chirico 22301624

## Descrição
É uma Pokédex digital web que permite buscar informações sobre qualquer Pokémon consultando a PokeAPI em tempo real. Principais funcionalidades:
- Busca por nome ou número do Pokémon (ex: "pikachu" ou "25")
- Autocomplete/sugestões enquanto o usuário digita, facilitando encontrar o nome certo
- Exibe dados essenciais: imagem (sprite), altura, peso e tipo(s) do Pokémon

## API utilizada
- **Nome:** [PokeAPI](https://pokeapi.co/)
- **Documentação:** https://pokeapi.co/docs/v2
- **Endpoints consumidos:**
  - `GET /pokemon/{name or id}` — retorna os dados do Pokémon buscado (nome, altura, peso, tipos, sprites)
  - `GET /pokemon?limit=100000` — retorna a lista completa de nomes de Pokémon, usada para gerar as sugestões de autocomplete

## Funcionalidades
- Buscar um Pokémon digitando o nome (ex: `pikachu`) ou o número da Pokédex (ex: `25`)
- Ver sugestões de nomes em tempo real enquanto digita, com até 5 opções
- Clicar em uma sugestão para preenchê-la automaticamente e já disparar a busca
- Visualizar imagem, altura, peso e tipo(s) do Pokémon encontrado
- Receber uma mensagem de erro amigável caso o nome/número não corresponda a nenhum Pokémon

## Tecnologias utilizadas
- HTML5
- CSS
- JavaScript

## Como executar localmente
- **Aplicação no ar (GitHub Pages):** [https://sati-e.github.io/bootcamp2-app/](https://sati-e.github.io/bootcamp2-app/)
- **Repositório:** https://github.com/sati-e/bootcamp2-app
