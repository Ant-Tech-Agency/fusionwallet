import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native"
import React, { useState } from "react"
import { useNavigation } from "react-navigation-hooks"
import { colors, images, metrics } from "../../themes"
import { AButton } from "../../../components/AButton"
import I18n from "../../i18n"
import { AssetData } from "web3-fusion-extend"
import { AssetItem } from "./components"
import { AInput } from "../../../components/AInput"
import { BigNumber } from "../../shared/big-number"
import { WalletConstant } from "../../constants/wallet.constant"
import { useAsyncEffect } from "use-async-effect"
import { WalletEffect } from "../../effects/wallet.effect"
import { AssetEffect } from "../../effects/asset.effect"
import { WalletStore } from "../../stores/wallet.store"
// import { TimeLock } from "@/screens/Home/components/TimeLock"
// import { TxType } from "@/constants/tx-type.constant"

export const Home = () => {
  const { navigate } = useNavigation()

  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [assets, setAssets] = useState([])
  const [assetName, setAssetName] = useState('')
  const [toAddress, setToAddress] = useState(
    '0X373974CA4F8985F6FA51AB3F7DE3DD61473BA702'
  )
  const [quantity, setQuantity] = useState('')
  const [supply, setSupply] = useState('')
  const [pickedAsset, setPickedAsset] = useState(null)
  const [symbol, setSymbol] = useState('')
  const [isFixed, setIsFixed] = useState(false)
  const [decimals, setDecimals] = useState(18)
  // const [timeLockType, setTimeLockType] = useState()
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  useAsyncEffect(
     async () => {
       await init()

      return setInterval( async () => {
        await  init()
      }, 30000)
    },
    timer => {
      clearInterval(timer)
    },
    []
  )

  async function init() {
    try {
      setLoading(true)

      const balances = await WalletEffect.getAllBalances()

      const assets = await AssetEffect.getAllAssets()

      const balance = balances[WalletConstant.FsnTokenAddress] || 0
      setBalance(balance / BigNumber.generateDecimal(18))

      const userAssets = AssetEffect.getAssetsFromBalances(
        assets,
        balances
      )
      setAssets(userAssets)
    } catch (e) {
      return e
    } finally {
      setLoading(false)
    }
  }

  async function onLogOut() {
    await WalletStore.deletePrivateKey()
    navigate('AccessWallet')
  }

  async function onCreateAsset() {
    try {
      const data = {
        total: supply,
        decimals,
        name: assetName,
        symbol,
        canChange: isFixed,
        description: '{}',
      }

      const txHash = await WalletEffect.createAsset(data)

      setAssetName('')
      setSupply('')
      setSymbol('')
      setDecimals(0)

      alert(txHash)

      await init()
    } catch (e) {
      console.log(e)
    }
  }

  async function onSendAsset() {
    try {
      if (!pickedAsset) {
        alert('Please select asset that you want to send')
        return
      }
      if (!quantity) {
        alert('Please enter quantity that you want to send')
        return
      }

      const data = {
        asset: pickedAsset,
        value: quantity,
        to: toAddress,
      }
      const txHash = await WalletEffect.sendAsset(data)
      alert(txHash)
      setPickedAsset(null)
      setQuantity('')

      await init()


      // switch (timeLockType) {
      //   case TxType.DateRange: {
      //     const txHash = await WalletEffect.sendAssetDateRange({
      //       ...data,
      //       start: fromDate.toString(),
      //       end: toDate.toString(),
      //     })
      //     alert(txHash)
      //     break
      //   }
      //   case TxType.Scheduled: {
      //     const txHash = await WalletEffect.sendAssetScheduled({
      //       ...data,
      //       start: fromDate.toString(),
      //     })
      //     alert(txHash)
      //     break
      //   }
      //   case TxType.None: {
      //     const txHash = await WalletEffect.sendAsset(data)
      //     alert(txHash)
      //   }
      // }

      setPickedAsset(null)
      setQuantity('')

      await init()
    } catch (e) {
      // alert(get(e, o => o.message))
      console.log(e)
    }
  }

  return (
    <SafeAreaView style={s.wrapper}>
      <KeyboardAvoidingView behavior={'padding'} style={s.container}>
        <Image style={s.logo} source={images.logo} />
        <Text style={s.titleScreen}>{I18n.t('walletInfo')}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.wrapper}>
            <Text style={s.textCategory}>{I18n.t('fusionBalance')}: </Text>
            <View style={s.wrapBalance}>
              <Text style={s.textBalance}>
                {loading ? 'Loading...' : `${balance}`}{' '}
                <Text style={s.textCategory}>FSN</Text>
              </Text>
            </View>
            <View style={s.publicAddressCover}>
              <Text style={s.textCategory}>{I18n.t('publicAddress')}:</Text>
              <Text style={s.textPublicAddress}>
                {WalletStore.default.address}
              </Text>
            </View>
          </View>


          {/*<View style={s.wrapInput}>*/}
          {/*  <Text style={s.titleFeature}> Quantum Swaps </Text>*/}
          {/*  {assets.length > 0 ? (*/}
          {/*    <AButton*/}
          {/*      title={'Quantum Swaps'}*/}
          {/*      onPress={() => navigate('QuantumSwaps', { data: assets })}*/}
          {/*    />*/}
          {/*  ) : (*/}
          {/*    <ActivityIndicator size={'large'} color={'tomato'} />*/}
          {/*  )}*/}
          {/*</View>*/}


          <View style={s.wrapInput}>
            <Text style={s.titleFeature}>{I18n.t('assetCreation')}</Text>
            <View style={s.inputCover}>
              <AInput
                autoCorrect={false}
                value={assetName}
                onChangeText={asset => setAssetName(asset)}
                name={I18n.t('assetName')}
              />
              <AInput
                value={supply}
                keyboardType={'number-pad'}
                onChangeText={value => setSupply(value)}
                name={I18n.t('supply')}
              />
              <AInput
                autoCorrect={false}
                value={symbol}
                onChangeText={value => setSymbol(value.toUpperCase())}
                autoCapitalize={'characters'}
                maxLength={4}
                name={I18n.t('assetSymbol')}
              />
              <AInput
                value={decimals.toString()}
                maxLength={2}
                keyboardType={'number-pad'}
                onChangeText={value => setDecimals(value ? parseInt(value) : 0)}
                name={I18n.t('decimals')}
              />
              <View style={s.switchCover}>
                <Text style={s.label}>{isFixed ? 'Changeable' : 'Fixed'}</Text>
                <Switch
                  style={s.switchButton}
                  value={isFixed}
                  onValueChange={() => setIsFixed(!isFixed)}
                />
              </View>
              <AButton
                positions="right"
                size="small"
                title={I18n.t('createAssets')}
                onPress={onCreateAsset}
              />
            </View>
          </View>

          <View style={s.wrapInput}>
            <Text style={s.titleFeature}>{I18n.t('sendAsset')}</Text>
            <View style={s.inputCover}>
              <AInput
                value={toAddress}
                onChangeText={text => setToAddress(text)}
                name={I18n.t('to')}
              />
              <AInput
                value={quantity}
                onChangeText={text => setQuantity(text)}
                name={I18n.t('quantity')}
              />
              {pickedAsset && (
                <View>
                  <Text style={s.labelCover} numberOfLines={1}>
                    <Text style={s.label}>Asset Picked :</Text>{' '}
                    {pickedAsset.Name}
                  </Text>
                  {/*<TimeLock*/}
                  {/*  onFromDateChange={date => setFromDate(date)}*/}
                  {/*  onToDateChange={date => setToDate(date)}*/}
                  {/*  setTimeLockType={tag => setTimeLockType(tag)}*/}
                  {/*/>*/}
                </View>
              )}

              <AButton
                positions="right"
                size="small"
                title={I18n.t('sendAsset')}
                onPress={onSendAsset}
              />
            </View>
            <AButton title={'Refresh'} onPress={init} />
            {assets && !loading ? (
              <FlatList
                data={assets}
                keyExtractor={item => item.ID}
                scrollEnabled={false}
                renderItem={({ item, index }) => {
                  return (
                    <AssetItem
                      asset={item}
                      index={index}
                      onPress={e => setPickedAsset(e)}
                    />
                  )
                }}
              />
            ) : (
              <ActivityIndicator size={'large'} color={'tomato'} />
            )}
          </View>
          <AButton onPress={onLogOut} title={I18n.t('logout')} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
  wrapBalance: {
    marginVertical: metrics.margin.base,
    justifyContent: 'center',
  },
  textBalance: {
    fontSize: metrics.font.coin,
    fontWeight: '700',
    color: colors.text.primary,
  },
  publicAddressCover: {
    marginBottom: metrics.margin.triple,
  },
  textPublicAddress: {
    fontSize: metrics.font.text.t3,
    fontWeight: '600',
    color: colors.text.primary,
  },
  textCategory: {
    fontSize: metrics.font.header.h2,
    color: colors.text.primary,
  },
  titleFeature: {
    fontSize: metrics.font.header.h2,
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.text.primary,
    marginBottom: metrics.margin.double,
  },
  wrapInput: {
    flex: 1,
    paddingHorizontal: metrics.padding.base,
    marginBottom: metrics.padding.base,
  },
  inputCover: {
    flex: 1,
    justifyContent: 'center',
  },
  switchCover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: metrics.margin.base,
  },
  switchButton: {
    alignSelf: 'flex-end',
  },
  labelCover: {
    marginTop: metrics.margin.base,
  },
  label: {
    fontSize: metrics.font.text.t1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
})
