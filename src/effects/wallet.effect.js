import { Web3Store } from '../stores/web3.store'
import { WalletStore } from '../stores/wallet.store'
import { BigNumber } from '../shared/big-number'

export class WalletEffect {
  static get default() {
    return walletEffect
  }

  static async getAllBalances() {
    try {
      return await Web3Store.default.fsn.getAllBalances(
        WalletStore.default.address
      )
    } catch (e) {
      return e
    }
  }
  static async sendAsset(){
    const from = WalletStore.default.address
    const to = '0X373974CA4F8985F6FA51AB3F7DE3DD61473BA702'
    const decimal = 18
    const asset = '0x828d20b62bc45185e5d78e5d9510a52da05f0e2816f699c77f2cb8c46c3151df'
    const amount = new BigNumber('5', decimal)
    const value = amount.toString()
    const tx = await Web3Store.default.fsntx.buildSendAssetTx({
      from,
      to,
      value,
      asset
    })

    tx.chainId = 46688
    tx.from = from
    tx.gasPrice = Web3Store.default.gasPrice
    return await Web3Store.default.fsn.signAndTransmit(tx, WalletStore.default.account.signTransaction)
  }
}

const walletEffect = new WalletEffect()
