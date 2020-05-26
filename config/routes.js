const express = require('express')
const env     = require('../.env')

module.exports = function (app) {

  const Nubank = require('../nubank/nubankService')

  app.get('/qrcode', Nubank.qr_code)
  app.get('/authenticate', Nubank.authenticate)
  app.get('/card', Nubank.card)
  app.get(['/bill', '/bill/:date'], Nubank.bill)
  app.get('/bill/detail/:date', Nubank.bill_details)

  app.all('*', (req, res) => {
    res.json({ 
      about: 'Recupera informações do Nubank',
      github: 'https://github.com/thiagormagalhaes',
      version: '1.0.0',
    })
  })

}