import React, { useEffect, useState } from 'react'
import {
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  View,
  TouchableWithoutFeedback,
  TextInput,
  Button,
} from 'react-native'
import { colors, images, metrics } from '../../themes'
import { SwapMarket } from './component/SwapMarket'
import { useNavigationParam } from 'react-navigation-hooks'
import { MyOpenSwap } from './component/MyOpenSwap'
import { getAllSwaps, getSwapsSearch } from '../../services/fusion.service'
import { AssetEffect } from '../../effects/asset.effect'
import { AvailableSwap } from './component/AvailableSwaps'

export const QuantumSwaps = () => {
  // declare state
  // assetData using to pick
  const [assetData] = useState(useNavigationParam('data'))
  // swapsData using to listing opened swap
  const [swapsData] = useState(useNavigationParam('swaps'))
  // allAsset is pure asset
  const [allAsset] = useState(useNavigationParam('allAsset'))
  // balances list
  const [balances] = useState(useNavigationParam('balances'))
  // segment using to check render
  const [segment, setSegment] = useState(0)
  // page using to call api
  const [page, setPage] = useState(0)
  // compare with page
  const [maxPage, setMaxPage] = useState(0)
  // allSwap using to listing all swap available
  const [allSwap, setAllSwap] = useState([])
  // isDone check is to should call init
  const [isDone, setIsDone] = useState(true)
  // check to or from on search box
  const [searchType, setSearchType] = useState(false)
  // result of search
  const [searchList, setSearchList] = useState([])
  // check is searching
  const [isSearch, setIsSearch] = useState(false)
  // symbol for search
  const [symbol, setSymbol] = useState('')
  // declare function
  // running first
  useEffect(() => {
    init().then()
    return () => {}
  }, [])

  // init using to get all swap
  async function init() {
    if (page <= maxPage) {
      const res = await getAllSwaps(page)
      if (page === 0) {
        const elementCount = res.data[res.data.length - 1][0]['COUNT(*)']
        const mPage = Math.floor(elementCount / 30)
        setMaxPage(mPage)
      }
      const swaps = await AssetEffect.getAvailableSwaps(res, allAsset, balances)
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
    } else {
      return false
    }
  }
  // onCLickSegment was called when user press on tab
  function onClickSegment(segment) {
    setSegment(segment)
  }

  async function onChangeSearchType() {
    setSearchType(!searchType)
    setSymbol('')
    setIsSearch(false)
    await init()
  }
  async function onSearch(symbol) {
    setSymbol(symbol)
    if (symbol.length > 0) {
      const arr = []
      const type = searchType ? 'toAsset' : 'fromAsset'
      let keys = Object.keys(allAsset)
      let a = keys.filter(e => {
        return allAsset[e].Symbol === symbol
      })
      const count = a.length
      for (let i = 0; i < count; i++) {
        let res = await getSwapsSearch({ type, assetID: a[i] })
        let final = await AssetEffect.getAvailableSwaps(res, allAsset, balances)
        final.forEach(e => {
          arr.push(e)
        })
      }
      setIsSearch(true)
      setSearchList(arr)
    } else {
      setIsSearch(false)
    }
  }
  // check is scroll to end
  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
  }

  return (
    <SafeAreaView style={s.wrapper}>
      <KeyboardAvoidingView
        enabled={segment !== 2}
        behavior={'position'}
        style={s.container}
      >
        <ScrollView
          scrollEventThrottle={400}
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
              <View style={s.searchBox}>
                <View>
                  <View style={s.inputCover}>
                    <TextInput
                      autoCapitalize={'characters'}
                      autoCorrect={false}
                      value={symbol}
                      autoFocus={false}
                      placeholder={'Input Symbol to search. Ex: FSN...'}
                      style={s.input}
                      onChangeText={text => {
                        onSearch(text)
                      }}
                    />
                  </View>
                  <Text style={s.sub}>
                    You are looking for {searchType ? 'send' : 'receive'}{' '}
                    asset...
                  </Text>
                </View>

                <View>
                  <Button
                    title={searchType ? 'send' : 'receive'}
                    onPress={onChangeSearchType}
                  />
                </View>
              </View>
              {// check swapsData is empty
              !isSearch ? (
                allSwap.length > 0 ? (
                  // if not it will map swapsData array to render
                  allSwap.map((e, i) => {
                    return (
                      <AvailableSwap
                        segment={segment}
                        key={i.toString()}
                        swap={e}
                      />
                    )
                  })
                ) : (
                  // if swapsData is empty return this text
                  <Text style={s.noOpen}>NO OPEN SWAPS</Text>
                )
              ) : searchList.length > 0 ? (
                // if not it will map swapsData array to render
                searchList.map((e, i) => {
                  return (
                    <AvailableSwap
                      segment={segment}
                      key={i.toString()}
                      swap={e}
                    />
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
  searchBox: {
    marginTop: metrics.margin.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.padding.base,
  },
  input: {
    height: metrics.input.large.height,
  },
  inputCover: {
    paddingHorizontal: metrics.padding.double,
    borderRadius: metrics.border.radius.circle,
    borderWidth: metrics.border.width.double,
  },
  sub: {
    marginTop: metrics.margin.base,
    marginLeft: metrics.margin.double,
  },
})
