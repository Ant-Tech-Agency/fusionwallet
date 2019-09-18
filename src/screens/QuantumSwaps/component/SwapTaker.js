import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Button, FlatList } from 'react-native'
import { getAllSwaps } from '../../../services/fusion.service'
import { AssetEffect } from '../../../effects/asset.effect'
import { MyOpenSwap } from './MyOpenSwap'
export const SwapTaker = ({ allAsset }) => {
  // declare state
  // page using to call api
  const [page, setPage] = useState(0)
  // allSwap using to listing all swap available
  const [allSwap, setAllSwap] = useState([])
  // declare function
  useEffect(() => {
    init().then()
  }, [])

  async function init() {
    const res = await getAllSwaps(page)
    const swaps = await AssetEffect.getAvailableSwaps(res, allAsset)
    console.log(swaps)
    setAllSwap(swaps)
  }

  return (
    <View style={{ backgroundColor: 'red', padding: 10}}>
      {allSwap.length > 0 && (
        <FlatList
          data={allSwap}
          keyExtractor={item => item.SwapID}
          renderItem={({ item }) => {
            return <MyOpenSwap  swap={item} />
          }}
        />
      )}
    </View>
  )
}

const s = StyleSheet.create({
  container: {},
})
