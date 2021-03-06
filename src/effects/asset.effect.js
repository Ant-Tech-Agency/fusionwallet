import { getOpenSwap, getAssets, getFsnPrice } from '../services/fusion.service'
import { WalletStore } from '../stores/wallet.store'
import { Web3Store } from '../stores/web3.store'
import { WalletConstant } from '../constants/wallet.constant'
async function getAllAssets() {
  try {
    const cachedAssets = {
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff': {
        AssetID:
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        CanChange: false,
        Decimals: 18,
        Description: '',
        ID:
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        Name: 'FUSION',
        Symbol: 'FSN',
        Total: 81920000000000000000000000,
      },
      '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe': {
        AssetID:
          '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe',
        CanChange: false,
        Decimals: 0,
        Description: '',
        ID:
          '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe',
        Name: 'USAN',
        Symbol: 'USAN',
        Total: 0,
      },
    }
    const resFsn = await getFsnPrice()
    const totalAssets = resFsn.data.totalAssets
    const promises = []
    for (let i = 0; i < Math.ceil(totalAssets / 100); i++) {
      promises.push(getAssets(i))
    }

    const resAssets = await Promise.all(promises)
    console.log(resAssets)
    for (let i = 0; i < resAssets.length; i++) {
      const assets = resAssets[i].data
      assets.forEach(asset => {
        const data = JSON.parse(asset.data)
        data.ID = data.AssetID
        data.Owner = data.fromAddress

        cachedAssets[data.AssetID] = data
      })
    }

    this.cachedAssets = cachedAssets

    return this.cachedAssets
  } catch (e) {
    console.log(e)
  }
}

function getAssetsFromBalances(assets, balances) {
  return Object.keys(balances).reduce((acc, key) => {
    const asset = assets[key]
    asset.Amount = balances[key]
    return acc.concat(assets[key])
  }, [])
}

function countAmountDec(decimals) {
  let returnDecimals = '1'
  for (let i = 0; i < decimals; i++) {
    returnDecimals += '0'
  }
  return parseInt(returnDecimals)
}

async function getAvailableSwaps(swap, allAsset, balances) {
  const preSwaps = swap.data
  const swaps = []
  preSwaps.pop()
  preSwaps.forEach(e => {
    if (e) {
      let isTake;
      const data = JSON.parse(e.data)
      const fromAsset = allAsset[e.fromAsset]
      const toAsset = allAsset[e.toAsset]
      const fromAmount =
        (data.MinFromAmount / countAmountDec(fromAsset.Decimals)) * e.size
      const toAmount =
        (data.MinToAmount / countAmountDec(toAsset.Decimals)) * e.size
      const swapRate = fromAmount / toAmount
      const minimumFill = fromAmount / e.size
      const fromSymbol = fromAsset.Symbol
      const toSymbol = toAsset.Symbol
      if (balances){
        isTake = isTakeAvailable(data.ToAssetID, toAmount, data.ToStartTime, data.ToEndTime, balances)
      }
      const ui = {
        fromAmount,
        fromSymbol,
        toSymbol,
        toAmount,
        swapRate,
        minimumFill,
        isTake
      }
      const element = {
        ...data,
        size: e.size,
        ui: ui,
      }
      swaps.push(element)
    }
  })
  return swaps
}

async function recallSwap(SwapID) {
  const from = WalletStore.default.address
  const data = {
    from,
    SwapID,
  }
  const tx = await Web3Store.default.fsntx.buildRecallSwapTx(data)
  tx.from = from
  tx.chainId = WalletConstant.ChainID
  return Web3Store.default.fsn.signAndTransmit(
    tx,
    WalletStore.default.account.signTransaction
  )
}

async function takeSwap(SwapID) {
  const from = WalletStore.default.address
  const data = {
    from,
    SwapID,
    Size: 1,
  }
  const tx = await Web3Store.default.fsntx.buildTakeSwapTx(data)
  tx.from = from
  tx.chainId = WalletConstant.ChainID
  return Web3Store.default.fsn.signAndTransmit(
    tx,
    WalletStore.default.account.signTransaction
  )
}

 function isTakeAvailable(
  assetId,
  minSwapTaker,
  toStartTime,
  toEndTime,
  balances
) {
   if (toStartTime === 0 && toEndTime === 18446744073709552000) {
    return balances[assetId] > minSwapTaker
  } else {
    return false
  }
}

export const AssetEffect = {
  getAllAssets,
  getAssetsFromBalances,
  getAvailableSwaps,
  recallSwap,
  takeSwap,
}
