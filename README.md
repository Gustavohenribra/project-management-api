
# API de Gerenciamento de Projetos

Esta API oferece funcionalidades para gerenciar usuários, projetos e ações associadas, como adicionar membros, remover membros e gerar relatórios. A API é construída usando **NestJS**, **TypeORM** e **SQLite**.

## Funcionalidades

- Autenticação de usuários e controle de acesso baseado em papéis (autenticação JWT).
- Operações CRUD para usuários e projetos.
- Adição e remoção de membros em projetos.
- Registro de atividades para ações em projetos.
- Geração de relatórios em PDF para projetos.

## Instalação

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Endpoints

### Autenticação

#### Registrar Usuário

- **Método:** POST
- **URL:** `/api/auth/register`
- **Corpo:** 
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "user"
  }
  ```
- **Resposta:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
  ```

#### Login

- **Método:** POST
- **URL:** `/api/auth/login`
- **Corpo:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Resposta:**
  ```json
  {
    "access_token": "your.jwt.token"
  }
  ```

### Usuários

#### Listar Todos os Usuários

- **Método:** GET
- **URL:** `/api/users`
- **Resposta:**
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "user"
    }
  ]
  ```

#### Buscar Usuário por ID

- **Método:** GET
- **URL:** `/api/users/:id`
- **Resposta:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
  ```

#### Atualizar Usuário

- **Método:** PUT
- **URL:** `/api/users/:id`
- **Corpo:**
  ```json
  {
    "name": "John Atualizado"
  }
  ```
- **Resposta:** `200 OK`

#### Deletar Usuário

- **Método:** DELETE
- **URL:** `/api/users/:id`
- **Resposta:** `200 OK`

### Projetos

#### Criar Projeto

- **Método:** POST
- **URL:** `/api/projects`
- **Cabeçalhos:** `Authorization: Bearer <your.jwt.token>`
- **Corpo:**
  ```json
  {
    "name": "Project Alpha",
    "description": "Descrição do Project Alpha"
  }
  ```
- **Resposta:**
  ```json
  {
    "id": 1,
    "name": "Project Alpha",
    "description": "Descrição do Project Alpha",
    "status": "in_progress",
    "owner": {
      "id": 1,
      "name": "John Doe"
    },
    "members": []
  }
  ```

#### Listar Todos os Projetos

- **Método:** GET
- **URL:** `/api/projects`
- **Resposta:**
  ```json
  [
    {
      "id": 1,
      "name": "Project Alpha",
      "description": "Descrição do Project Alpha",
      "status": "in_progress",
      "owner": {
        "id": 1,
        "name": "John Doe"
      },
      "members": []
    }
  ]
  ```

#### Buscar Projeto por ID

- **Método:** GET
- **URL:** `/api/projects/:id`
- **Resposta:**
  ```json
  {
    "id": 1,
    "name": "Project Alpha",
    "description": "Descrição do Project Alpha",
    "status": "in_progress",
    "owner": {
      "id": 1,
      "name": "John Doe"
    },
    "members": []
  }
  ```

#### Atualizar Projeto

- **Método:** PUT
- **URL:** `/api/projects/:id`
- **Cabeçalhos:** `Authorization: Bearer <your.jwt.token>`
- **Corpo:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Resposta:** `200 OK`

#### Deletar Projeto

- **Método:** DELETE
- **URL:** `/api/projects/:id`
- **Cabeçalhos:** `Authorization: Bearer <your.jwt.token>`
- **Resposta:** `200 OK`

#### Adicionar Membro

- **Método:** POST
- **URL:** `/api/projects/:id/members`
- **Cabeçalhos:** `Authorization: Bearer <your.jwt.token>`
- **Corpo:**
  ```json
  {
    "userId": 2
  }
  ```
- **Resposta:** `200 OK`

#### Remover Membro

- **Método:** DELETE
- **URL:** `/api/projects/:id/members/:userId`
- **Cabeçalhos:** `Authorization: Bearer <your.jwt.token>`
- **Resposta:** `200 OK`

#### Gerar Relatório

- **Método:** GET
- **URL:** `/api/projects/:id/report`
- **Resposta:** Um arquivo PDF será baixado.

#### Obter Logs de Atividades

- **Método:** GET
- **URL:** `/api/projects/:id/logs`
- **Resposta:**
  ```json
  [
    {
      "id": 1,
      "action": "Projeto criado",
      "timestamp": "2025-01-07T20:36:54.000Z",
      "user": {
        "id": 1,
        "name": "John Doe"
      },
      "project": {
        "id": 1,
        "name": "Project Alpha"
      }
    }
  ]
  ```

## Controle de Acesso Baseado em Papéis

- **Admin**: Pode criar, atualizar e deletar qualquer projeto.
- **Usuário**: Pode gerenciar apenas projetos que criou ou dos quais é membro.

## Registro de Atividades

Todas as ações em projetos (criação, atualizações, alterações de membros) são registradas no log de atividades.

## Tratamento de Erros

Os erros precisam ser configurados corretamente para todas as rotas, apenas algumas estão com detalhes implementados, sinta-se livre para contribuir
