# Rotas da API

### Rotas de autenticação (GET)

#### /qrcode

Retorna QRCode para autenticação (1ª fase)

#### /authenticate

Faz a autenticação na Nubank (2ª fase)

### Rotas de dados (GET)

#### /account

Retorna os dados da conta

#### /card

Retorna o histórico de compras no cartão

#### /bill

Retorna as faturas do cartão

#### /bill/:date (date: YYYY-MM-DD)

Retorna a fatura especificada

#### /bill/detail/:date (date: YYYY-MM-DD)

Retorna informações mais detalhadas da fatura. Não é possível retornar
informações de faturas futuras.