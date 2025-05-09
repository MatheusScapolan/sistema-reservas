# Sistema de Reserva de Salas

## Descrição

Este projeto é um sistema web para reserva de salas, desenvolvido como parte do Projeto Individual Integrado do Módulo 2025-1B do INTELI. O objetivo é criar uma aplicação completa com banco de dados, backend e frontend para gerenciar o agendamento e uso de salas compartilhadas, aplicando os conceitos aprendidos no módulo.

A plataforma permitirá aos usuários visualizar a disponibilidade das salas em tempo real, fazer reservas com base em critérios como data, horário, capacidade e recursos, e gerenciar seus próprios agendamentos.

## Estrutura de Pastas e Arquivos

O projeto segue o padrão MVC (Model-View-Controller) para organização do código:

```
sistema-reservas/
│
├── assets/
│   └── personas/
│       └── persona_01.png
│   └── diagrama_relacional/
        └── modelo-banco.png
├── config/
│   └── database.js
├── controllers/
│   └── HomeController.js
├── models/
│   └── User.js
├── routes/
│   └── index.js
├── scripts/               # Arquivos de JavaScript públicos (client-side)
├── services/
│   └── userService.js
├── styles/                # Arquivos CSS públicos
├── tests/
│   └── example.test.js
├── .env.example
├── .gitattributes
├── .gitignore
├── jest.config.js
├── package-lock.json
├── package.json
├── readme.md              # Documentação do projeto (Este arquivo)
├── rest.http              # Arquivo para testes de API (opcional)
├── server.js              # Arquivo principal que inicializa o servidor
└── WAD.md                 # Documento da Aplicação Web
```

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Supabase](https://supabase.com/)
- [Jest](https://jestjs.io/) – para testes
- HTML, CSS e JavaScript

## 🚀 Como Executar o Projeto Localmente

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/MatheusScapolan/sistema-reservas.git
    cd sistema-reservas
    ```

2. **Instale as dependências:**
    ```bash
    npm install
    ```

3. **Configure as variáveis de ambiente:**
    * Copie o arquivo `.env.example` para `.env`:
        ```bash
        cp .env.example .env
        ```
    * Preencha as variáveis necessárias no `.env`:
        ```env
        SUPABASE_URL=https://sua-instancia.supabase.co
        SUPABASE_KEY=sua-chave-anon-ou-service-role
        PORT=3000
        ```

4. **Execute o servidor:**
    ```bash
    npm start
    ```
    *Alternativamente, você pode usar `node server.js`.*

O servidor estará rodando em `http://localhost:3000` (ou na porta definida no `server.js` ou no arquivo `.env`).
