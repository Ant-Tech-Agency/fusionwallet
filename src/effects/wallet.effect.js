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
  static async sendAssetDateRange(data) {
    console.log(data)
    const { to, value, asset, start, end } = data
    const { Decimals, AssetID } = asset
    const from = WalletStore.default.address
    const amount = new BigNumber(value, Decimals)
    const valueString = amount.toString()
    const startTime = this.getHexDate(this.convertDate(start))
    const endTime = this.getHexDate(this.convertDate(end))
    const tx = await Web3Store.default.fsntx.buildAssetToTimeLockTx({
      asset: AssetID,
      from,
      to,
      start: startTime,
      end: endTime,
      value: valueString,
    })

    tx.from = from
    tx.chainId = 46688
    tx.gasPrice = Web3Store.default.gasPrice

    return await Web3Store.default.fsn.signAndTransmit(
      tx,
      WalletStore.default.account.signTransaction
    )
  }

  static async sendAssetScheduled(data) {
    console.log(data)
    const from = WalletStore.default.address
    const { to, value, asset, start } = data
    const { Decimals, AssetID } = asset
    const amount = new BigNumber(value, Decimals)
    const valueString = amount.toString()
    const end = Web3Store.default.fsn.consts.TimeForeverStr
    const startTime = this.getHexDate(this.convertDate(start))
    console.log(end)
    console.log(startTime)
    const tx = await Web3Store.default.fsntx.buildAssetToTimeLockTx({
      asset: AssetID,
      from,
      to,
      start: startTime,
      end,
      value: valueString,
    })

    tx.from = from
    tx.chainId = 46688
    tx.gasPrice = Web3Store.default.gasPrice

    return await Web3Store.default.fsn.signAndTransmit(
      tx,
      WalletStore.default.account.signTransaction
    )
  }
  static convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? '0' + s : s
    }

    let d = new Date(inputFormat)
    return [
      d.getUTCFullYear(),
      pad(d.getUTCMonth() + 1),
      pad(d.getUTCDate()),
    ].join('-')
  }

  static getHexDate(d) {
    return '0x' + (new Date(d).getTime() / 1000).toString(16)
  }
}

const walletEffect = new WalletEffect()
