import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { WalletStore } from '../../../stores/wallet.store'
import { metrics } from '../../../themes'

export const HomeBalance = props => {
  const { balance, loading } = props
  return (
    <View style={s.container}>
      <Text style={s.textCategory}>Fusion Balance: </Text>
      <View style={s.wrapBalance}>
        <Text style={s.textBalance}>
          {loading ? 'Loading...' : `${balance}`}{' '}
          <Text style={s.textCategory}>FSN</Text>
        </Text>
      </View>
      <Text style={s.textCategory}>Public Address:</Text>
      <Text style={s.textPublicAddress}>
        {WalletStore.default.wallet.address}
      </Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    marginBottom: metrics.margin.double,
    flex: 1,
  },
  wrapBalance: {
    marginVertical: metrics.margin.double,
    justifyContent: 'center',
  },
  textBalance: {
    fontSize: 40,
    fontWeight: '700',
  },
  textPublicAddress: {
    fontSize: metrics.font.text.t1,
    fontWeight: '600',
  },
  textCategory: {
    fontSize: metrics.font.text.t1,
  },
})
