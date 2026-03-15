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
