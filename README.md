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

#### Cartão de Crédito

Primeiro é necessário fazer a leitura do `QRCode` gerado pelo aplicativo da Nubank.

Ao fazer a leitura do `QRCode`, pressione alguma tecla para continuar a autenticação.

Após a autenticação é só chamar as funções que desejar.

## Utilizando (via browser)

```js
  // Irei adicionar depois como fazer isso
```

## Utilizando (via terminal)

Leitura do QRCode

```js
const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Gera um QRCode no terminal para ser lido pelo aplicativo e um identificador
  const uuid = await nu.get_qr_code()

  // Pausa o script enquanto aguarda a leitura do QRCode
  await lib.press_any_key('Pressione algum tecla quando terminar de ler o QRCode pelo app da Nubank')
  
  // Função de autenticação
  const authenticate = await nu.authenticate(env.CPF, env.PASS, 'string_de_autenticao_aqui')
  
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


## Contribuindo

Envie sua PR para melhorar esse projeto ! 😋
