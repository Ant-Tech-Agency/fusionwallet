import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Switch,
} from 'react-native'
import { colors, images, metrics } from '../../../themes'
import { CoinPick } from '../component/CoinPick'
import { AssetPicker } from '../../../../components/AssetPicker/AssetPicker'
import { useNavigationParam } from 'react-navigation-hooks'
import { AButton } from '../../../../components/AButton'
import { BigNumber } from '../../../shared/big-number'
import { AInput } from '../../../../components/AInput'
import { WalletEffect } from '../../../effects/wallet.effect'

export const SwapMarket = ({ data }) => {
  // declare state
  const [assetSend, setAssetSend] = useState()
  const [assetReceive, setAssetReceive] = useState()
  const [isPick, setIsPick] = useState(false)
  const [pickType, setPickType] = useState('NONE')
  const [sendValue, setSendValue] = useState(0)
  const [receiveValue, setReceiveValue] = useState(0)
  const [numberOfFill, setNumberOfFill] = useState(1)
  const [swapRate, setSwapRate] = useState(sendValue / receiveValue)
  const [isPublic, setIsPublic] = useState(false)
  const [addresses, setAddresses] = useState('')

  // action on chose one item on coin picker
  function onPickCoin(item) {
    switch (pickType) {
      case 'NONE':
        break
      case 'SEND':
        setAssetSend(item)
        setPickType('NONE')
        setIsPick(false)
        break
      case 'TO':
        setPickType('TO')
        setIsPick(false)
        setAssetReceive(item)
        break
      default:
        break
    }
  }

  // catch every on change text event
  function onChangeText(tag, value) {
    // change state by tag
    switch (tag) {
      case 'SEND':
        setSendValue(value ? parseInt(value) : 0)
        receiveValue > 0 && setSwapRate(value / receiveValue)
        break
      case 'RECEIVE':
        setReceiveValue(value ? parseInt(value) : 0)
        sendValue > 0 && setSwapRate(sendValue / value)
        break
      case 'SWAPRATE':
        setSwapRate(value > 0 ? parseFloat(value) : 0)
        value > 0 && setSendValue(value * receiveValue)
        break
      case 'NUMBEROFFILL':
        setNumberOfFill(value)
        break
      default:
        break
    }
  }

  // actions on press coin picker
  function onOpenPicker(tag) {
    // change this state to open picker
    setIsPick(true)

    // set type to pick
    setPickType(tag)
  }

  // action on press swap
  async function onSwap() {
    try {
      // declare data what using pass to function as param
      const data = {
        assetSend: assetSend,
        assetTo: assetReceive,
        toValue: receiveValue,
        fromValue: sendValue,
        makeTarges: addresses,
        minimumSwap: numberOfFill,
      }

      // call to Wallet Effect and start quantum swap with data declared before
      const txHash = await WalletEffect.quantumSwap(data)

      // alert tx hash if success
      alert(txHash)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <View>
      {!isPick ? (
        data.length > 0 ? (
          <View style={s.container}>
            <View>
              <Text style={s.label}>You Send</Text>
              <TouchableOpacity
                onPress={() => onOpenPicker('SEND')}
                style={s.pickWrapper}
              >
                {!assetSend ? (
                  <Text style={s.label}>Please chose coin to send</Text>
                ) : (
                  <CoinPick data={assetSend} />
                )}
              </TouchableOpacity>
              {assetSend && (
                <Text style={s.assetBalance}>
                  Asset balance :{' '}
                  {assetSend.Amount /
                    BigNumber.generateDecimal(assetSend.Decimals)}
                </Text>
              )}
            </View>

            <View>
              <Text style={s.label}>You Receive</Text>
              <TouchableOpacity
                onPress={() => onOpenPicker('TO')}
                style={s.pickWrapper}
              >
                {!assetReceive ? (
                  <Text style={s.label}>Please chose coin to receive </Text>
                ) : (
                  <CoinPick data={assetReceive} />
                )}
              </TouchableOpacity>
            </View>
            {assetSend && assetReceive && (
              <View style={s.form}>
                <AInput
                  keyboardType={'number-pad'}
                  value={sendValue.toString() || '0'}
                  onChangeText={value => onChangeText('SEND', value)}
                  name={'You Send'}
                />
                <AInput
                  value={receiveValue.toString()}
                  onChangeText={value => onChangeText('RECEIVE', value)}
                  name={'You Receive'}
                />
                {sendValue > 0 && receiveValue > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={s.label}>Swap Rate:</Text>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <TextInput
                        value={swapRate.toString()}
                        style={s.swapRate}
                        keyboardType={'numeric'}
                        onChangeText={value => onChangeText('SWAPRATE', value)}
                      />
                      <Text>
                        {assetSend.Symbol} : 1 {assetSend.Symbol}
                      </Text>
                    </View>
                  </View>
                )}
                <AInput
                  value={numberOfFill.toString()}
                  onChangeText={value => onChangeText('NUMBEROFFILL', value)}
                  name={'Number of Fills'}
                />
                {sendValue > 0 &&
                  receiveValue > 0 &&
                  (numberOfFill > 0 ? (
                    <Text>
                      {' '}
                      {sendValue / numberOfFill}
                      <Text>
                        {assetSend.Symbol} : {receiveValue / numberOfFill}
                        <Text>{assetReceive.Symbol}</Text>
                      </Text>{' '}
                    </Text>
                  ) : (
                    <Text style={s.redMess}>
                      * number of fill must be greater than 0
                    </Text>
                  ))}
              </View>
            )}
            {sendValue > 0 && receiveValue > 0 && (
              <View style={{ padding: metrics.padding.base }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={s.label}>AVAILABLE TO </Text>
                    <Text>{isPublic ? 'wallet addresses' : 'public'}</Text>
                  </View>
                  <Switch onValueChange={setIsPublic} value={isPublic} />
                </View>
                {isPublic && (
                  <AInput
                    value={addresses}
                    onChangeText={text => setAddresses(text)}
                    name={'Address'}
                  />
                )}
              </View>
            )}
          </View>
        ) : (
          <Text>Don't have any asset</Text>
        )
      ) : (
        data && <AssetPicker onPress={item => onPickCoin(item)} data={data} />
      )}
      {sendValue > 0 && receiveValue > 0 && (
        <AButton onPress={onSwap} title={'Make Swaps'} />
      )}
    </View>
  )
}

// @ts-ignore
const s = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: metrics.padding.base,
    marginBottom: metrics.margin.base,
  },
  logo: {
    height: metrics.logo.height,
    width: metrics.logo.width,
    marginLeft: -metrics.margin.base,
  },
  titleScreen: {
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginTop: metrics.margin.base,
    marginBottom: metrics.margin.double,
    fontSize: metrics.font.header.h1,
    textAlign: 'center',
    color: colors.text.primary,
  },
  label: {
    fontSize: metrics.font.text.t1,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginVertical: metrics.margin.base,
  },
  pickWrapper: {
    borderRadius: metrics.border.radius.base,
    padding: metrics.padding.half,
    borderWidth: metrics.border.width.base,
    marginHorizontal: metrics.margin.base,
  },
  assetBalance: {
    margin: metrics.margin.base,
  },
  form: {
    paddingHorizontal: metrics.padding.base,
  },
  redMess: {
    color: 'red',
    fontSize: metrics.font.text.t3,
  },
  swapRate: {
    borderWidth: metrics.border.width.triple,
    width: '20%',
    height: metrics.input.small.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
