const Nubank = require('./nubank/nubank')
const env    = require('./.env')
const fs     = require('fs')

async function press_any_key (message) {
  console.log(message)

  process.stdin.setRawMode(true)
  fs.readSync(0, Buffer.alloc(1), 0, 1)
}

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Gera um QRCode no terminal para ser lido pelo aplicativo e um identificador
  const uuid = await nu.get_qr_code()

  // Pausa o script enquanto aguarda a leitura do QRCode
  await press_any_key('Pressione algum tecla quando terminar de ler o QRCode pelo app da Nubank')

  // Função de autenticação
  const authenticate = await nu.authenticate(env.CPF, env.PASS, uuid)

  // Imprime um JSON de reposta, informando se a autenticação foi realizada com sucesso
  console.log(authenticate)

  // Lista de objetos contendo todas as movimentações de seu cartão de crédito
  const get_card_feed = await nu.get_card_feed()
  console.log(get_card_feed)
}

main()