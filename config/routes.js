const express = require('express')
const env     = require('../.env')

module.exports = function (app) {

  const Nubank = require('../nubank/nubankService')

  app.get('/qrcode', Nubank.qr_code)
  app.get('/authenticate', Nubank.authenticate)
  app.get('/card', Nubank.card)
  app.get(['/card/group/:month', '/card/group'], Nubank.card_group)

  app.all('*', (req, res) => {
    res.json({ 
      about: 'Recupera informações do Nubank',
      github: 'https://github.com/thiagormagalhaes',
      version: '1.0.0',
      link: [
        {
          url: 'http://localhost:3333/qrcode',
          description: 'Gera o QRCode para ser lido pelo app da Nubank'
        },
        {
          url: 'http://localhost:3333/authenticate',
          description: 'Faz o login no Nubank'
        },
        {
          url: 'http://localhost:3333/card/',
          description: 'Extrato do Nubank'
        },
      ]
    })
  })

}