import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Platform,
} from 'react-native'
import React, { useState } from 'react'
import { WalletStore } from '../../stores/wallet.store'
import { useNavigation } from 'react-navigation-hooks'
import { AButton } from '../../../components/AButton'
import { colors, images, metrics } from '../../themes'
import I18n from '../../i18n'

export const AccessWallet = () => {
  const [privateKey, setPrivateKey] = useState(
    'B2A6B4E1E510FE05AB051C9944B433427D90F2D117E1B32248A1B811BCDB54F9'
  )
  const { navigate } = useNavigation()
  async function onUnlock() {
    if (privateKey) {
      await WalletStore.default.init(privateKey)
      navigate('Home')
    } else {
      alert('Please enter your private key')
    }
  }

  function onCreateNew() {
    navigate('CreateNewWallet')
  }

  async function onOpenFile() {
    navigate('AccessWalletWithKeyStore')
  }

  return (
    <SafeAreaView style={s.container}>
      <Image style={s.logo} source={images.logo} />
      <Text style={s.title}>{I18n.t('accessExitsTitle')}</Text>
      <KeyboardAvoidingView behavior={'position'} style={s.form}>
        <Text style={s.textKey}>{I18n.t('privateKey')} :</Text>
        <View style={s.inputCover}>
          <TextInput
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={I18n.t('enterPrivateKey')}
            style={s.input}
            value={privateKey}
            onChangeText={setPrivateKey}
          />
        </View>

        <AButton onPress={onUnlock} title={I18n.t('openWallet')} />
        <AButton onPress={onCreateNew} title={I18n.t('createNewWallet')} />
        <AButton onPress={onOpenFile} title={I18n.t('openWalletKeyStore')} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        paddingTop: metrics.padding.base,
      },
      ios: {
        paddingTop: 0,
      },
    }),
  },
  logo: {
    width: metrics.logo.width,
    height: metrics.logo.height,
  },
  title: {
    alignSelf: 'center',
    fontSize: metrics.font.header.h1,
    color: colors.text.primary,
    textDecorationLine: 'underline',
    marginVertical: metrics.margin.triple,
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.margin.triple,
    paddingVertical: metrics.padding.base,
  },
  textKey: {
    fontSize: metrics.font.header.h2,
    color: colors.text.primary,
    marginVertical: metrics.margin.base,
    alignSelf: 'center',
    fontWeight: '500',
  },
  inputCover: {
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginVertical: metrics.margin.base,
    height: metrics.input.large.height,
    justifyContent: 'center',
    width: metrics.input.large.width,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    fontSize: metrics.font.text.t1,
    textAlign: 'center',
  },
  fileName: {
    fontSize: metrics.font.text.t2,
    color: colors.text.primary,
    marginHorizontal: metrics.margin.double,
  },
})
