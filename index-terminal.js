const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Gera um QRCode no terminal para ser lido pelo aplicativo e um identificador
  const uuid = await nu.get_qr_code()

  // Pausa o script enquanto aguarda a leitura do QRCode
  await lib.press_any_key('Pressione alguma tecla quando terminar de ler o QRCode pelo app da Nubank')

  // Função de autenticação
  const authenticate = await nu.authenticate(env.CPF, env.PASS, uuid)

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