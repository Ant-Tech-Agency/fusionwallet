import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import * as DP from 'expo-document-picker'
import * as FS from 'expo-file-system'
import { WalletStore } from '../../stores/wallet.store'
import { Wallet } from '../../libs/wallet'
import { colors, images, metrics } from '../../themes'
import I18n from '../../i18n'
import { AButton } from '../../../components/AButton'
import { DocumentPicker } from './component/DocumentPicker'
import { PATH } from '../../constants/FilePath'

export const AccessWalletWithKeyStore = () => {
  const { goBack, navigate } = useNavigation()
  const [password, setPassword] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [fileContent, setFileContent] = useState(null)
  const [isKeyStore, setIsKeyStore] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  function pickerToggle() {
    setIsOpen(!isOpen)
  }

  async function onOpenFile(fileName) {
    console.log(fileName)
    const fileContent = await FS.readAsStringAsync(PATH + fileName)
    console.log(fileContent)
    setFileContent(fileContent)
    setIsKeyStore(true)
    setFileInfo(fileName)

  }

  async function onUnLockWithKeyStore() {
    try {
      WalletStore.default.wallet = await Wallet.fromV3(
        fileContent,
        password,
        true
      )
      navigate('Home')
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  return (
    <SafeAreaView style={s.container}>
      <Image style={s.logo} source={images.logo} />
      <Text style={s.title}>{I18n.t('accessExitsTitle')}</Text>
      <View style={s.content}>
        {fileInfo && (
          <TouchableOpacity onPress={onOpenFile} style={s.fileHandler}>
            <View style={s.fileHandlerContent}>
              <Text>Current file name: {fileInfo}</Text>
            </View>
          </TouchableOpacity>
        )}
        {isKeyStore && (
          <View style={s.inputCover}>
            <TextInput
              secureTextEntry={true}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholder={I18n.t('enterPassword')}
              style={s.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        )}
        <AButton
          onPress={!isKeyStore ? pickerToggle : onUnLockWithKeyStore}
          title={
            !isKeyStore ? I18n.t('openWalletKeyStore') : I18n.t('accessWallet')
          }
        />
        <AButton onPress={goBack} title={I18n.t('accessExitsTitle')} />
      </View>
      {isOpen && (
        <DocumentPicker
          onPick={filename => onOpenFile(filename)}
          onPress={pickerToggle}
        />
      )}
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
  content: {
    flex: 1,
  },
  fileHandler: {
    width: metrics.button.large.width,
    padding: metrics.padding.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignSelf: 'center',
    borderColor: colors.border.primary,
  },
  fileHandlerContent: {
    alignSelf: 'center',
    width: '100%%',
    padding: metrics.padding.base,
    backgroundColor: colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    fontSize: metrics.font.text.t1,
    textAlign: 'center',
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
})
