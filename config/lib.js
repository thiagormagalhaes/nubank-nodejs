const axios = require('axios')
const fs    = require('fs')

async function get_data (url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (e) {
    return e
  }
}

async function press_any_key (message) {
  console.log(message)

  process.stdin.setRawMode(true)
  fs.readSync(0, Buffer.alloc(1), 0, 1)
}

module.exports = {
  get_data,
  press_any_key
}