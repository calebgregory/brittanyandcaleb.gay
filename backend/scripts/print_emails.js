const path = require('path')

const { config } = require(path.resolve(__dirname, '../build/config'))
const { dyn_client } = require(path.resolve(__dirname, '../build/dynamodb/client'))

async function main() {
  const resp = await dyn_client().scan({ TableName: config.dyn_table_name }).promise()

  const headers = ['given_name', 'family_name', 'email', 'attending', 'guests']
  const rows = [
    headers,
    ...resp.Items.map((item) => [
      item.given_name,
      item.family_name,
      item.email,
      item.attending,
      item.guests.map((g) => g.name).join(', '),
    ]).sort((a, b) => a[0].localeCompare(b[0])),
  ]

  console.log(rows.map((row) => row.join('|')).join('\n'))
}

main()
