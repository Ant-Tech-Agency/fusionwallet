import React, { useState } from 'react'
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { colors, images, metrics } from '../../themes'
import I18n from '../../i18n'
import { AButton } from '../../../components/AButton'
import { Wallet } from '../../libs/wallet'
import * as FileSystem from 'expo-file-system'
import { useNavigation } from 'react-navigation-hooks'

export const CreateNewWallet = () => {
  const { goBack } = useNavigation()
  const [password, setPassword] = useState('123456789')

  async function onCreateFile() {
    try {
      const wallet = await Wallet.generate(false)
      const keystore = await wallet.toV3(password, {
        kdf: 'scrypt',
        n: 8192,
      })

      const path = FileSystem.documentDirectory + wallet.getV3FileName()

      await FileSystem.writeAsStringAsync(path, JSON.stringify(keystore))

      const info = await FileSystem.getInfoAsync(path)

      alert(JSON.stringify(info))
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <Image source={images.logo} style={s.logo} />
      <Text style={s.title}>{I18n.t('createNewWallet')}</Text>
      <Text style={s.note}>
        {I18n.t('createNoteFirst')}
        <Text style={s.underline}>{I18n.t('createNoteUnderLine')}</Text>
        {I18n.t('createNoteLast')}
      </Text>

      <View style={s.form}>
        <Text style={s.subTitle}>{I18n.t('enterPassword').toUpperCase()}</Text>
        <View style={s.inputCover}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={I18n.t('passwordPlaceHolder')}
            style={s.input}
          />
        </View>
        <Text style={[s.note, s.underline]}>* {I18n.t('createSubNote')}</Text>
        <AButton title={I18n.t('createNewWallet')} onPress={onCreateFile} />
        <AButton title={'Go back'} onPress={() => goBack()} />
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? metrics.padding.base : 0,
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
  note: {
    fontSize: metrics.font.text.t2,
    marginHorizontal: metrics.margin.base,
    marginVertical: metrics.margin.base,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  form: {
    marginHorizontal: metrics.margin.base,
  },
  subTitle: {
    fontSize: metrics.font.header.h2,
    color: colors.text.primary,
    marginVertical: metrics.margin.base,
    alignSelf: 'center',
    fontWeight: '500',
  },
  inputCover: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginVertical: metrics.margin.base,
    height: metrics.input.large.height,
    justifyContent: 'center',
    width: metrics.input.large.width,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    fontSize: metrics.font.text.t1,
    textAlign: 'center',
  },
})
