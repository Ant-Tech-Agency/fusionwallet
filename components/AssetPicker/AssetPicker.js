import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { CoinPick } from '../../src/screens/QuantumSwaps/component/CoinPick'

import { metrics } from '../../src/themes'


export const AssetPicker = ({ data, onPress }) => {
  return (
    <View style={s.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.ID}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => onPress(item)} style={s.item}>
              <CoinPick data={item} />
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    paddingVertical: metrics.padding.base,
  },
  item: {
    borderRadius: metrics.border.radius.base,
    padding: metrics.padding.half,
    borderWidth: metrics.border.width.base,
    marginHorizontal: metrics.margin.base,
    marginVertical: metrics.margin.base,
  },
})
