import {getAssets, getFsnPrice} from '../services/fusion.service'
import AsyncStorage from 'react-native'
import {AssetData, Balance} from 'web3-fusion-extend'
import { sortBy } from 'lodash/fp'
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

function getAssetsFromBalances(assets, balances){

  const data = Object.keys(balances).reduce((acc, key) => {
    if (key !== '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
      console.log(key)
      const asset = assets[key]
      asset.Amount = balances[key]
      return acc.concat(assets[key])
    }
    }, [])
    return  sortBy(o => o.Name, data)
}

export const AssetEffect = {
  getAllAssets,
  getAssetsFromBalances
}
