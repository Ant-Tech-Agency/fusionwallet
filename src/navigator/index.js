import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation'
import { Home } from '../screens/Home/Home'
import { AccessWallet } from '../screens/AccessWallet/AccessWallet'
import { Loading } from '../screens/Loading/Loading'
import { CreateNewWallet } from '../screens/CreateNewWallet/CreateNewWallet'
import { OpenWalletWithJSON } from '../screens/OpenWalletWithJSON/OpenWalletWithJSON'
import { QuantumSwaps } from '../screens/QuantumSwaps/QuantumSwaps'
import { BBC } from '../../components/bbc/BBC'
const HomeModal = createStackNavigator(
  {
    Home,
    BBC,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)
export const PublicStack = createStackNavigator(
  {
    HomeModal,
    QuantumSwaps,
  },
  {
    initialRouteName: 'HomeModal',
    headerMode: 'none',
  }
)

export const PrivateStack = createStackNavigator(
  {
    AccessWallet,
    CreateNewWallet,
    AccessWalletWithKeyStore: OpenWalletWithJSON,
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
