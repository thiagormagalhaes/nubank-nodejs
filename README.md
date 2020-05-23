# Nubank NodeJS 

### Ainda em desenvolvimento...

Acesse seus extratos do Nubank pelo NodeJS ([Baseado na versão py](https://github.com/andreroggeri/pynubank))

## Instalação

```js
//instalando dependências necessárias
yarn install
```

## Utilizando

### Ponto de atenção
O Nubank pode trancar a sua conta por 72 horas caso detecte algum comportamento anormal !!
Por conta disso, evite enviar muitas requisições. 

### Configuração
Crie um arquivo `.env` na raiz do projeto, adicionando seu CPF (sem pontos ou traços) e sua senha. Por exemplo:
```js
module.exports = {
  CPF: '99999999999',
  PASS: 'minhasenhaqui'
}
```

#### Cartão de Crédito (via terminal)

Primeiro é necessário gerar um QRCode e fazer a autenticação pelo aplicativo da Nubank. O código a baixo irá gerar a string de validação e o QRCode para ser lido. 

É necessário copiar essa string de validação para usar na autenticação.

```js
const Nubank = require('./nubank/nubank')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Essa função irá retornar uma string de autenticação
  // e irá imprimir no terminal o QRCode para ser lido
  // pelo aplicativo da Nubank
  await nu.get_qr_code_terminal()
```

Após fazer a leitura do QRCode pelo aplicativo da Nubank. Coloque a string na função de autenticação.

```js
const Nubank = require('./nubank/nubank')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()
  
  // Função de autenticação
  const authenticate = await nu.authenticate(env.CPF, env.PASS, 'string_de_autenticao_aqui')
  // Imprime um JSON de reposta, informando se a autenticação
  // foi realizada com sucesso.
  console.log(authenticate)

  // Lista de objetos contendo todas as movimentações de seu cartão de crédito
  const get_card_feed = await nu.get_card_feed()
  console.log(get_card_feed)
}

main()
```


## Contribuindo

Envie sua PR para melhorar esse projeto ! 😋
