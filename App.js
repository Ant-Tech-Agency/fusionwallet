import './global'
import React, { useEffect } from 'react'
import Web3 from 'web3'
import { StyleSheet, Text, View } from 'react-native'
import Web3FusionExtend from 'web3-fusion-extend'
import WebsocketProvider from './ether-socket-provider'

let web3
let fusion

function refreshProvider(providerUrl) {
  let retries = 0

  const retry = (event) => {
    if (event) {
      console.log('Web3 provider disconnected or errored.')
      retries += 1

      if (retries > 5) {
        console.log(`Max retries of 5 exceeding: ${retries} times tried`)
        return setTimeout(refreshProvider, 5000)
      }
    } else {
      console.log(`Reconnecting web3 provider`)
      refreshProvider(providerUrl)
    }

    return null
  }

  const provider = new WebsocketProvider(providerUrl)

  provider.on('end', () => retry())
  provider.on('error', () => retry())

  console.log('New Web3 provider initiated')

  web3 = new Web3(provider)
  fusion = Web3FusionExtend.extend(web3)

  return provider
}

export default function App() {
  useEffect(() => {
    const provider = refreshProvider('wss://testnetpublicgateway1.fusionnetwork.io:10001')
  }, [])

  return (
    <View style={styles.container}>
      <Text>{'Linh'}</Text>
    </View>
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
