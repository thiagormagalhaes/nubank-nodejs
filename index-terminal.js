const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Função de autenticação com QRCode
  const authenticate = await nu.authenticate_with_qr_code(env.CPF, env.PASS, true)

  // Imprime um JSON de reposta, informando se a autenticação foi realizada com sucesso
  console.log(authenticate)

  // Lista de objetos contendo todas as movimentações de seu cartão de crédito
  const get_card_feed = await nu.get_card_feed()

  // Imprimir no console
  console.log(get_card_feed)

  // Salvar em arquivo
  lib.write_file(get_card_feed, 'card_feed.js')
}

main()