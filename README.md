# Aspect Hospitalar API

API REST para gestão hospitalar, desenvolvida com **NestJS**. Gerencia usuários,
exames médicos e agendamentos de consultas.

---

## O que a API faz

A **Aspect Hospitalar API** oferece recursos para:

- **Usuários** — Cadastro de usuários com perfis (ADMIN ou PATIENT),
  autenticação de senha com bcrypt e controle de status.
- **Exames** — Catálogo de exames médicos com nome, especialidade, descrição,
  preparação e duração.
- **Agendamentos** — Agendamento de exames associando usuário, exame, paciente,
  data, horário e informações adicionais. Suporta paginação, listagem de ativos
  e atualização/remoção lógica.

### Principais endpoints

| Recurso       | Endpoints                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Users**     | `POST /users/createUser`, `GET /users/findUsers`, `GET /users/user/:id`, `PATCH /users/user/:id`, `DELETE /users/user/:id`                                                                                                |
| **Exams**     | `POST /exams/createExam`, `GET /exams/findExams`, `GET /exams/exam/:id`, `DELETE /exams/exam/:id`                                                                                                                         |
| **Schedules** | `POST /schedules/create`, `GET /schedules/allSchedules` (com paginação), `GET /schedules/allActiveSchedules`, `GET /schedules/schedule/:id`, `PATCH /schedules/updateSchedule/:id`, `PATCH /schedules/removeSchedule/:id` |

---

## Tecnologias utilizadas

- **[NestJS](https://nestjs.com)** — Framework Node.js para APIs escaláveis
- **[TypeScript](https://www.typescriptlang.org)** — Linguagem de programação
- **[TypeORM](https://typeorm.io)** — ORM para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org)** — Banco de dados
- **[class-validator](https://github.com/typestack/class-validator)** e
  **[class-transformer](https://github.com/typestack/class-transformer)** —
  Validação e transformação de DTOs
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** — Hash de senhas
- **[pnpm](https://pnpm.io)** — Gerenciador de pacotes
- **ESLint**, **Prettier** — Linting e formatação
- **Jest** — Testes unitários e e2e

---

## Pré-requisitos

- [Node.js](https://nodejs.org) (v18+)
- [pnpm](https://pnpm.io/installation)
- [PostgreSQL](https://www.postgresql.org/download/) em execução

---

## Configuração do banco

Crie um banco PostgreSQL chamado `aspect-hospitalar`. A API usa, por padrão:

- **Host:** `localhost`
- **Porta:** `5432`
- **Database:** `aspect-hospitalar`
- **Usuário:** `postgres`
- **Senha:** `admin`

Para alterar, edite a configuração do TypeORM em `src/app/app.module.ts`. Em
produção, use variáveis de ambiente e desative `synchronize`.

---

## Instalação e execução

```bash
# Instalar dependências
pnpm install

# Desenvolvimento (watch mode)
pnpm run start:dev

# Produção
pnpm run build
pnpm run start:prod
```

A API sobe em **http://localhost:3001** (ou na porta definida em
`process.env.PORT`).

---

## Scripts disponíveis

| Comando               | Descrição                              |
| --------------------- | -------------------------------------- |
| `pnpm run start`      | Inicia a aplicação                     |
| `pnpm run start:dev`  | Inicia em modo watch (desenvolvimento) |
| `pnpm run start:prod` | Inicia em modo produção                |
| `pnpm run build`      | Gera o build                           |
| `pnpm run seed:exams` | Executa seed de exames                 |
| `pnpm run test`       | Testes unitários                       |
| `pnpm run test:e2e`   | Testes e2e                             |
| `pnpm run test:cov`   | Cobertura de testes                    |
| `pnpm run lint`       | Executa o ESLint                       |
| `pnpm run format`     | Formata o código com Prettier          |

---

## Validação

A API utiliza `ValidationPipe` global:

- **whitelist:** remove campos não declarados nos DTOs
- **forbidNonWhitelisted:** retorna erro se forem enviados campos não permitidos

---

## Licença

Projeto privado (UNLICENSED).
