# Libs

Store 3 files `ether-socket-provider.js`, `random.js`, `wallet.js`


### `ether-socket-provider.js`
Provide connect to websocket
### `random.js`
it provide function `randomBytesAsync()` generate random bytes
- `randomBytesAsync()` - generate bytes:
  - `params`:
    - byteCounts: `number` - length of random
  - `return`:
    - randomBytes: `string`

### `wallet.js`
store wallet class what use to create wallet, access wallet with key store, etc...
- `toV3()` - generate wallet:
  - `params`:
    - password: `string` - wallet password
    - opts: `object` : 
    ```javascript
        {
            dklen:number 32,
            salt:hex randomBytes //from randomByte of random.js
        } 
    ```
  - `return`:
    - key Store: `object` - use to access wallet
- fromV3() - access wallet:
  - `params`:
    - content: `keystore` - `object` - using to access wallet this params was generated at `toV3()`
    - password: `string` - wallet password
    - nonStrict: `bool` - use to decided use lower case
  - `return`:
    - Wallet: `wallet` - `object`