import React, { useState } from 'react'
import { View, StyleSheet, Button, Text, Modal } from 'react-native'
import { metrics } from '../../../themes'
import { AssetEffect } from '../../../effects/asset.effect'
export const AvailableSwap = ({ swap, segment }) => {
  // declare UI object and swapID
  const { ui, SwapID } = swap

  // get necessary value from UI object
  const {
    fromAmount,
    fromSymbol,
    toAmount,
    toSymbol,
    swapRate,
    minimumFill,
    isTake,
  } = ui
  // declare state
  // isVisible state using to check should modal render or not
  const [isVisible, setIsVisible] = useState(false)

  // declare function
  // onRecall was called when user press recall button in confirm modal
  async function takeSwap() {
    try {
      setIsVisible(false)
      const txHash = await AssetEffect.takeSwap(SwapID)
      alert(txHash)
    } catch (e) {
      console.log(e)
      console.log(e.message)
      alert(e.message)
    }
  }

  return (
    <View>
      <View style={s.container}>
        <View>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Price: </Text>{' '}
            {// check is swapRate content '.'
            swapRate.toString().indexOf('.') !== -1
              ? swapRate.toFixed(4)
              : swapRate}{' '}
            {fromSymbol} : 1 {toSymbol}
          </Text>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Send: </Text>{' '}
            {toAmount.toString().indexOf('.') !== -1
              ? toAmount.toFixed(2)
              : toAmount}{' '}
            {toSymbol}
          </Text>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Receive: </Text>{' '}
            {fromAmount.toString().indexOf('.') !== -1
              ? fromAmount.toFixed(2)
              : fromAmount}{' '}
            {fromSymbol}
          </Text>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Minimum of fill: </Text>
            {minimumFill} {fromSymbol}
          </Text>
        </View>
        <View>
          <Button
            disabled={!isTake}
            onPress={() => setIsVisible(true)}
            title={'Take Swap'}
          />
        </View>
      </View>

      {/*confirm reCall swap modal*/}
      <Modal animationType={'slide'} transparent={true} visible={isVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: metrics.modal.width,
              padding: metrics.padding.double,
              backgroundColor: 'white',
              borderRadius: metrics.border.radius.double,
            }}
          >
            <Text>
              Are you sure you want to Send {toAmount} {toSymbol} and Receive{' '}
              {fromAmount} {fromSymbol}?
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Button onPress={() => setIsVisible(false)} title={'Cancel'} />
              <Button
                color={'red'}
                onPress={() => takeSwap()}
                title={'Take Swap'}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  contentTitle: {
    fontWeight: 'bold',
  },
})
