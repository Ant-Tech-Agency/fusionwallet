import { ActivityIndicator, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from 'react-navigation-hooks'
import { WalletStore } from '../../stores/wallet.store'

export const Loading = () => {
  const { navigate } = useNavigation()

  async function auth() {
    try {
      const key = await WalletStore.getPrivateKey()
      if (key) {
        await WalletStore.default.init(key)
        navigate('Home')
      } else {
        navigate('AccessWallet')
      }
    } catch (e) {
      console.log(e)
      await WalletStore.deletePrivateKey()
    }
  }

  useEffect(() => {
    auth().then(() => {
      console.log('Authorized')
    })
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size={'large'} color={'tomato'} />
    </View>
  )
}
