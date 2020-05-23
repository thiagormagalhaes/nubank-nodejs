const express    = require('express')
const http       = require('http')
const bodyParser = require('body-parser')
const Nubank     = require('./nubank/nubank')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.set('port', process.env.PORT || 3333)
app.set('json spaces', 2)

app.locals.nubank = new Nubank()

const port = app.get('port')

const server = http.createServer(app)

require('./config/routes')(app)

server.listen(port, () => console.log('Servidor rodando na porta', port))