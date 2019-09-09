import './global'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Web3Store } from './src/stores/web3.store'
import { WalletStore } from './src/stores/wallet.store'
import { WalletEffect } from './src/effects/wallet.effect'
import {Navigator} from './src/navigator'
Web3Store.default.init()

export default function App() {
  // const [privateKey, setPrivateKey] = useState(
  //   'B2A6B4E1E510FE05AB051C9944B433427D90F2D117E1B32248A1B811BCDB54F9'
  // )
  // useEffect(() => {
  //   WalletStore.default.init(privateKey).then(() => {
  //     console.log('Initialized', WalletStore.default.address)
  //     WalletEffect.getAllBalances().then(data => {
  //       console.log('data', data)
  //     })
  //   })
  // }, [])

  async function sendAsset() {
    let a = await WalletEffect.sendAsset()
    alert(a)
  }

  return (
    <Navigator/>
  );
}

const styles = StyleSheet. create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
