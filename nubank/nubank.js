const { v4: uuidv4 } = require('uuid');

const axios  = require('axios')
const lib    = require('../config/lib')
const qrcode = require('qrcode-terminal')

module.exports = class Nubank {

  DISCOVERY_URL = 'https://prod-s0-webapp-proxy.nubank.com.br/api/discovery'
  DISCOVERY_APP_URL = 'https://prod-s0-webapp-proxy.nubank.com.br/api/app/discovery'
  auth_url = null
  feed_url = null
  proxy_list_url = null
  proxy_list_app_url = null
  query_url = null
  bills_url = null
  uuid = null
  refresh_token_before = null
  PATH = 'auth_data.json'

  headers = {
    'Content-Type': 'application/json',
    'X-Correlation-Id': 'WEB-APP.pewW9',
    'User-Agent': 'pynubank Client - https://github.com/andreroggeri/pynubank',
  }

  async start () {
    this.proxy_list_url = await lib.get_data(this.DISCOVERY_URL)
    this.proxy_list_app_url = await lib.get_data(this.DISCOVERY_APP_URL)
    this.auth_url = this.proxy_list_url['login']
  }

  async password_auth(cpf, password) {
    let payload = {
        "grant_type": "password",
        "login": cpf,
        "password": password,
        "client_id": "other.conta",
        "client_secret": "yQPeLzoHuJzlMMSAjC-LgNUJdUecx8XO"
    }

    let response = await axios.post(
      this.auth_url, 
      payload, 
      this.headers
    )

    return response.data
  }

  async access_token () {
    let payload = {
      'qr_code_id': this.uuid,
      'type': 'login-webapp'
    }

    const options = {
      headers: this.headers
    }

    let response
    
    try {
      response = await axios.post(
        this.proxy_list_app_url['lift'],
        payload,
        options
      )

      this.headers['Authorization'] = 'Bearer ' + response.data.access_token

      await this.set_urls(response.data)

      return {
        status: response.status,
        statusText: response.statusText
      }
    } catch (err) {
      return {
        status: err.response.status,
        statusText: err.response.statusText
      }
    }

  }

  async get_qr_code () {
    this.uuid = uuidv4()
    qrcode.generate(this.uuid, {small: true})
    return this.uuid
  }

  async get_uuid () {
    this.uuid = uuidv4()
    return this.uuid
  }

  async set_urls (data) {
    this.feed_url = data['_links']['events']['href']
    this.query_url = data['_links']['ghostflame']['href']
    this.bills_url = data['_links']['bills_summary']['href']
  }

  async authenticate (cpf, password, uuid) {
    if (uuid)
      this.uuid = uuid
    else {
      return {
        status: 404,
        statusText: 'QRCode não foi gerado'
      }
    }

    let auth_data = await this.password_auth(cpf, password)

    this.headers['Authorization'] = 'Bearer ' + auth_data['access_token']

    const access = await this.access_token()

    return access
  }

  async authenticate_with_qr_code (cpf, password) {
    const uuid = await nu.get_qr_code()

    await lib.press_any_key('Pressione alguma tecla quando terminar de ler o QRCode pelo app da Nubank')

    const authenticate = await nu.authenticate(env.CPF, env.PASS, uuid)

    return authenticate
  }

  async get_card_feed () {
    const response = await axios.get(this.feed_url, { headers: this.headers })
    return response.data.events
  }

} 