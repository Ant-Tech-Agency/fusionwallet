# Effect folder

In this folder, we have to file `asset.effect.js` and `wallet.effect.js`

In `asset.effect.js` has some functions to interact with asset
like `getAllAssets()` and `getAssetsFromBalances()`

- `getAllAssets()` use to get all asset existing in blockchain
- `getAssetsFromBalances()` return asset of user

In `wallet.effect.js`we have some basic function like `createAsset()`, `sendAsset()`, ...


- `createAsset()` - create new asset:
  - `params`:
    - total: `number` - total supply of asset
    - decimals : `number` - The Token’s Decimal Places from 0 to 18
    - name: `string` - name of asset
    - symbol: `string` - symbol of asset (max is 4 character)
    - canChange: `bool` - can change asset
    - description: `string` - description 
  - `return` 
    - txHash: `string` - `hex`
  

- `sendAsset()` - send asset **without** time-lock: 
  - `params`: 
    - asset: `asset` - `object` asset to send
    - value: `number` value to send
    - to: `string` - `public address` receiver's public address
  - `return`:
    - txHash: `string` - `hex`
  
- `sendAssetDateRange()` send asset with time-lock **(date to date)**:
  - `params`: 
    - asset: `asset` - `object` asset to send
    - value: `number` value to send
    - to: `string` - `public address` receiver's public address
    - start: `string` - `date` start time (time-lock)
    - end: `string` - `date` end time (time-lock)
  - `return`:
    - txHash: `string` - `hex`
- `sendAssetScheduled()` send asset with time-lock **(date to forever)**:
  - `params`:
    - asset: `asset` - `object` asset to send
    - value: `number` value to send
    - to: `string` - `public address` receiver's public address
    - start: `string` - `date` start time (time-lock)
  - `return`:
    - txHash: `string` - `hex`

- `getHexDate()` - convert date to hex:
  - params:
    - date: `string` - `date`: date want to convert
  - return:
    - date: `string` - `hex`: date converted 
