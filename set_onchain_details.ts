
require('dotenv').config()

import { findOrCreate } from './src/onchain'

async function run() {

  const tokenResult = await findOrCreate({
    where: {
      app: 'midasvalley.net',
      type: 'set_token',
      author: '1Evs1rocEoPQ3K3src8M2YDvVRXsqsJTrK'
    },
    defaults: {
      app: 'midasvalley.net',
      key: 'set_token',
      val: {
        origin: 'e8c17122dda323887279cc007184d958e2c32756b7f41ede535d42a34b5b9864_o2',
        type: 'run'
      }
    }
  })

  console.log(tokenResult)

  const domainResult = await findOrCreate({
    where: {
      app: 'midasvalley.net',
      type: 'set_domain',
      author: '1Evs1rocEoPQ3K3src8M2YDvVRXsqsJTrK'
    },
    defaults: {
      app: 'midasvalley.net',
      key: 'set_domain',
      val: {
        origin: 'egoboost.vip'
      }
    }
  })

  const logoResult = await findOrCreate({
    where: {
      app: 'midasvalley.net',
      type: 'set_logo',
      author: '1Evs1rocEoPQ3K3src8M2YDvVRXsqsJTrK'
    },
    defaults: {
      app: 'midasvalley.net',
      key: 'set_logo',
      val: {
        url: 'https://bitcoinfileserver.com/e8c17122dda323887279cc007184d958e2c32756b7f41ede535d42a34b5b9864',
        txid: 'e8c17122dda323887279cc007184d958e2c32756b7f41ede535d42a34b5b9864_o1'
      }
    }
  })

  console.log(logoResult)

}

run()

