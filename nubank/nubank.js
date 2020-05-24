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
  headers = null
  PATH = 'auth_data.json'

  async set_headers () {
    this.headers = {
      'Content-Type': 'application/json',
      'X-Correlation-Id': 'WEB-APP.pewW9',
      'User-Agent': 'nubank nodejs Client - https://github.com/thiagormagalhaes/nubank-nodejs',
    }
  }

  async start () {
    this.proxy_list_url = await lib.get_data(this.DISCOVERY_URL)
    this.proxy_list_app_url = await lib.get_data(this.DISCOVERY_APP_URL)
    this.auth_url = this.proxy_list_url['login']
  }

  async password_auth(cpf, password) {
    await this.set_headers()

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

  async authenticate (cpf, password, uuid, save) {
    if (uuid)
      this.uuid = uuid
    else {
      return {
        status: 404,
        statusText: 'QRCode não foi encontrado'
      }
    }

    let auth_data = await this.password_auth(cpf, password)

    if (save)
      lib.write_file({'date': auth_data.refresh_before}, 'refresh_before.json')

    this.headers['Authorization'] = 'Bearer ' + auth_data['access_token']

    const access = await this.access_token()

    if (save) {
      lib.write_file(this.headers, 'headers.json')
      lib.write_file({
        feed_url: this.feed_url,
        query_url: this.query_url,
        bills_url: this.bills_url
      }, 'urls.json')
    }

    return access
  }

  async load_refresh_before () {
    let refresh_before = await lib.read_file('refresh_before.json')

    try {
      if (refresh_before != {}) {
        this.refresh_token_before = new Date(refresh_before.date)
        return true
      } else
        return false
    } catch (err) {
      return false
    }
  }

  async load_headers () {
    this.headers = await lib.read_file('headers.json')

    try {
      if (this.headers != null && this.headers.Authorization)
        return true
      else
        return false
    } catch (err) {
      return false
    }
  }

  async load_urls () {
    const url = await lib.read_file('urls.json')

    this.feed_url = url.feed_url
    this.query_url = url.query_url
    this.bills_url = url.bills_url
  }

  async authenticate_with_qr_code (cpf, password, save) {
    let new_authenticate = true

    if (save) {
      const load_refresh_before = await this.load_refresh_before()
      const now = new Date()

      if (load_refresh_before && this.refresh_token_before > now) {
        new_authenticate = await this.load_headers()
        new_authenticate = !new_authenticate
      }

      if (!new_authenticate)
        await this.load_urls()
    }

    if (new_authenticate) {
      const uuid = await this.get_qr_code()

      await lib.press_any_key('Pressione alguma tecla quando terminar de ler o QRCode pelo app da Nubank')

      const authenticate = await this.authenticate(cpf, password, uuid, save)

      return authenticate
    } else {
      return {
        status: 200,
        statusText: 'OK'
      }
    }
  }

  async get_card_feed () {
    const response = await axios.get(this.feed_url, { headers: this.headers })
    return response.data.events
  }

} 