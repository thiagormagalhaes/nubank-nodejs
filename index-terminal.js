const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
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

  const uuid = await nu.get_qr_code()

  await press_any_key('Pressione algum tecla quando terminar de ler o QRCode pelo app da Nubank')

  const authenticate = await nu.authenticate(env.CPF, env.PASS, uuid)
  console.log(authenticate)

  const get_card_feed = await nu.get_card_feed()
  console.log(get_card_feed)
}

main()