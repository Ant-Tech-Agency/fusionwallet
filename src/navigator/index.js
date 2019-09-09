import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation'
import { Home } from '@/screens/Home/Home'
import { AccessWallet } from '@/screens/AccessWallet/AccessWallet'
import { Loading } from '@/screens/Loading/Loading'
import { CreateNewWallet } from '@/screens/CreateNewWallet/CreateNewWallet'
import { AccessWalletWithKeyStore } from '@/screens/AccessWalletWithKeyStore/AccessWalletWithKeyStore'
import { QuantumSwaps } from '@/screens/QuantumSwaps/QuantumSwaps'

export const PublicStack = createStackNavigator(
  {
    Home,
    QuantumSwaps,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
)

export const PrivateStack = createStackNavigator(
  {
    AccessWallet,
    CreateNewWallet,
    AccessWalletWithKeyStore,
  },
  {
    initialRouteName: 'AccessWallet',
    headerMode: 'none',
  }
)

export const SwitchStack = createSwitchNavigator(
  {
    PublicStack,
    PrivateStack,
    Loading,
  },
  {
    initialRouteName: 'Loading',
  }
)

export const Navigator = createAppContainer(SwitchStack)
