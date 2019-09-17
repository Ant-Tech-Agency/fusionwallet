import React from 'react'
import { View, StyleSheet, Button, Text } from 'react-native'
import { metrics } from '../../../themes'

export const AvailableSwaps = ({ onRecall }) => {
  return (
    <View style={s.container}>
      <View>
        <Text>
          {' '}
          <Text style={s.contentTitle}>Price: </Text> 2000JTT : 1 JAV
        </Text>
        <Text>
          {' '}
          <Text style={s.contentTitle}>Minimum: </Text> of fill :2.0000JTT
        </Text>
        <Text>
          {' '}
          <Text style={s.contentTitle}>Send: </Text> 2JTT{' '}
        </Text>
        <Text>
          {' '}
          <Text style={s.contentTitle}>Receive: </Text> 1JAV{' '}
        </Text>
      </View>
      <View>
        <Button onPress={onRecall} title={'Recall'} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: metrics.border.radius.double,
    borderWidth: metrics.border.width.base,
    margin: metrics.margin.base,
    padding: metrics.padding.base,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentTitle:{
    fontWeight: 'bold'
  }
})
