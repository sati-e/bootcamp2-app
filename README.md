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
- Receber uma mensagem de erro caso o nome/número não corresponda a nenhum Pokémon
- Favoritar um Pokémon clicando no coração ao lado do resultado (clicar de novo remove)
- Ver a seção "Meus favoritos", carregada automaticamente ao abrir a página, com a sprite de cada Pokémon salvo
- Remover um favorito clicando no coração preenchido dentro da lista

## Tecnologias utilizadas
- HTML5
- CSS
- JavaScript
- Supabase
- Docker

## Como executar localmente
- **Aplicação no ar (GitHub Pages):** [https://sati-e.github.io/bootcamp2-app/](https://sati-e.github.io/bootcamp2-app/)
- **Repositório:** https://github.com/sati-e/bootcamp2-app

## Persistência de dados
Banco escolhido: Supabase, acessado direto do frontend com a biblioteca @supabase/supabase-js e a chave anon public.

Tabela: favorito

| Coluna | Tipo | Descrição |
| -------- | -------- | -------- |
| id	bigint  | (PK)  | Identificador  |
| created_at  | timestamptz  | Data/hora em que o favorito foi salvo  |
| nome_item  | text  | Nome do Pokémon favoritado  |

Operações implementadas:  
CREATE: salvarFavorito(nome) - insert na tabela ao clicar no coração de um Pokémon ainda não favoritado.  
READ: listarFavoritos() - select ordenado do mais recente para o mais antigo, executado ao abrir a página.  
DELETE: removerFavorito(id) - deleta ao clicar no coração.  

Limitação: as políticas de acesso (RLS) da tabela estão abertas para o papel "anon"

## Sidequests
SQ1 .dockerignore

O arquivo .dockerignore exclui da imagem tudo o que não é necessário para rodar a aplicação: .git, README.md, /prints, Dockerfile, arquivos de editor e lixo de sistema. Isso deixa a imagem menor, porque esses arquivos não são copiados para dentro dela, e o build mais rápido, porque o Docker envia menos arquivos para o daemon. Também evita vazar informações desnecessárias (como o histórico do Git) dentro da imagem publicada.
