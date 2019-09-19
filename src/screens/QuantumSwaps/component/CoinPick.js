import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colors, metrics } from '../../../themes'


export const CoinPick= ({ data }) => {
  return (
    <View style={s.choseQuantum}>
      <View style={s.circle}>
        <Text style={s.coinLogo}>{data.Symbol}</Text>
      </View>
      <View style={s.coinInfo}>
        <Text style={s.coinName}>{data.Name}</Text>
        <Text style={s.coinID} numberOfLines={1}>
          {data.AssetID}
        </Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  circle: {
    width: metrics.coinLogo.width,
    height: metrics.coinLogo.height,
    borderRadius: metrics.border.radius.circle,
    borderWidth: metrics.border.width.triple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinLogo: {
    color: colors.text.primary,
    fontSize: metrics.font.text.t1,
    fontWeight: 'bold',
  },
  coinName: {
    color: colors.text.primary,
    fontSize: metrics.font.header.h2,
    fontWeight: 'bold',
  },
  coinInfo: {
    width: '80%',
    justifyContent: 'center',
    paddingLeft: metrics.padding.double,
  },
  coinID: {
    width: '90%',
  },
  choseQuantum: {
    flexDirection: 'row',
    marginVertical : metrics.margin.base
  },
})
