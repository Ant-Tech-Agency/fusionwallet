import { Web3Store } from '../stores/web3.store'
import { WalletStore } from '../stores/wallet.store'
import { BigNumber } from '../shared/big-number'
import { GenAssetData } from 'web3-fusion-extend'
import { WalletConstant } from '../constants/wallet.constant'
import Web3 from 'web3'

export class WalletEffect {
  static get default() {
    return walletEffect
  }

  static async createAsset(data) {
    const { total, decimals, name, symbol, canChange = false } = data
    // const error = WalletValidator.createAsset(data)
    //
    // if (error && error.message) {
    //   throw new Error(error.message)
    // }

    const address = WalletStore.default.address
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
    console.log('call to send asset')
    try {

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

    }catch (e) {
      console.log(e)
    }
  }

  static async sendAssetScheduled(data) {
    console.log('call to scheduled')
    const from = WalletStore.default.address
    const { to, value, asset, start } = data
    const { Decimals, AssetID } = asset
    const amount = new BigNumber(value, Decimals)
    const valueString = amount.toString()
    const end = Web3Store.default.fsn.consts.TimeForeverStr
    const startTime = this.getHexDate(this.convertDate(start))
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
  static async quantumSwap(data) {

    //get data from param
    const {
      fromValue,
      toValue,
      assetSend,
      assetTo,
      sendTimeLock,
      toTimeLock,
      targes,
      minimumSwap,
    } = data

    //get wallet public address
    const address = WalletStore.default.address

    //get asset to send ID
    const fromAssetId = assetSend.AssetID

    //get asset to receive ID
    const toAssetId = assetTo.AssetID

    // get time-lock of both
    // const { fromStartTime, fromEndTime } = sendTimeLock
    // const { toStartTime, toEndTime } = toTimeLock

    //parse both to string
    const fromValueString = fromValue.toString()
    const toValueString = toValue.toString()

    // make receive asset value to big number
    const makeReceiveFinal = BigNumber.makeBigNumber(
      toValueString,
      assetTo.Decimals
    )
    // make send asset value to big number
    const makeSendFinal = BigNumber.makeBigNumber(
      fromValueString,
      assetSend.Decimals
    )
    // parse both to hex
    const minToAmountHex = '0x' + makeReceiveFinal.toString(16)
    const minFromAmountHex = '0x' + makeSendFinal.toString(16)

    //parse minimum swap to string
    const makeMinimumSwapSizeString = minimumSwap.toString()

    //parse to big number
    const makeMinimumSwapSize = BigNumber.makeBigNumber(makeMinimumSwapSizeString)

    //data to build swap tx
    const txData = {
      from: address,
      FromAssetID: fromAssetId,
      ToAssetID: toAssetId,
      MinToAmount: minToAmountHex,
      MinFromAmount: minFromAmountHex,
      SwapSize: parseInt(makeMinimumSwapSize),
      Targes: targes,
    }

    //build make swap tx
    const tx = await Web3Store.default.fsntx.buildMakeSwapTx(txData)

    //add more necessary fill
    tx.from = address
    tx.chainId = WalletConstant.ChainID
    tx.gasPrice = Web3Store.default.gasPrice

    //make swap
    return await Web3Store.default.fsn.signAndTransmit(
      tx,
      WalletStore.default.account.signTransaction
    )
  }
}

const walletEffect = new WalletEffect()
