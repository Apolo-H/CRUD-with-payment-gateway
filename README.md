# 🍔 Hamburgueria Delivery — API & CMS

Sistema de delivery para hamburgueria, composto por uma **API REST em NestJS** (autenticação, endereços e pedidos) integrada a um **catálogo de produtos gerenciado no Sanity CMS**, com persistência em **PostgreSQL** via **Prisma ORM**.

## 🧱 Arquitetura

O projeto é um monorepo dividido em duas partes principais:

```
├── backend/     # API REST em NestJS + Prisma + PostgreSQL
├── cms/         # Sanity Studio (catálogo de produtos e complementos)
└── docker-compose.yml   # Banco de dados PostgreSQL + Adminer
```

**Fluxo geral:** os produtos e complementos (adicionais) são cadastrados e mantidos no **Sanity CMS**. A API NestJS consulta o Sanity em tempo real para validar produtos/preços no momento da criação de um pedido, e persiste usuários, endereços e pedidos no **PostgreSQL** através do Prisma.

## ⚙️ Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) — framework Node.js
- [Prisma ORM](https://www.prisma.io/) (com `@prisma/adapter-pg`) — acesso ao PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [Passport JWT](http://www.passportjs.org/) — autenticação via token
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senhas
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer) — validação de DTOs
- [Swagger](https://docs.nestjs.com/openapi/introduction) — documentação da API (`/api`)
- [uuid v7](https://www.npmjs.com/package/uuid) — geração de IDs ordenáveis por tempo

**CMS**
- [Sanity.io](https://www.sanity.io/) — catálogo de produtos e complementos (headless CMS)

**Infra**
- Docker Compose — PostgreSQL + Adminer (interface web para o banco)

## 📦 Módulos do Backend

| Módulo | Responsabilidade |
|---|---|
| `auth` | Cadastro (`/auth/register`) e login (`/auth/login`) de usuários, geração de JWT |
| `address` | CRUD de endereços de entrega vinculados ao usuário autenticado |
| `orders` | Criação e listagem de pedidos, validando produtos/complementos contra o Sanity e calculando o preço final |
| `jwt` | Guard e Strategy do Passport para proteger rotas com Bearer Token |
| `prisma` | Serviço global de conexão com o banco via Prisma |
| `sanity` | Serviço global de consulta ao catálogo de produtos no Sanity |

### Autenticação
Todas as rotas de `addresses` e `orders` são protegidas por `JwtAuthGuard` e exigem o header:
```
Authorization: Bearer <token>
```
O token é obtido em `POST /auth/login` e o usuário atual é injetado nos controllers através do decorator `@CurrentUser()`.

### Pedidos (Orders)
Ao criar um pedido (`POST /orders`), a API:
1. Valida se o usuário e o endereço de entrega existem;
2. Para cada item do carrinho, busca o produto no Sanity (`getProductWithComplements`);
3. Valida se os complementos escolhidos pertencem ao produto;
4. Calcula o preço final somando produto base + complementos;
5. Persiste o pedido com seus itens e complementos no PostgreSQL.

## 🗂️ Modelagem de dados (Sanity)

- **`product`**: nome, descrição, preço, imagem, slug e referências para `complement`.
- **`complement`**: nome e preço do adicional.

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js
- Docker e Docker Compose
- Conta e projeto criados no [Sanity.io](https://www.sanity.io/)

### 1. Variáveis de ambiente
Copie o `.env.example` para `.env` na raiz do projeto e preencha:

```env
DATABASE_URL=
JWT_SECRET=
SANITY_PROJECT_ID=
SANITY_DATASET=
POSTGRES_USER=
POSTGRES_DB=
POSTGRES_PASSWORD=
```

### 2. Subir o banco de dados

```bash
docker-compose up -d
```

Isso sobe:
- **PostgreSQL** em `localhost:5432`
- **Adminer** (UI do banco) em `localhost:8080`

### 3. Instalar dependências e rodar migrations

```bash
cd backend
npm install
npx prisma migrate dev
```

### 4. (Opcional) Popular o banco com dados de teste

```bash
npx prisma db seed
```

Isso cria um usuário de teste (`angelo@teste.com` / senha `123456`), dois endereços e um pedido de exemplo.

### 5. Rodar a API

```bash
npm run start:dev
```

A API sobe por padrão em `http://localhost:3000`, com documentação Swagger disponível em:

```
http://localhost:3000/api
```

### 6. Rodar o Sanity Studio (CMS)

```bash
cd cms
npm install
npm run dev
```

## 📚 Principais Endpoints

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/auth/register` | Cria um novo usuário | ❌ |
| `POST` | `/auth/login` | Autentica e retorna JWT | ❌ |
| `POST` | `/addresses` | Cria um endereço para o usuário logado | ✅ |
| `GET` | `/addresses` | Lista endereços do usuário logado | ✅ |
| `DELETE` | `/addresses/:id` | Remove um endereço | ✅ |
| `POST` | `/orders` | Cria um novo pedido | ✅ |
| `GET` | `/orders` | Lista pedidos do usuário logado | ✅ |

## 🧪 Testes

```bash
cd backend
npm run test
```

Os testes unitários (`*.spec.ts`) cobrem os controllers e services de `auth`, `address` e `orders`.

## 📄 Licença

Projeto privado / uso interno — ajuste esta seção conforme a licença desejada.
