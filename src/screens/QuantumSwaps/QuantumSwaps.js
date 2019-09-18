import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import { colors, images, metrics } from '../../themes'
import { SwapMarket } from './component/SwapMarket'
import { useNavigationParam } from 'react-navigation-hooks'
import { MyOpenSwap } from './component/MyOpenSwap'
import { getAllSwaps } from '../../services/fusion.service'
import { AssetEffect } from '../../effects/asset.effect'

export const QuantumSwaps = () => {
  // declare state
  // assetData using to pick
  const [assetData, setAssetData] = useState(useNavigationParam('data'))
  // swapsData using to listing opened swap
  const [swapsData, setSwapsData] = useState(useNavigationParam('swaps'))
  // allAsset is pure asset
  const [allAsset, setAllAsset] = useState(useNavigationParam('allAsset'))
  // segment using to check render
  const [segment, setSegment] = useState(0)
  // page using to call api
  const [page, setPage] = useState(0)
  // allSwap using to listing all swap available
  const [allSwap, setAllSwap] = useState([])
  //
  const [isDone, setIsDone] = useState(true)
  // declare function
  useEffect(() => {
    init().then()
  }, [])
  //init using to get all swap

  async function init() {
    const res = await getAllSwaps(page)
    const swaps = await AssetEffect.getAvailableSwaps(res, allAsset)
    const abc = swaps.reduce((acc, cur) => {
      for (let i = 0; i < swapsData.length; i++) {
        if (cur.SwapID === swapsData[i].SwapID) {
          return acc
        }
      }
      return acc.concat(cur)
    }, [])
    let pre = allSwap.concat(abc)
    setAllSwap(pre)
    setIsDone(true)
    setPage(page + 1)
  }
  // onCLickSegment was called when user press on tab
  function onClickSegment(segment) {
    setSegment(segment)
  }

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  return (
    <SafeAreaView style={s.wrapper}>
      <KeyboardAvoidingView behavior={'position'} style={s.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={async ({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && segment === 2 && isDone) {
              setIsDone(false)
              await init()
            }
          }}
          style={s.content}
        >
          <Image source={images.logo} style={s.logo} />

          <View style={s.segment}>
            <TouchableWithoutFeedback onPress={() => onClickSegment(0)}>
              <View
                style={
                  segment === 0 ? s.segmentItemActive : s.segmentItemDeActive
                }
              >
                <Text style={s.titleScreen}>Make Swap</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => onClickSegment(1)}>
              <View
                style={
                  segment === 1 ? s.segmentItemActive : s.segmentItemDeActive
                }
              >
                <Text style={s.titleScreen}>
                  My Open Swap({swapsData.length})
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => onClickSegment(2)}>
              <View
                style={
                  segment === 2 ? s.segmentItemActive : s.segmentItemDeActive
                }
              >
                <Text style={s.titleScreen}>Market</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {// when segment = 0 will render SwapMarket
          segment === 0 && <SwapMarket data={assetData} />}
          {// when segment = 1 will render open swap
          segment === 1 && (
            <View style={{ flex: 1 }}>
              {// check swapsData is empty
              swapsData.length > 0 ? (
                // if not it will map swapsData array to render
                swapsData.map((e, i) => {
                  return <MyOpenSwap key={i.toString()} swap={e} />
                })
              ) : (
                // if swapsData is empty return this text
                <Text style={s.noOpen}>NO OPEN SWAPS</Text>
              )}
            </View>
          )}
          {// when segment = 2
          segment === 2 && (
            <View style={{ flex: 1 }}>
              {// check swapsData is empty
              allSwap.length > 0 ? (
                // if not it will map swapsData array to render
                allSwap.map((e, i) => {
                  return (
                    <MyOpenSwap segment={segment} key={i.toString()} swap={e} />
                  )
                })
              ) : (
                // if swapsData is empty return this text
                <Text style={s.noOpen}>NO OPEN SWAPS</Text>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    width: '100%',
    height: '100%',
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
  noOpen: {
    alignSelf: 'center',
  },
})
