import Web3 from 'web3'
import Web3FusionExtend from 'web3-fusion-extend'
import WebsocketProvider from '../../ether-socket-provider'

export class Web3Store {
  web3
  fusion

  static get default() {
    return web3Store
  }

  get fsn() {
    return this.fusion.fsn
  }

  get fsntx() {
    return this.fusion.fsntx
  }

  get accounts() {
    return this.web3.eth.accounts
  }

  refreshProvider(providerUrl) {
    let retries = 0

    const retry = (event) => {
      if (event) {
        console.log('Web3 provider disconnected or errored.')
        retries += 1

        if (retries > 5) {
          console.log(`Max retries of 5 exceeding: ${retries} times tried`)
          return setTimeout(this.refreshProvider, 5000)
        }
      } else {
        console.log(`Reconnecting web3 provider`)
        this.refreshProvider(providerUrl)
      }

      return null
    }

    const provider = new WebsocketProvider(providerUrl)

    provider.on('end', () => retry())
    provider.on('error', () => retry())

    console.log('New Web3 provider initiated')

    this.web3 = new Web3(provider)
    this.fusion = Web3FusionExtend.extend(this.web3)

    return provider
  }

  init() {
    this.refreshProvider('wss://testnetpublicgateway1.fusionnetwork.io:10001')
  }

  get gasPrice() {
    const BN = this.web3.utils.BN
    return this.web3.utils.toWei(new BN('100'), 'gwei')
  }
}

const web3Store = new Web3Store()
