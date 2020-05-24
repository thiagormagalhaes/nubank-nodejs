const Nubank = require('./nubank')
const lib    = require('../config/lib')
const env    = require('../.env')
const fs     = require('fs')
const qr     = require('qr-image')

const qr_code = async (req, res) => {
  await req.app.locals.nubank.start()
  
  const uuid = await req.app.locals.nubank.get_uuid()
  const code = qr.image(uuid, { type: 'svg'})

  res.type('svg')

  code.pipe(res)
}

const authenticate = async (req, res) => {
  const response = await req.app.locals.nubank.authenticate(env.CPF, env.PASS)
  res.send(response)
}

const card = async (req, res) => {
  const response = await req.app.locals.nubank.get_card_feed()
  res.send(response)
}

const card_group = async (req, res) => {
  const response = await req.app.locals.nubank.card_group_month(req.params.month, true)
  res.send(response)
}

module.exports = {
  qr_code,
  authenticate,
  card,
  card_group
}