import React, { useState } from 'react'
import { View, StyleSheet, Button, Text, Modal } from 'react-native'
import { metrics } from '../../../themes'
import { AssetEffect } from '../../../effects/asset.effect'
export const MyOpenSwap = ({ swap, segment }) => {
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
  } = ui

  // declare state
  // isVisible state using to check should modal render or not
  const [isVisible, setIsVisible] = useState(false)

  // declare function
  // onRecall was called when user press recall button in confirm modal
  async function onRecall() {
    // close modal and start transaction
    try {
      setIsVisible(false)
      const txHash = await AssetEffect.recallSwap(SwapID)
      alert(txHash)
    } catch (e) {
      alert(e)
      console.log(e)
    }
  }

  async function takeSwap() {
    setIsVisible(false)
    const txHash = await AssetEffect.takeSwap(SwapID)
    alert(txHash)
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
            <Text style={s.contentTitle}>Send: </Text> {fromAmount} {fromSymbol}
          </Text>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Receive: </Text> {toAmount} {toSymbol}
          </Text>
          <Text>
            {' '}
            <Text style={s.contentTitle}>Minimum of fill: </Text>
            {minimumFill} {fromSymbol}
          </Text>
        </View>
        <View>
          <Button
            onPress={() => (segment !== 2 ? setIsVisible(true) : takeSwap())}
            title={segment !== 2 ? 'Recall' : 'TakeSwap'}
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
              Are you sure you want to remove this swap? If recalled, this swap
              will be pulled from the swap market with the next block.
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
                onPress={() => onRecall()}
                title={'Recall Swap'}
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
