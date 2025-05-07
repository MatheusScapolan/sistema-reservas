# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Nome do Projeto

#### Autor do projeto

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução:

&nbsp;&nbsp;&nbsp;&nbsp;No contexto inovador do INTELI – Instituto de Tecnologia e Liderança –, onde os projetos acadêmicos refletem diretamente os desafios e demandas do mundo real, este projeto individual propõe o desenvolvimento de um sistema web voltado à reserva de salas para agendamentos. A proposta busca atender, de forma direta, uma necessidade recorrente vivida por alunos da instituição: o uso eficiente, organizado e transparente dos espaços compartilhados no campus.

&nbsp;&nbsp;&nbsp;&nbsp;A plataforma será inteiramente desenvolvida como uma aplicação web responsiva, permitindo que usuários visualizem em tempo real a disponibilidade das salas, façam reservas com base em critérios personalizados (como horário, capacidade, e recursos da sala, como projetores ou lousas) e tenham controle centralizado sobre suas reservas. Isso garante não apenas agilidade no processo, mas também evita conflitos de agendamento e amplia a autonomia dos usuários.

&nbsp;&nbsp;&nbsp;&nbsp;Num primeiro momento, o escopo do projeto será focado em uma implementação funcional básica com banco de dados relacional, backend com APIs REST e frontend interativo. A visão a longo prazo, no entanto, é que o sistema possa ser adotado pelo próprio INTELI como solução para a gestão das salas de reunião existentes em seu campus. Com uma infraestrutura acadêmica moderna de mais de 10 mil m² e múltiplos espaços de convivência, estudo e trabalho colaborativo, a instituição demanda soluções tecnológicas sob medida que acompanhem sua missão de formar líderes através da inovação.
Assim, o projeto alia teoria, prática e propósito institucional, promovendo impacto real e potencial de escalabilidade. Mais que um exercício acadêmico, trata-se de uma aplicação com valor tangível e pronta para ser apresentada como case em processos seletivos e oportunidades profissionais.


---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas:

<div align="center">
<sub>Figura 01 - Persona 01
<br>
<br>
  
![Figura 01 - Persona 01](./assets/personas/persona_01.png)
  
<sup>Fonte: Material produzido pelo autor (2025)
</div>
<br>

### 2.2. User Stories:

&nbsp;&nbsp;&nbsp;&nbsp;**US01 |** Como estudante do INTELI, quero visualizar em tempo real a disponibilidade das salas, para que eu possa escolher um horário conveniente sem risco de conflito com outras reservas.

&nbsp;&nbsp;&nbsp;&nbsp;**US02 |** Como usuário do sistema, quero realizar reservas filtrando por data, horário, capacidade da sala e recursos disponíveis, para que eu encontre um ambiente adequado às necessidades da minha reunião ou estudo em grupo.

&nbsp;&nbsp;&nbsp;&nbsp;**US03 |** Como estudante, quero acessar uma área pessoal com minhas reservas futuras e passadas, para que eu possa acompanhar, modificar ou cancelar agendamentos conforme minhas demandas mudam.

<br>

**Análise INVEST – User Story US02:**

&nbsp;&nbsp;&nbsp;&nbsp;**US02 |** Como usuário do sistema, quero realizar reservas filtrando por data, horário, capacidade da sala e recursos disponíveis, para que eu encontre um ambiente adequado às necessidades da minha reunião ou estudo em grupo.


&nbsp;&nbsp;&nbsp;&nbsp;**I – Independente:**
Essa User Story pode ser implementada de forma isolada, sem depender diretamente da criação da área pessoal ou visualização de histórico. O filtro e a reserva são funcionalidades autônomas que não exigem que outras partes estejam completamente prontas para funcionar.

&nbsp;&nbsp;&nbsp;&nbsp;**N – Negociável:**
O escopo da filtragem pode ser discutido com os stakeholders. É possível negociar, por exemplo, quais filtros serão priorizados (capacidade, data, recursos, hora) ou se todos precisam estar disponíveis logo na entrega final.

&nbsp;&nbsp;&nbsp;&nbsp;**V – Valiosa:**
Essa funcionalidade agrega valor direto ao usuário, pois garante que ele possa reservar um espaço adequado às suas necessidades. Isso evita frustrações com salas inadequadas e melhora a experiência geral do sistema.

&nbsp;&nbsp;&nbsp;&nbsp;**E – Estimável:**
É possível estimar com clareza o esforço necessário para desenvolver essa funcionalidade. A complexidade pode ser dividida entre a criação do frontend dos filtros, a lógica no backend e a estrutura de dados necessária no banco.

&nbsp;&nbsp;&nbsp;&nbsp;**S – Pequena (Small):**
A User Story é suficientemente pequena para ser entregue em um único ciclo de desenvolvimento. Caso necessário, pode até ser decomposta (ex: primeiro implementar filtro por data e horário, depois adicionar por capacidade e recursos).

&nbsp;&nbsp;&nbsp;&nbsp;**T – Testável:**
É possível validar se a funcionalidade está funcionando corretamente através de testes simples: selecionar filtros específicos e verificar se as salas exibidas condizem com os critérios escolhidos.

---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados:

&nbsp;&nbsp;&nbsp;&nbsp;O sistema de reservas foi modelado considerando os principais atores (usuários) e as funcionalidades centrais (reserva de salas com recursos). A modelagem contempla 5 entidades principais:

- Users (Usuários que interagem com o sistema);

