const axios = require('axios')
const fs    = require('fs')

const PATH = 'download/'

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

async function read_file (filename) {
  const path = PATH + filename

  if(!fs.existsSync(path))
    return {}

  let rawdata = fs.readFileSync(path);
  return JSON.parse(rawdata)
}

async function write_file (data, filename) {
  let json = JSON.stringify(data);
  fs.writeFileSync(PATH + filename, json);
}

module.exports = {
  get_data,
  press_any_key,
  read_file,
  write_file
}