# Enterprise Manager

Sistema web para gerenciamento de empreendimentos de Santa Catarina.
Construído com React e TypeScript seguindo os princípios de Clean Architecture.

---

## Descrição da Solução

O **Enterprise Manager** é uma aplicação front-end que permite o cadastro, edição, exclusão e consulta de empreendimentos, além de oferecer um painel de relatórios com estatísticas agregadas. Os dados são persistidos no `localStorage` do navegador, simulando chamadas assíncronas com delay de 200 ms para reproduzir o comportamento de uma API real.

### Funcionalidades principais

- **Autenticação** — login com hash SHA-256 (Web Crypto API) e sessão armazenada em `sessionStorage`. Rotas protegidas redirecionam usuários não autenticados.
- **CRUD de Empreendimentos** — criação, listagem, edição e exclusão com validação de formulário. Busca e filtragem em tempo real por nome, proprietário, cidade e setor.
- **Relatórios** — painel com total de empreendimentos, proporção ativos/inativos, distribuição por setor, distribuição por cidade e total de colaboradores.
- **Seed de dados** — na primeira execução, o sistema cria um usuário administrador (`admin` / `123`) e quatro empreendimentos de exemplo.

---

## Tecnologias Utilizadas

| Categoria   | Tecnologia                 | Versão |
| ----------- | -------------------------- | ------ |
| Linguagem   | TypeScript                 | ~5.9   |
| UI          | React                      | 19     |
| Bundler     | Vite                       | 7      |
| Estilização | Tailwind CSS               | 4      |
| Roteamento  | React Router               | 7      |
| Ícones      | Lucide React               | 0.577  |
| Testes      | Vitest + Happy DOM         | 4 / 20 |
| Linting     | ESLint + typescript-eslint | 9 / 8  |

---

## Estrutura do Projeto

O código fonte está organizado em quatro camadas dentro de `src/`:

```
src/
├── domain/                  # Camada de Domínio
│   ├── entities/            #   Entidades (Enterprise, User) e tipos
│   └── repositories/        #   Interfaces de repositório (contratos)
│
├── infrastructure/          # Camada de Infraestrutura
│   ├── storage/             #   Adapter genérico para localStorage
│   ├── repositories/        #   Implementações concretas dos repositórios
│   └── seed.ts              #   Dados iniciais (admin + empreendimentos)
│
├── services/                # Camada de Serviços
│   ├── auth/                #   Autenticação (login, logout, sessão)
│   ├── enterprise/          #   Lógica de negócio de empreendimentos
│   └── CryptoService.ts     #   Hash de senha e geração de UUID
│
├── presentation/            # Camada de Apresentação
│   ├── components/          #   Componentes reutilizáveis (Button, Input, Modal, Select)
│   ├── contexts/            #   Contexto de autenticação (AuthContext)
│   ├── hooks/               #   Custom hooks (useAuth)
│   ├── layouts/             #   Layout principal com sidebar responsiva
│   ├── pages/               #   Páginas (Home, Login, Empreendimentos, Relatórios)
│   └── routes/              #   Definição de rotas e proteção de rotas
│
├── App.tsx                  # Componente raiz
└── main.tsx                 # Ponto de entrada
```

### Padrões de projeto adotados

- **Repository Pattern** — abstrai o acesso a dados por meio de interfaces no domínio.
- **Adapter Pattern** — `LocalStorageAdapter` encapsula o `localStorage` com API assíncrona genérica.
- **Service Layer** — centraliza a lógica de negócio fora da camada de apresentação.
- **Context API + Custom Hook** — gerenciamento de estado global de autenticação.
- **DTO Pattern** — objetos de transferência separados das entidades de domínio.

---

## Instruções para Execução

### Pré-requisitos

- **Node.js** ≥ 20.19.0
- **npm** (incluído com o Node.js)

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd StartupManager

# Instale as dependências
npm install
```

### Comandos disponíveis

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Lint
npm run lint
```

### Acesso

Após iniciar o servidor de desenvolvimento, acesse `http://localhost:5173` e faça login com as credenciais padrão:

| Campo   | Valor   |
| ------- | ------- |
| Usuário | `admin` |
| Senha   | `123`   |

---

### Link para o vídeo pitch

https://youtu.be/kIo4YTX-qC8
