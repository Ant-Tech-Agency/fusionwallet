import './global'
import React, { useEffect, useState } from 'react'
import { Web3Store } from './src/stores/web3.store'
import {Navigator} from './src/navigator'
Web3Store.default.init()

export default function App() {
  return (
    <Navigator/>
  );
}

