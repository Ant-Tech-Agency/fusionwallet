import { api } from './base.service'

export const getFsnPrice = async  ()=>{
  const res = await api.get('/fsnprice')
  console.log(res)
  return res
}

export const getAssets = async(index)=>{
  const res = await api.get(`/assets/all?page=${index}&size=100`)
  console.log(res)
  return res
}
