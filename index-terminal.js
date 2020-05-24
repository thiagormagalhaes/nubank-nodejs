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

  const response = await nu.get_bills()
  //const response = await nu.card_group_month(null, true, 'card_feed.json')

  console.log(response)

}

main()