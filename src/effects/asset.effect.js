import { getAllAvailableSwaps, getAssets, getFsnPrice } from '../services/fusion.service'

// import { sortBy } from 'lodash/fp'
async function getAllAssets() {
  try {
    const cachedAssets = {}
    const resFsn = await getFsnPrice()
    const totalAssets = resFsn.data.totalAssets
    const promises = []
    for (let i = 0; i < Math.ceil(totalAssets / 100); i++) {
      promises.push(getAssets(i))
    }

    const resAssets = await Promise.all(promises)
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
  delete balances[
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  ]
  return Object.keys(balances).reduce((acc, key) => {
    const asset = assets[key]
    asset.Amount = balances[key]
    return acc.concat(assets[key])
  }, [])
}

async function getAvailableSwaps(pubAddress) {
  const res = await getAllAvailableSwaps(pubAddress)
  const preSwaps = res.data
  const swaps = []
  preSwaps.pop()
  preSwaps.forEach((e) => {
    if (e) {
      const element ={}
      element[e.swapID] = JSON.parse(e.data)
      element[e.swapID].size = e.size
      swaps.push(element)
    }
  })
  return swaps
}
export const AssetEffect = {
  getAllAssets,
  getAssetsFromBalances,
  getAvailableSwaps,
}
