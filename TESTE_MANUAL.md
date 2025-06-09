# Teste Manual das Regras de Negócio

Este documento fornece um guia para testar manualmente todas as regras de negócio implementadas.

## 1. Preparação

1. Execute o servidor:
```bash
npm start
```

2. Acesse: http://localhost:3000

## 2. Teste de Validação de Email

### 2.1 Teste de Registro com Email Inválido

1. Acesse `/register`
2. Tente registrar com emails inválidos:
   - `usuario@gmail.com`
   - `teste@inteli.edu.br`
   - `exemplo@sou.inteli.com`

**Resultado Esperado**: Erro "Apenas emails do domínio @sou.inteli.edu.br são permitidos"

### 2.2 Teste de Registro com Email Válido

1. Acesse `/register`
2. Registre com email válido:
   - `teste@sou.inteli.edu.br`

**Resultado Esperado**: Registro bem-sucedido

### 2.3 Teste de Login com Email Inválido

1. Acesse `/login`
2. Tente fazer login com email inválido:
   - `usuario@gmail.com`

**Resultado Esperado**: Erro "Apenas emails do domínio @sou.inteli.edu.br são permitidos"

## 3. Teste de Validação de Reservas

### 3.1 Teste de Data (Mesmo Dia)

1. Faça login com usuário válido
2. Acesse `/bookings/create`
3. Observe que o campo de data está:
   - Fixado para hoje
   - Readonly (não editável)

**Resultado Esperado**: Apenas data atual disponível

### 3.2 Teste de Duração Mínima

1. No formulário de reserva, configure:
   - Horário início: 09:00
   - Horário fim: 09:15 (15 minutos)
2. Tente submeter

**Resultado Esperado**: Erro "A duração mínima da reserva é de 30 minutos"

### 3.3 Teste de Duração Máxima

1. No formulário de reserva, configure:
   - Horário início: 09:00
   - Horário fim: 12:00 (3 horas)
2. Tente submeter

**Resultado Esperado**: Erro "A duração máxima da reserva é de 2 horas (120 minutos)"

### 3.4 Teste de Duração Válida

1. No formulário de reserva, configure:
   - Horário início: 09:00
   - Horário fim: 10:30 (1h30min)
2. Preencha outros campos obrigatórios
3. Submeta

**Resultado Esperado**: Reserva criada com sucesso

### 3.5 Teste de Participantes Obrigatório

1. No formulário de reserva:
2. Deixe o campo "Número de Participantes" vazio
3. Tente submeter

**Resultado Esperado**: Erro de campo obrigatório

### 3.6 Teste de Participantes Zero

1. No formulário de reserva:
2. Configure participantes como 0
3. Tente submeter

**Resultado Esperado**: Erro "É obrigatório informar um número válido de participantes"

### 3.7 Teste de Capacidade da Sala

1. Selecione uma sala com capacidade limitada (ex: 10 pessoas)
2. Configure participantes como 15
3. Tente submeter

**Resultado Esperado**: Erro "O número de participantes (15) excede a capacidade da sala (10)"

## 4. Teste de Cancelamento

### 4.1 Teste de Cancelamento com Antecedência Insuficiente

**Nota**: Este teste requer uma reserva existente para horário próximo.

1. Crie uma reserva para daqui a 30 minutos
2. Tente cancelar a reserva
3. Acesse `/bookings/{id}` e clique em cancelar

**Resultado Esperado**: Erro "Cancelamentos devem ser feitos com pelo menos 60 minutos (1 hora) de antecedência"

### 4.2 Teste de Cancelamento com Antecedência Suficiente

1. Crie uma reserva para daqui a 2 horas
2. Tente cancelar a reserva
3. Acesse `/bookings/{id}` e clique em cancelar

**Resultado Esperado**: Cancelamento bem-sucedido

## 5. Teste de Validação Frontend

### 5.1 Validação HTML5 de Email

1. Acesse `/register` ou `/login`
2. Digite um email sem @sou.inteli.edu.br
3. Observe a validação do navegador

**Resultado Esperado**: Mensagem de validação HTML5

### 5.2 Validação JavaScript de Duração

1. Acesse `/bookings/create`
2. Configure horários inválidos (ex: início 10:00, fim 09:00)
3. Tente submeter

**Resultado Esperado**: Alert JavaScript impedindo submissão

## 6. Teste da API

### 6.1 Teste via cURL - Registro com Email Inválido

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@gmail.com",
    "password": "123456"
  }'
```

**Resultado Esperado**: 
```json
{
  "success": false,
  "message": "Apenas emails do domínio @sou.inteli.edu.br são permitidos"
}
```

### 6.2 Teste via cURL - Reserva com Duração Inválida

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "roomId": 1,
    "date": "2024-01-15",
    "startTime": "09:00",
    "endTime": "09:15",
    "purpose": "Teste",
    "attendees": 5
  }'
```

**Resultado Esperado**: 
```json
{
  "success": false,
  "message": "A duração mínima da reserva é de 30 minutos"
}
```

## 7. Verificação dos Testes Automatizados

Execute os testes para verificar todas as validações:

```bash
npm test
```

**Resultado Esperado**: Todos os 16 testes devem passar

## 8. Checklist de Validação

- [ ] Email inválido rejeitado no registro
- [ ] Email inválido rejeitado no login
- [ ] Email válido aceito
- [ ] Data fixada para hoje
- [ ] Duração < 30min rejeitada
- [ ] Duração > 2h rejeitada
- [ ] Duração válida aceita
- [ ] Participantes = 0 rejeitado
- [ ] Participantes > capacidade rejeitado
- [ ] Cancelamento < 1h rejeitado
- [ ] Cancelamento > 1h aceito
- [ ] Validação frontend funcionando
- [ ] Validação API funcionando
- [ ] Testes automatizados passando
