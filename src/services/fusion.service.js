import { api } from './base.service'

export const getFsnPrice = async  ()=>{
  return await api.get('/fsnprice')
}

export const getAssets = async(index)=>{
  return await api.get(`/assets/all?page=${index}&size=100`)
}
