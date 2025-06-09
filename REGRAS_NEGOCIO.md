# Regras de Negócio Implementadas

Este documento descreve as regras de negócio implementadas no Sistema de Reservas INTELI.

## 1. Regras de Autenticação

### 1.1 Domínio de Email Obrigatório
- **Regra**: Somente será permitido o cadastramento e o login de emails que tiverem o domínio `@sou.inteli.edu.br`
- **Implementação**: 
  - Validação no backend nos controladores `AuthController.js` e rotas web
  - Validação no frontend com pattern HTML5 nas views de login e registro
  - Mensagem de erro específica para domínios não permitidos

### 1.2 Arquivos Modificados
- `controllers/AuthController.js` - Validação de domínio no registro e login
- `routes/webRoutes.js` - Validação de domínio nas rotas web
- `views/register.ejs` - Campo de email com validação e placeholder
- `views/login.ejs` - Campo de email com validação e placeholder

## 2. Regras de Reserva

### 2.1 Restrição de Data
- **Regra**: Só será possível o usuário realizar uma reserva para o mesmo dia
- **Implementação**: 
  - Campo de data fixado para o dia atual
  - Validação no backend que rejeita datas diferentes do dia atual
  - Campo readonly no frontend

### 2.2 Antecedência Máxima
- **Regra**: Reservas podem ser feitas com até 30 dias de antecedência
- **Implementação**: 
  - Validação no backend que verifica se a data não excede 30 dias
  - Nota: Esta regra está implementada mas não é aplicável devido à regra 2.1

### 2.3 Duração da Reserva
- **Regra**: 
  - Duração mínima: 30 minutos
  - Duração máxima: 2 horas
- **Implementação**:
  - Validação no backend que calcula a diferença entre horários
  - Validação no frontend com JavaScript
  - Mensagens de erro específicas para cada caso

### 2.4 Cancelamento com Antecedência
- **Regra**: Cancelamentos devem ser feitos com pelo menos 1 hora de antecedência
- **Implementação**:
  - Validação no backend que compara o horário atual com o horário da reserva
  - Aplicado tanto na API quanto nas rotas web
  - Mensagem de erro específica

### 2.5 Número de Participantes Obrigatório
- **Regra**: É obrigatório informar o número real de participantes
- **Implementação**:
  - Campo obrigatório no formulário
  - Validação de número positivo
  - Verificação de capacidade da sala
  - Texto explicativo no formulário

### 2.6 Arquivos Modificados
- `utils/bookingValidations.js` - Nova classe com todas as validações
- `controllers/BookingController.js` - Integração das validações
- `routes/webRoutes.js` - Validações nas rotas web
- `models/Database.js` - Validações no modelo de dados
- `views/booking-create.ejs` - Validações no frontend e melhorias na UX

## 3. Estrutura de Validação

### 3.1 Classe BookingValidations
Criada uma classe utilitária (`utils/bookingValidations.js`) que centraliza todas as validações:

- `validateReservationDate()` - Valida datas de reserva
- `validateReservationDuration()` - Valida duração da reserva
- `validateCancellation()` - Valida cancelamentos
- `validateAttendees()` - Valida número de participantes
- `validateBooking()` - Validação completa de uma reserva

### 3.2 Integração
As validações são aplicadas em múltiplas camadas:
- **Frontend**: Validação HTML5 e JavaScript para UX
- **Rotas Web**: Validação nas rotas web com flash messages
- **API**: Validação nos controladores da API
- **Modelo**: Validação final no modelo de dados

## 4. Testes

### 4.1 Testes Automatizados
- Criado arquivo `tests/bookingValidations.test.js` com 16 testes
- Cobertura completa de todas as regras de validação
- Todos os testes passando com sucesso

### 4.2 Executar Testes
```bash
npm test
```

## 5. Dependências Adicionadas

- `moment` - Para manipulação de datas e horários
- `jest` (dev) - Para execução dos testes

## 6. Melhorias na UX

### 6.1 Formulário de Reserva
- Data fixada para o dia atual (readonly)
- Textos explicativos para cada regra
- Validação em tempo real no frontend
- Mensagens de erro claras e específicas

### 6.2 Formulários de Autenticação
- Placeholder com exemplo de email válido
- Texto explicativo sobre o domínio obrigatório
- Validação HTML5 com pattern

## 7. Compatibilidade

Todas as implementações são compatíveis com:
- Sistema existente de autenticação
- Banco de dados atual
- Interface web existente
- API REST existente

As regras foram implementadas de forma não-destrutiva, mantendo a funcionalidade existente e adicionando as novas validações.
