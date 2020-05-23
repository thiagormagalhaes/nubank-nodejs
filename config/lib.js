const axios = require('axios')

async function get_data (url) {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (e) {
    return e
  }
}

module.exports = {
  get_data
}