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
  - `GET /pokemon/{name or id}` - retorna os dados do Pokémon buscado (nome, altura, peso, tipos, sprites)
  - `GET /pokemon?limit=100000` - retorna a lista completa de nomes de Pokémon, usada para gerar as sugestões de autocomplete

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
### SQ1 .dockerignore

O arquivo .dockerignore exclui da imagem tudo o que não é necessário para rodar a aplicação: .git, README.md, /prints, Dockerfile, arquivos de editor e lixo de sistema. Isso deixa a imagem menor, porque esses arquivos não são copiados para dentro dela, e o build mais rápido, porque o Docker envia menos arquivos para o daemon. Também evita vazar informações desnecessárias (como o histórico do Git) dentro da imagem publicada.

### SQ2 Versionamento de imagem

O repositório no Docker Hub tem as tags:  
1.0 - primeira versão funcional, com busca e favoritos.  
1.1 - melhoria: o botão do Pokémon pesquisado possui o mesmo efeito de preencher e esvaziar que a lista, e o ícone de pesquisar inverte as cores no hover.
latest - aponta para a 1.1.  

### SQ3 Explorando a orquestração

O overview do repositório no Docker Hub contém o que é a aplicação, o comando `docker run` e o link do GitHub.  
Texto usado:

```markdown
# Pokédex - Bootcamp PokeAPI

Pokédex web que busca Pokémon na PokeAPI (por nome ou número), com autocomplete,
e permite salvar favoritos em um banco Supabase. Servida por Nginx.

## Como rodar
docker run -d -p 8080:80 satiekc/bootcamp2-app:1.1

Depois abra http://localhost:8080

## Código-fonte
https://github.com/sati-e/Bootcamp-II-Etapa-01-Desafio-individual
```

### SQ4 Explorando a orquestração

Dois containers da aplicação rodando ao mesmo tempo, nas portas 8080 e 8081 com print do `docker ps` em /prints

**Se tivesse 100 containers, como gerenciaria?**  
Subir e acompanhar 100 containers manualmente, com docker run e docker ps, seria inviável. E para resolver isso existe o Kubernetes, um orquestrador de containers  que organiza as máquinas em um cluster. A menor unidade que ele gerencia é o pod, que agrupa um ou mais containers que compartilham rede e armazenamento. Em vez de criar pods um a um, é declarado o estado desejado, por exemplo "quero 100 réplicas da aplicação", e o Kubernetes distribui os pods pelos nós, monitora, recria automaticamente os que falham, permite aumentar ou diminuir o número de réplicas e faz atualizações graduais da versão 1.0 para a 1.1. Ele também distribui o tráfego entre as réplicas por meio de serviços, de modo que quem acessa a aplicação não precisa saber em qual container ela está rodando.
