import { Web3Store } from '../stores/web3.store'
import { WalletStore } from '../stores/wallet.store'
import { BigNumber } from '../shared/big-number'
import { GenAssetData } from 'web3-fusion-extend'

export class WalletEffect {
  static get default() {
    return walletEffect
  }

  static async createAsset(data) {
    const { total, decimals, name, symbol, canChange = false } = data
    console.log(data)
    // const error = WalletValidator.createAsset(data)
    //
    // if (error && error.message) {
    //   throw new Error(error.message)
    // }

    const address = WalletStore.default.address
    console.log(address)
    const supply = new BigNumber(total, decimals)

    const tx = await Web3Store.default.fsntx.buildGenAssetTx({
      from: address,
      name,
      symbol,
      decimals,
      canChange,
      total: supply.toHex(),
      description: '{}',
    })
    console.log(tx)
    tx.chainId = 46688
    tx.from = address
    tx.gasPrice = Web3Store.default.gasPrice

    return await Web3Store.default.fsn.signAndTransmit(
      tx,
      WalletStore.default.account.signTransaction
    )
  }

  static async getAllBalances() {
    try {
      let a = await Web3Store.default.fsn.getAllBalances(
        WalletStore.default.address
      )
      return a
    } catch (e) {
      return e
    }
  }

  static async sendAsset(data) {
    console.log(data)
    const { to, value, asset } = data
    const from = WalletStore.default.address
    const { Decimals, AssetID } = asset
    const amount = new BigNumber(value, Decimals)
    const valueString = amount.toString()
    const tx = await Web3Store.default.fsntx.buildSendAssetTx({
      from,
      to,
      value: valueString,
      asset: AssetID,
    })

    tx.chainId = 46688
    tx.from = from
    tx.gasPrice = Web3Store.default.gasPrice
    return await Web3Store.default.fsn.signAndTransmit(
      tx,
      WalletStore.default.account.signTransaction
    )
  }
}

const walletEffect = new WalletEffect()
