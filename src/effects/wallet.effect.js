import { Web3Store } from '../stores/web3.store'
import { WalletStore } from '../stores/wallet.store'

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
}

const walletEffect = new WalletEffect()
