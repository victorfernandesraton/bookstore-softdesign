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

# Modelagem

Para este projeto foi definido um conceito de modelagem referente aos livros de forma que eu tenha o registro de um livro por meio de um ISBN unico, e para cada livro tenha N cópias, assim ppodendo emprestar o mesmo tótulo a N pessoas atravez das cópias

# API Documentation

- [books](#books)
  - [LIST BOOKS](#list-books)
  - [GET BOOK INFO](#get-book-info)
  - [GET BORROWED BOOKS](#get-borrowed-books)
  - [CREATE BOOK](#create-book)
  - [UPDATE BOOK](#update-book)
  - [DELETE BOOKS](#delete-books)
  - [CREATE BOOK COPY](#create-book-copy)
  - [BORROW BOOK](#borrow-book)
  - [UNBORROW BOOK](#unborrow-book)
- [auth](#auth)
  - [LOGIN](#login)
  - [SIGNUP](#signup)

# books

## LIST BOOKS

```
🔵 GET: {{ _.HOST }}/books
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## GET BOOK INFO

```
🔵 GET: {{ _.HOST }}/books/63ad994e0c8406e3f8d86803
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## GET BORROWED BOOKS

```
🔵 GET: {{ _.HOST }}/books/me
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## CREATE BOOK

```
🟢 POST: {{ _.HOST }}/books
```

_Request requires authentication_

### Headers

| Name           | Value            | Description |
| -------------- | ---------------- | ----------- |
| ``             |                  |             |
| `Content-Type` | application/json |             |

### Body

```json
{
	"title": "The Boys: Good for soul",
	"author": "Darick Robertson",
	"publisher": "DC Black Label",
	"publisherAt": "2006/01/24",
	"description": "An amizing and dark superhero comic with evil superman and no heros",
	"ISBN": "978-1-56619-909-4"
}
```

[↑ Back to top ↑](#table-of-contents)

## UPDATE BOOK

```
🟣 PUT: {{ _.HOST }}/books/63ace25ea322a5d95f4a20bf
```

_Request requires authentication_

### Headers

| Name           | Value            | Description |
| -------------- | ---------------- | ----------- |
| ``             |                  |             |
| `Content-Type` | application/json |             |

### Body

```json
{
	"title": "The Boys: Bad for soul",
	"publisherAt": "2006/01/25"
}
```

[↑ Back to top ↑](#table-of-contents)

## DELETE BOOKS

```
🔴 DELETE: {{ _.HOST }}/books/63ace25ea322a5d95f4a20bf
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## CREATE BOOK COPY

```
🟢 POST: {{ _.HOST }}/books/copy/63ad994e0c8406e3f8d86803
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## BORROW BOOK

```
🟣 PUT: {{ _.HOST }}/books/borrow/63ae3aed93a14b541197b135
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

## UNBORROW BOOK

```
🟣 PUT: {{ _.HOST }}/books/copy/unborrow/63adb46e4c14a71e3d5b505b
```

_Request requires authentication_

### Headers

| Name | Value | Description |
| ---- | ----- | ----------- |
| ``   |       |             |

[↑ Back to top ↑](#table-of-contents)

# auth

## LOGIN

```
🟢 POST: {{ _.HOST }}/signin
```

### Headers

| Name           | Value            | Description |
| -------------- | ---------------- | ----------- |
| `Content-Type` | application/json |             |

### Body

```json
{
	"email": "test3@mail.com",
	"password": "test@123"
}
```

[↑ Back to top ↑](#table-of-contents)

## SIGNUP

```
🟢 POST: {{ _.HOST }}/signup
```

### Headers

| Name           | Value            | Description |
| -------------- | ---------------- | ----------- |
| `Content-Type` | application/json |             |

### Body

```json
{
	"email": "test3@mail.com",
	"password": "test@123"
}
```

[↑ Back to top ↑](#table-of-contents)
