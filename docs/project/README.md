# Basic Function Flow

- [Basic Function Flow](#basic-function-flow)
    - [Access Wallet](#access-wallet)
    - [Create Wallet](#create-wallet)
    - [Open The Wallet With KeyStore/Json File](#open-the-wallet-with-keystorejson-file)
    - [Quantum Swap](#quantum-swap)
    - [Create Asset](#create-asset)
    - [Send Asset](#send-asset)
    - [Get user Assets](#get-user-assets)



### Access Wallet 
When you entered your private key and press `Open The Wallet` button on `AccessWallet` screen it will call to `AccessWallet()` function at `AccessWallet.js`. In this function it will check did you entered privateKey

If you entered privateKey it will call to function `init()` at `wallet.store.js` with params is privateKey like:

```javascript 
    await WalletStore.default.init(privateKey)
```
in `init()` function, it will create **new** `Wallet` object from `root/src/libs/wallet`, then use `privateKeyToAccount()` from `account`  module of `web3.js` libs

Finally, private Key was saved to secure store with `persistPrivateKey()` to auto login in next times

### Create Wallet
When you entered password and press `Create New Wallet` button on `CreateNewWallet` scree it will call to `onCreateFile()` function at `CreateNewWallet.js`. In this function, it will call to `generate()` function at `wallet.store.js` to generate a private Key and return the `Wallet` with that key

Then, pass the `password` as params to the `toV3()` function of `wallet.js`
### Open The Wallet With KeyStore/Json File
### Quantum Swap
### Create Asset
### Send Asset
### Get user Assets