- Rooms (Salas disponíveis para reserva);

- Bookings (Reservas realizadas);

- Room_Resources (Recursos adicionais presentes nas salas);

- BookingHistory (Histórico de alterações das reservas).

**Modelo Lógico (Relacional):**

&nbsp;&nbsp;&nbsp;&nbsp;As relações entre as entidades estão representadas da seguinte forma:

``` text
[Users] -----< [Bookings] >----- [Rooms] -----< [Room_Resources]
                       |
               [BookingHistory]

```

- Um usuário pode fazer várias reservas;

- Uma sala pode ter várias reservas e múltiplos recursos;

- Cada reserva pode ter alterações registradas no histórico.

**Modelo Físico (DDL - Script SQL):**

&nbsp;&nbsp;&nbsp;&nbsp;Abaixo está o schema completo do banco de dados, pronto para ser executado no Supabase ou em qualquer banco PostgreSQL:

``` sql
-- 1. Tabela de Usuários
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Armazenar preferencialmente como hash
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Salas
CREATE TABLE Rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    capacity INTEGER,
    has_projector BOOLEAN DEFAULT false,
    has_whiteboard BOOLEAN DEFAULT false,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Reservas
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES Rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Recursos Complementares das Salas
CREATE TABLE Room_Resources (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES Rooms(id) ON DELETE CASCADE,
    resource_name VARCHAR(100) NOT NULL
);

-- 5. Tabela de Histórico de Reservas
CREATE TABLE BookingHistory (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES Bookings(id) ON DELETE CASCADE,
    changed_by_user_id INTEGER REFERENCES Users(id) ON DELETE SET NULL,
    change_type VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Diagrama Relacional (ERD):**

<div align="center">
<sub>Figura 02 - Diagrama Relacional
<br>
<br>
  
![Figura 02 - Modelo Relacional - Banco de Dados](./assets/diagrama_relacional/modelo-banco.png)
  
<sup>Fonte: Material produzido pelo autor (2025)
</div>
<br>

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

<br>

### 3.3. Wireframes (Semana 03)

&nbsp;&nbsp;&nbsp;&nbsp;Os wireframes a seguir representam a estrutura e o fluxo das principais telas do Sistema de Reserva de Salas, projetadas para atender às funcionalidades descritas nas User Stories (US) do projeto. Eles focam na disposição dos elementos, navegação e funcionalidades centrais, utilizando um estilo visual de baixa/média fidelidade, sem detalhamento de design final, conforme exemplos de referência.

<br>

**Relação dos Wireframes com as User Stories:**

*   **US01 (Visualizar disponibilidade):** Atendida principalmente pela "Tela Principal / Dashboard" e pela "Tela de Busca Avançada e Listagem de Salas".


*   **US02 (Realizar reservas com filtros):** Atendida pela "Tela de Busca Avançada e Listagem de Salas" e pela "Tela de Detalhes da Sala e Confirmação de Reserva".


*   **US03 (Acessar e gerenciar reservas pessoais):** Atendida pela "Tela de Minhas Reservas", "Tela de Modificação de Reserva" e pelo "Modal de Confirmação de Ação" para cancelamentos.

<br>

**Wireframes das Telas Principais:**

**1. Tela Principal / Dashboard**

*   **Descrição:** Apresenta uma visão geral da disponibilidade das salas (através de um calendário ou lista) e acesso rápido às principais funcionalidades como nova reserva e gerenciamento de reservas existentes. Atende principalmente à US01.
*   **Imagem:**
    ![Wireframe Tela Principal](./assets/wireframes/visual_wireframe_tela_principal.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

**2. Tela de Busca Avançada e Listagem de Salas**

*   **Descrição:** Permite ao usuário filtrar salas por data, horário, capacidade e recursos, exibindo uma lista das salas disponíveis que correspondem aos critérios. Atende à US01 e US02.
*   **Imagem:**
    ![Wireframe Busca Avançada](./assets/wireframes/visual_wireframe_busca_avancada.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

**3. Tela de Detalhes da Sala e Confirmação de Reserva**

*   **Descrição:** Exibe informações detalhadas de uma sala específica e permite ao usuário confirmar uma reserva para um horário selecionado. Atende à US02.
*   **Imagem:**
    ![Wireframe Detalhes da Sala e Reserva](./assets/wireframes/visual_wireframe_detalhes_reserva.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

**4. Tela de Minhas Reservas**

*   **Descrição:** Permite ao usuário visualizar suas reservas futuras e seu histórico de reservas, além de iniciar ações como modificar ou cancelar agendamentos. Atende à US03.
*   **Imagem:**
    ![Wireframe Minhas Reservas](./assets/wireframes/visual_wireframe_minhas_reservas.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

**5. Tela de Modificação de Reserva**

*   **Descrição:** Permite ao usuário alterar os detalhes de uma reserva futura existente, como data e horário, verificando a nova disponibilidade. Atende à US03.
*   **Imagem:**
    ![Wireframe Modificar Reserva](./assets/wireframes/visual_wireframe_modificar_reserva.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

**6. Modal de Confirmação de Ação**

*   **Descrição:** Um modal genérico para confirmar ações críticas, como o cancelamento de uma reserva. Relevante para a US03.
*   **Imagem:**
    ![Wireframe Modal de Confirmação](./assets/wireframes/visual_wireframe_confirmacao_modal.png)
    *Fonte: Material produzido pelo autor (2025)*

<br>

### 3.4. Guia de estilos (Semana 05)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---
