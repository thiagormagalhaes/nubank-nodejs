const Nubank = require('./nubank/nubank')
const lib    = require('./config/lib')
const env    = require('./.env')

async function main () {
  const nu = new Nubank()
  await nu.start()

  // Função de autenticação com QRCode
  const authenticate = await nu.authenticate_with_qr_code(env.CPF, env.PASS, true)

  // Imprime um JSON de reposta, informando se a autenticação foi realizada com sucesso
  console.log(authenticate)

  //const response = await nu.get_bills()
  //lib.write_file(response, 'bills.json')

  //const bill = await lib.read_file('bills.json')
  const bill = await nu.get_bills()

  let bill_open

  await bill.map((row) => {
    if (row.state == 'open')
      bill_open = row
  })

  let group = {}

  const bill_detail = await nu.get_bill_details(bill_open)

  console.log(bill_detail.bill.line_items)

  await bill_detail.bill.line_items.map((row) => {
    if (row.category != 'Pagamento') {
      group['total'] = group['total'] ? group['total'] + row.amount : row.amount
      group[row.category] = group[row.category] ? group[row.category] + row.amount : row.amount
    }
  })

  //console.log(group)
  //const response = await nu.card_group_month(null, true, 'card_feed.json')

}

main()