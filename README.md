# Projeto blibioteca API

Uma simples API para gerir um estoque de livros fictícios

## Arquitetura

Seguindo os conceitos de imutabilidade e CQRS , foi separado a leitura da escrita de forma que ambas funcionem independente, todavia os módulos comuns são consumidos por todos.
Como a estrutura de modelagem e requisitos são simples, não se há a necessiade de se passar por toda uma estrutura de clean code e clean arch, podendo simplificar as coisas

## Docker

Usando o docker e o docker-compose foi elaborado a estrutura de ci/cd pra rodar os testes tanbém

### Comandos

- testes unitários
  ```bash
  docker compose run --rm unit-test
  ```
- servidor de desenvolimento

  ```bash
  docker compose up api --build
  ```

## Requisitos funcionais

- [ ] endpoint para login
- [ ] rotas privadas
