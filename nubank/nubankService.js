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

const find_bill_by_date = async (date, bills) => {
  const d = new Date(date)

  let response = []

  await bills.map((row) => {
    let open_date = new Date(row.summary.open_date)
    let close_date = new Date(row.summary.close_date)

    if (d >= open_date && d < close_date)
      response.push(row)
  })

  return response
}

const bill = async (req, res) => {
  let response
  
  const bills = await req.app.locals.nubank.get_bills()

  if (req.params.date) {
    response = await find_bill_by_date(req.params.date, bills)
  } else {
    response = bills
  }

  res.send(response)
}

const bill_details = async (req, res) => {
  const bills = await req.app.locals.nubank.get_bills()

  const bill = await find_bill_by_date(req.params.date, bills)

  let response = []
  
  if (bill.length > 0)
    response = await req.app.locals.nubank.get_bill_details(bill[0])

  res.send(response)
}

module.exports = {
  qr_code,
  authenticate,
  card,
  bill,
  bill_details
}