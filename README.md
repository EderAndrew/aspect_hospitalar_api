# Aspect Hospitalar API

API REST desenvolvida em NestJS para gerenciamento de sistema hospitalar,
incluindo controle de usuários, exames médicos e agendamentos.

**Versão**: 0.0.2 | **Node.js**: v18+ | **Banco**: PostgreSQL | **Gerenciador**: pnpm

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Testes](#-testes)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Autenticação](#-autenticação)
- [Módulos Principais](#-módulos-principais)
- [Configurações](#-configurações)
- [Seeds](#-seeds)
- [Deployment com PM2](#-deployment-com-pm2)
- [Atualizações Recentes](#-atualizações-recentes-v001)

---

## 📋 Sobre o Projeto

A **Aspect Hospitalar API** é uma aplicação backend que fornece endpoints para
gerenciar operações de um sistema hospitalar, permitindo:

- **Autenticação e Autorização**: Sistema de login com JWT, refresh tokens e
  controle de acesso baseado em roles
- **Gestão de Usuários**: CRUD completo de usuários com diferentes níveis de
  permissão (Admin, etc.)
- **Gestão de Exames**: Cadastro e gerenciamento de exames médicos com
  informações detalhadas (especialidade, preparação, duração)
- **Agendamentos**: Sistema de agendamento que relaciona pacientes, exames e
  usuários, com controle de status e informações adicionais

## 🛠️ Tecnologias Utilizadas

### Core Framework

- **[NestJS](https://nestjs.com/)** (v11.0.1) - Framework Node.js progressivo
  para construção de aplicações server-side eficientes e escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** (v5.7.3) - Superset do
  JavaScript com tipagem estática

### Banco de Dados

- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[TypeORM](https://typeorm.io/)** (v0.3.28) - ORM para TypeScript e
  JavaScript
- **[@nestjs/typeorm](https://docs.nestjs.com/techniques/database)** (v11.0.0) -
  Módulo TypeORM para NestJS

### Autenticação e Segurança

- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication)** (v11.0.2) -
  Módulo JWT para NestJS
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** (v6.0.0) - Biblioteca para
  hash de senhas
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** (v1.4.7) -
  Middleware para parsing de cookies
- **[helmet](https://helmetjs.github.io/)** (v8.1.0) - Middleware de segurança HTTP
- **[csrf-csrf](https://www.npmjs.com/package/csrf-csrf)** (v4.0.3) - Proteção CSRF

### Validação e Transformação

- **[class-validator](https://github.com/typestack/class-validator)**
  (v0.14.3) - Validação de DTOs usando decorators
- **[class-transformer](https://github.com/typestack/class-transformer)**
  (v0.5.1) - Transformação de objetos e classes

### Configuração e Ambiente

- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)**
  (v4.0.2) - Módulo de configuração do NestJS

### Cache

- **[@nestjs/cache-manager](https://docs.nestjs.com/techniques/caching)**
  (v3.1.0) - Sistema de cache para NestJS
- **[cache-manager](https://www.npmjs.com/package/cache-manager)** (v7.2.8) -
  Gerenciador de cache

### Desenvolvimento

- **[ESLint](https://eslint.org/)** (v9.18.0) - Linter para
  JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** (v3.4.2) - Formatador de código
- **[Jest](https://jestjs.io/)** (v30.0.0) - Framework de testes
- **[ts-node](https://www.npmjs.com/package/ts-node)** (v10.9.2) - Execução de TypeScript diretamente
- **[tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths)** (v4.2.0) - Resolução de paths do TypeScript
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido e eficiente

## 📁 Estrutura do Projeto

```
src/
├── app/              # Módulo principal da aplicação
├── auth/             # Módulo de autenticação (JWT, login, refresh token)
├── users/            # Módulo de gerenciamento de usuários
├── exams/            # Módulo de gerenciamento de exames médicos
├── schedules/        # Módulo de agendamentos
├── common/           # Utilitários e DTOs compartilhados
├── database/         # Seeds e dados iniciais
│   └── seeds/        # Scripts de seed (exams, user)
└── main.ts           # Arquivo de entrada da aplicação
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL instalado e rodando
- pnpm instalado globalmente (`npm install -g pnpm`)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd aspect_hospitalar_api
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente: Crie um arquivo `.env` na raiz do projeto
   com as seguintes variáveis:

```env
# Application
PORT=4001
NODE_ENV=development
FRONTEND_URL=http://localhost:4001

# Database
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha
DATABASE_DATABASE=aspect-hospitalar
DATABASE_AUTOLOAD_ENTITIES=1
DATABASE_SYNCRONIZE=1

# JWT Configuration
JWT_SECRET=seu_jwt_secret_seguro
JWT_TOKEN_AUDIENCE=https://localhost:4001
JWT_TOKEN_ISSUER=https://localhost:4001
JWT_TTL=900
JWT_REFRESH_TTL=86400

# Seed Configuration (para seed:user)
SEED_NAME=Seu Nome
SEED_EMAIL=seu_email@exemplo.com
SEED_PASSWORD=Sua_Senha_Segura
SEED_ROLE=ADMIN
SEED_AVATAR=
SEED_STATUS=true
```

4. Execute as migrations/seeds (se necessário):

```bash
# Seed de exames médicos
pnpm run seed:exams

# Seed de usuário inicial (requer variáveis de ambiente configuradas)
pnpm run seed:user
```

### Executando a Aplicação

```bash
# Modo desenvolvimento (com hot-reload)
pnpm run start:dev

# Modo produção
pnpm run build
pnpm run start:prod

# Modo debug
pnpm run start:debug
```

A API estará disponível em `http://localhost:4001` (ou na porta configurada no
`.env`)

## 🧪 Testes

```bash
# Testes unitários
pnpm run test

# Testes em modo watch
pnpm run test:watch

# Testes com cobertura
pnpm run test:cov

# Testes end-to-end
pnpm run test:e2e
```

## 📝 Scripts Disponíveis

- `pnpm run build` - Compila o projeto TypeScript
- `pnpm run format` - Formata o código com Prettier
- `pnpm run start` - Inicia a aplicação
- `pnpm run start:dev` - Inicia em modo desenvolvimento
- `pnpm run start:prod` - Inicia em modo produção
- `pnpm run lint` - Executa o linter e corrige problemas
- `pnpm run seed:exams` - Executa seed de exames médicos
- `pnpm run seed:user` - Executa seed de usuário inicial (requer variáveis SEED_* configuradas)

## 🔐 Autenticação

A API utiliza autenticação baseada em JWT com refresh tokens armazenados em
cookies HTTP-only:

- **Login**: `POST /auth/login` - Autentica o usuário e retorna tokens
- **Refresh**: `POST /auth/refresh` - Renova os tokens de acesso
- **Logout**: `POST /auth/logout` - Remove os cookies de autenticação

Os tokens são enviados via cookies seguros para maior proteção contra ataques
XSS.

## 🔌 Endpoints da API

### Authentication
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/signup` | Criar novo usuário (registro) |
| POST | `/auth/login` | Realizar login |
| POST | `/auth/refresh` | Renovar tokens |
| POST | `/auth/logout` | Realizar logout |

### Users
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/users/createUser` | Criar novo usuário |
| GET | `/users/findUsers` | Listar todos os usuários |
| GET | `/users/user/:id` | Obter usuário por ID |
| GET | `/users/me` | Obter dados do usuário autenticado |
| PATCH | `/users/user/:id` | Atualizar usuário |
| DELETE | `/users/user/:id` | Deletar usuário |

### Exams
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/exams/createExam` | Criar novo exame |
| GET | `/exams/findExams` | Listar todos os exames |
| GET | `/exams/exam/:id` | Obter exame por ID |
| DELETE | `/exams/exam/:id` | Deletar exame |

### Plans
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/plans/createPlan` | Criar novo plano |
| GET | `/plans/allPlans` | Listar todos os planos |
| GET | `/plans/plan/:id` | Obter plano por ID |

### Schedules
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/schedules/create` | Criar novo agendamento |
| GET | `/schedules/allSchedules` | Listar todos os agendamentos (paginado) |
| GET | `/schedules/schedule/:id` | Obter agendamento por ID |
| GET | `/schedules/allActiveSchedules` | Listar agendamentos ativos (paginado) |
| PATCH | `/schedules/updateSchedule/:id` | Atualizar agendamento |
| PATCH | `/schedules/removeSchedule/:id` | Remover/Marcar agendamento como removido |

**Nota**: Todos os endpoints (exceto `/auth/login`) requerem autenticação com JWT.

## 📋 Autenticação

## 📚 Módulos Principais

### Auth Module

Gerencia autenticação, autorização e controle de acesso:

- Login com email e senha
- Geração de JWT access tokens e refresh tokens
- Guards para proteção de rotas
- Hash de senhas com bcrypt

### Users Module

CRUD completo de usuários:

- Criação, leitura, atualização e exclusão de usuários
- Controle de roles (Admin, etc.)
- Validação de dados com class-validator

### Exams Module

Gerenciamento de exames médicos:

- Cadastro de exames com especialidade, preparação e duração
- Seeds para popular dados iniciais
- Relacionamento com agendamentos

### Schedules Module

Sistema de agendamentos:

- Criação de agendamentos vinculando usuários e exames
- Controle de data, hora e status
- Informações adicionais do paciente

## 🔧 Configurações

A aplicação utiliza:

- **ValidationPipe global**: Validação automática de DTOs
- **CORS habilitado**: Configurado para aceitar requisições do frontend
- **Cookie Parser**: Para gerenciamento de cookies de autenticação
- **Cache Interceptor**: Para otimização de performance
- **Helmet**: Middleware de segurança HTTP para proteção contra vulnerabilidades comuns

## 🌱 Seeds

O projeto inclui scripts de seed para popular o banco de dados com dados iniciais:

### Seed de Exames (`seed:exams`)
Popula o banco com exames médicos pré-configurados. Não requer configuração adicional.

### Seed de Usuário (`seed:user`)
Cria um usuário inicial no sistema. Requer as seguintes variáveis de ambiente configuradas no `.env`:

- `SEED_NAME`: Nome completo do usuário
- `SEED_EMAIL`: Email do usuário (deve ser único)
- `SEED_PASSWORD`: Senha do usuário (será hasheada automaticamente)
- `SEED_ROLE`: Role do usuário (ex: `ADMIN`, `USER`)
- `SEED_AVATAR`: URL do avatar (opcional)
- `SEED_STATUS`: Status do usuário (`true` ou `false`)

**Nota**: O seed verifica se o usuário já existe antes de criar. Se o email já estiver cadastrado, o seed não criará um novo usuário.

## � Deployment com PM2

O projeto está configurado para rodar em produção com PM2 (Process Manager 2):

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Compilar e iniciar com PM2
pnpm run build
pm2 start ecosystem.config.js --env production

# Monitorar processos
pm2 monit

# Ver logs
pm2 logs aspect_hospitalar_api

# Parar a aplicação
pm2 stop aspect_hospitalar_api

# Reiniciar a aplicação
pm2 restart aspect_hospitalar_api
```

**Configuração PM2**:
- Memory limit: 512MB
- Auto-restart: Ativado
- Logs: Armazenados em `./logs/`
- Kill timeout: 5 segundos
- Listen timeout: 5 segundos

## 🔄 Atualizações Recentes (v0.0.2)

- ✅ Adicionado módulo `plans` com endpoints de criação e listagem de planos
- ✅ Endpoint público de registro `POST /auth/signup` adicionado
- ✅ Ajustes nas rotas de `schedules`: `updateSchedule/:id` e `removeSchedule/:id`
- ✅ Correções na documentação de endpoints e exemplos
- ✅ Bump de versão para `v0.0.2`

## �📄 Licença

Este projeto é privado e não possui licença pública.

## 👥 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com a equipe de
desenvolvimento.
