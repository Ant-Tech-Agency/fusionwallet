import React, { useState } from 'react'
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native'
import { colors, images, metrics } from '../../themes'
import { SwapMarket } from './component/SwapMarket'
import { useNavigationParam } from 'react-navigation-hooks'
import { AvailableSwaps } from './component/AvailableSwaps'

export const QuantumSwaps = () => {
  const [assetData, setAssetData] = useState(useNavigationParam('data'))
  const [swapsData, setSwapsData] = useState(useNavigationParam('swaps'))
  const [segment, setSegment] = useState(0)
  console.log(swapsData)

  function onClickSegment(segment) {
    setSegment(segment)
  }

  return (
    <SafeAreaView style={s.wrapper}>
      <ScrollView>
        <KeyboardAvoidingView style={s.container}>
          <Image source={images.logo} style={s.logo} />

          <View style={s.segment}>
            <TouchableOpacity
              style={
                segment === 0 ? s.segmentItemActive : s.segmentItemDeActive
              }
              onPress={() => onClickSegment(0)}
            >
              <Text style={s.titleScreen}>Swap Market</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                segment === 1 ? s.segmentItemActive : s.segmentItemDeActive
              }
              onPress={() => onClickSegment(1)}
            >
              <Text style={s.titleScreen}>
                My Open Swap( {swapsData.length} )
              </Text>
            </TouchableOpacity>
          </View>

          {segment === 0 && <SwapMarket data={assetData} />}
          {segment === 1 &&
            swapsData.length > 0 &&
            swapsData.map((e, i) => {
              return (
                <AvailableSwaps
                  key={i.toString()}
                  onRecall={() => {
                    console.log('ahihi')
                  }}
                />
              )
            })}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

// @ts-ignore
const s = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    fontSize: metrics.font.text.t1,
    textAlign: 'center',
    color: colors.text.primary,
  },
  segment: {
    width: metrics.screenWidth,
    flexDirection: 'row',
    flex: 1,
  },
  segmentItemActive: {
    flex: 1,
    padding: metrics.padding.base,
    borderTopWidth: metrics.border.width.base,
    borderLeftWidth: metrics.border.width.base,
    borderRightWidth: metrics.border.width.base,
    borderTopLeftRadius: metrics.border.radius.triple,
    borderTopRightRadius: metrics.border.radius.triple,
  },
  segmentItemDeActive: {
    flex: 1,
    padding: metrics.padding.base,
    borderBottomWidth: metrics.border.width.base,
  },
})
