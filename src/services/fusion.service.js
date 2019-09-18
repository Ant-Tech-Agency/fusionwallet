import { api } from './base.service'

export const getFsnPrice = async  ()=>{
  return await api.get('/fsnprice')
}

export const getAssets = async(index)=>{
  return await api.get(`/assets/all?page=${index}&size=100`)
}

export const getOpenSwap = async (publicAddress) => {
  return await api.get(`/swaps2/all?address=${publicAddress}&page=0&size=100`)
}

export const getAllSwaps = async (page, options) => {
  let base = `swaps2/all?page=${page}&size=30&sort=asc`
  if (options){
    const {from, to} = options
    if (from){
      base += '&fromAsset=' + from
    }
    if (to){
      base += '&fromAsset=' + to
    }
  }

  return await api.get(base)
}
