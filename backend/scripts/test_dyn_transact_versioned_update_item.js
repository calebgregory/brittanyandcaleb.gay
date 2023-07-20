#!/usr/bin/env node

const AWS = require('aws-sdk')

const { dyn_transact_versioned_update_item } = require('../build/dynamodb/update')

const TableName = `bc-gay-backend-v0-devl-table-BCApp-v0`

async function main() {
  const dyn_client = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

  const ItemKey = { PK: 'PARTIPANT#test@test.com', SK: 'A' }

  await dyn_client.put({ TableName, Item: { ...ItemKey, name: 'Test Test' } }).promise()

  const promises = []

  for (const i of Array(4).keys()) {
    promises.push(
      dyn_transact_versioned_update_item(TableName, ItemKey, (participant) => {
        participant.name = '' + (i + Math.random())
        return participant
      })
    )
  }

  const resps = await Promise.all(promises)

  console.log(resps)

  await dyn_client.delete({ TableName, Key: ItemKey }).promise()
}

main()
