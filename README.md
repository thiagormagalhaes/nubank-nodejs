# Nubank NodeJS 

### Ainda em desenvolvimento...

Acesse seus extratos do Nubank pelo NodeJS ([Baseado na versão py](https://github.com/andreroggeri/pynubank))

## Ponto de atenção
O Nubank pode trancar a sua conta por 72 horas caso detecte algum comportamento anormal !!
Por conta disso, evite enviar muitas requisições. 

## Instalação

```js
//instalando dependências necessárias
yarn install
```

## Configuração
Crie um arquivo `.env` na raiz do projeto, adicionando seu CPF (sem pontos ou traços) e sua senha. Por exemplo:
```js
module.exports = {
  CPF: '99999999999',
  PASS: 'minhasenhaqui'
}
```

## Como funciona?

Primeiro é necessário fazer a leitura do `QRCode` gerado pelo aplicativo da Nubank.

Ao fazer a leitura do `QRCode`, pressione alguma tecla para continuar a autenticação.

Após a autenticação é só chamar as funções que desejar.

## Utilizando (via browser)

```
  node .\index.js
```

Depois que o servidor estiver rodando, basta acessar o link: [http://localhost:3333/](http://localhost:3333/)


## Utilizando (via terminal)

Leitura do QRCode

```js
const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Função de autenticação com QRCode
  // O terceiro parâmetro indica se os arquivos de autenticação serão salvos
  const authenticate = await nu.authenticate_with_qr_code(env.CPF, env.PASS, true)
  
  // Imprime um JSON de reposta, informando se a autenticação
  // foi realizada com sucesso.
  console.log(authenticate)

  // Lista de objetos contendo todas as movimentações de seu cartão de crédito
  const get_card_feed = await nu.get_card_feed()
  // Imprimir no console
  console.log(get_card_feed)
  // Salvar em arquivo
  lib.write_file(get_card_feed, 'card_feed.js')
}

main()
```

## Dcoumentação

#### [Funções](https://github.com/thiagormagalhaes/nubank-nodejs/blob/master/doc/function.md)

As funções são referentes a [Class Nubank](https://github.com/thiagormagalhaes/nubank-nodejs/blob/master/nubank/nubank.js), utilizada para a extração de dados da `Nubank`.

#### [Rotas](https://github.com/thiagormagalhaes/nubank-nodejs/blob/master/doc/routes.md)

As rotas são referentes a API NodeJS

## Contribuindo

Envie sua PR para melhorar esse projeto ! 😋
