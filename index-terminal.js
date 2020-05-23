const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')
const fs     = require('fs')

async function main () {
  //const nu = new Nubank()
  //await nu.start()

  // await nu.get_qr_code_terminal()

  //const authenticate = await nu.authenticate(env.CPF, env.PASS, 'e12ba12d-8efc-43b4-baf9-2b9d2a4e33bd')
  //console.log(authenticate)

  //const get_card_feed = await nu.get_card_feed()
  //console.log(get_card_feed)
}

main()