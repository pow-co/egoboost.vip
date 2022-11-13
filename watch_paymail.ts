
import { findOrCreate } from './src/onchain'

const axios = require('axios')

async function run() {

  const { data: { data: { owners } } } = await axios.get('https://staging-backend.relayx.com/api/token/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2/owners')

  for (let owner of owners) {

    console.log(owner)

    if (owner.paymail) {

      const result = await findOrCreate({
        where: {
          app: 'egoboost.vip',
          type: 'paymail',
          content: {
            paymail: owner.paymail
          }
        },
        defaults: {
          app: 'egoboost.vip',
          key: 'paymail',
          val: {
            paymail: owner.paymail
          }
        }
      })

      console.log('result', result)

    }

  }

}

run()
