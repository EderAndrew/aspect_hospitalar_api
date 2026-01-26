# Aspect Hospitalar API

API REST desenvolvida em NestJS para gerenciamento de sistema hospitalar, incluindo controle de usuários, exames médicos e agendamentos.

## 📋 Sobre o Projeto

A **Aspect Hospitalar API** é uma aplicação backend que fornece endpoints para gerenciar operações de um sistema hospitalar, permitindo:

- **Autenticação e Autorização**: Sistema de login com JWT, refresh tokens e controle de acesso baseado em roles
- **Gestão de Usuários**: CRUD completo de usuários com diferentes níveis de permissão (Admin, etc.)
- **Gestão de Exames**: Cadastro e gerenciamento de exames médicos com informações detalhadas (especialidade, preparação, duração)
- **Agendamentos**: Sistema de agendamento que relaciona pacientes, exames e usuários, com controle de status e informações adicionais

## 🛠️ Tecnologias Utilizadas

### Core Framework
- **[NestJS](https://nestjs.com/)** (v11.0.1) - Framework Node.js progressivo para construção de aplicações server-side eficientes e escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** (v5.7.3) - Superset do JavaScript com tipagem estática

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[TypeORM](https://typeorm.io/)** (v0.3.28) - ORM para TypeScript e JavaScript
- **[@nestjs/typeorm](https://docs.nestjs.com/techniques/database)** (v11.0.0) - Módulo TypeORM para NestJS

### Autenticação e Segurança
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication)** (v11.0.2) - Módulo JWT para NestJS
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** (v6.0.0) - Biblioteca para hash de senhas
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** (v1.4.7) - Middleware para parsing de cookies

### Validação e Transformação
- **[class-validator](https://github.com/typestack/class-validator)** (v0.14.3) - Validação de DTOs usando decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** (v0.5.1) - Transformação de objetos e classes

### Configuração e Ambiente
- **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** (v4.0.2) - Módulo de configuração do NestJS

### Cache
- **[@nestjs/cache-manager](https://docs.nestjs.com/techniques/caching)** (v3.1.0) - Sistema de cache para NestJS
- **[cache-manager](https://www.npmjs.com/package/cache-manager)** (v7.2.8) - Gerenciador de cache

### Desenvolvimento
- **[ESLint](https://eslint.org/)** (v9.18.0) - Linter para JavaScript/TypeScript
- **[Prettier](https://prettier.io/)** (v3.4.2) - Formatador de código
- **[Jest](https://jestjs.io/)** (v30.0.0) - Framework de testes
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

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
DB_SYNC=true
DB_AUTOLOAD_ENTITIES=true

# JWT
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=seu_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3001
FRONTEND_URL=http://localhost:3000
```

4. Execute as migrations/seeds (se necessário):
```bash
pnpm run seed:exams
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

A API estará disponível em `http://localhost:3001` (ou na porta configurada no `.env`)

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
- `pnpm run seed:exams` - Executa seed de exames

## 🔐 Autenticação

A API utiliza autenticação baseada em JWT com refresh tokens armazenados em cookies HTTP-only:

- **Login**: `POST /auth/login` - Autentica o usuário e retorna tokens
- **Refresh**: `POST /auth/refresh` - Renova os tokens de acesso
- **Logout**: `POST /auth/logout` - Remove os cookies de autenticação

Os tokens são enviados via cookies seguros para maior proteção contra ataques XSS.

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

## 📄 Licença

Este projeto é privado e não possui licença pública.

## 👥 Contribuindo

Este é um projeto privado. Para contribuições, entre em contato com a equipe de desenvolvimento.
