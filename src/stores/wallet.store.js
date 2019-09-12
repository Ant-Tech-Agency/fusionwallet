import * as SecureStore from 'expo-secure-store'
import { Web3Store } from './web3.store'
import { Wallet } from '../libs/wallet'

export class WalletStore {
  _wallet
  account
  static PRIVATE_KEY = 'PRIVATE_KEY'

  set wallet(value) {
    this._wallet = value
    this.account = Web3Store.default.accounts.privateKeyToAccount(
      this._wallet.privateKey
    )
    WalletStore.persistPrivateKey(this._wallet.privRaw).catch()
  }

  get wallet() {
    return this._wallet
  }

  get address() {
    return this._wallet.address
  }

  async init(privateKey) {
    this._wallet = new Wallet(privateKey)
    this.account = Web3Store.default.accounts.privateKeyToAccount(
      this._wallet.privateKey
    )
    await WalletStore.persistPrivateKey(privateKey)
  }

  static get default() {
    return walletStore
  }

  static async persistPrivateKey(privateKey) {
    try {
      await SecureStore.setItemAsync(WalletStore.PRIVATE_KEY, privateKey)
    } catch (e) {
      return e
    }
  }

  static async getPrivateKey() {
    try {
      return await SecureStore.getItemAsync(WalletStore.PRIVATE_KEY)
    } catch (e) {
      return e
    }
  }

  static async deletePrivateKey() {
    try {
      return await SecureStore.deleteItemAsync(WalletStore.PRIVATE_KEY)
    } catch (e) {
      return e
    }
  }
}

const walletStore = new WalletStore()
