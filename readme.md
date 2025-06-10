# Sistema de Reservas INTELI

## Visão Geral

Este projeto é um sistema web completo para reserva de salas do INTELI, desenvolvido com Node.js, Express e EJS. O sistema permite que usuários se cadastrem, façam login, visualizem salas disponíveis, realizem reservas e as cancelem quando necessário.

## Funcionalidades

- **Autenticação de Usuários**
  - Cadastro de novos usuários
  - Login com email e senha
  - Gerenciamento de perfil

- **Gerenciamento de Salas**
  - Visualização de todas as salas disponíveis no INTELI
  - Detalhes de cada sala (capacidade, localização, recursos)
  - Filtro de salas por capacidade e recursos

- **Reservas**
  - Criação de novas reservas
  - Visualização de reservas ativas e históricas
  - Cancelamento de reservas
  - Verificação de disponibilidade em tempo real

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Frontend**: EJS, Bootstrap, JavaScript
- **Autenticação**: JWT (JSON Web Tokens)
- **Persistência**: Sistema de arquivos local (JSON)

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (versão 6 ou superior)

## Instalação

1. Clone o repositório ou extraia o arquivo zip
2. Navegue até a pasta do projeto
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

5. Acesse o sistema em seu navegador:

```
http://localhost:3000
```

## Estrutura do Projeto

- **controllers/**: Lógica de negócio
- **data/**: Arquivos JSON para persistência de dados
- **middlewares/**: Middlewares de autenticação e autorização
- **models/**: Camada de acesso a dados
- **public/**: Arquivos estáticos (CSS, JavaScript, imagens)
- **routes/**: Definição de rotas da API e web
- **views/**: Templates EJS para renderização das páginas

## Usuários Administradores Padrão

O sistema é inicializado com usuários administradores padrão:

### Administrador Principal

- **Email**: `admin@inteli.edu.br`
- **Senha**: `admin123`

### Administrador INTELI (Domínio Estudantil)

- **Email**: `admin@sou.inteli.edu.br`
- **Senha**: `admin123`

## Endpoints da API

### Autenticação
- `POST /api/auth/register`: Cadastro de novo usuário
- `POST /api/auth/login`: Login de usuário
- `GET /api/auth/verify`: Verificação de token JWT
- `GET /api/auth/profile`: Obtenção de perfil do usuário
- `PUT /api/auth/profile`: Atualização de perfil do usuário

### Salas
- `GET /api/rooms`: Lista todas as salas
- `GET /api/rooms/:id`: Obtém detalhes de uma sala específica
- `GET /api/rooms/capacity`: Filtra salas por capacidade
- `GET /api/rooms/resources`: Filtra salas por recursos disponíveis
- `POST /api/rooms`: Cria uma nova sala (apenas admin)
- `PUT /api/rooms/:id`: Atualiza uma sala (apenas admin)
- `DELETE /api/rooms/:id`: Exclui uma sala (apenas admin)

### Reservas
- `GET /api/bookings`: Lista todas as reservas do usuário
- `GET /api/bookings/:id`: Obtém detalhes de uma reserva específica
- `GET /api/bookings/user/:user_id`: Lista reservas de um usuário específico
- `GET /api/bookings/room/:room_id`: Lista reservas de uma sala específica
- `GET /api/bookings/date/:date`: Lista reservas de uma data específica
- `GET /api/bookings/check-availability`: Verifica disponibilidade de sala
- `POST /api/bookings`: Cria uma nova reserva
- `PUT /api/bookings/:id`: Atualiza uma reserva
- `PATCH /api/bookings/:id/status`: Atualiza o status de uma reserva
- `DELETE /api/bookings/:id`: Cancela uma reserva

## Rotas Web

- `/`: Página inicial
- `/login`: Página de login
- `/register`: Página de cadastro
- `/logout`: Rota de logout
- `/profile`: Página de perfil do usuário
- `/rooms`: Listagem de salas disponíveis
- `/rooms/:id`: Detalhes de uma sala específica
- `/bookings`: Listagem de reservas do usuário
- `/bookings/create`: Página de criação de reserva
- `/bookings/:id`: Detalhes de uma reserva específica
- `/bookings/:id/cancel`: Rota para cancelamento de reserva

## Observações

- O sistema utiliza persistência em arquivos JSON localizados na pasta `data/`
- As salas disponíveis são baseadas nas salas reais do INTELI
- O sistema implementa autenticação JWT para proteção das rotas
- Todas as operações de reserva verificam disponibilidade em tempo real