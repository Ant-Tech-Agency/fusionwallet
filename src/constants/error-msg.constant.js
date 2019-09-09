export const ErrorMsg = [
  'Please enter a valid amount.', // 0
  'Your password must be at least 9 characters. Please ensure it is a strong password. ', // 1
  "Sorry! We don't recognize this type of wallet file. ", // 2
  'This is not a valid wallet file. ', // 3
  "This unit doesn't exists, please use the one of the following units ", // 4
  'Please enter a valid ethereum address. (0x...) ', // 5
  'Please enter a valid password. ', // 6
  'Please enter valid decimals (Must be integer, 0-18). ', // 7
  'Please enter a valid gas limit (Must be integer. Try 21000-4000000). ', // 8
  'Please enter a valid data value (Must be hex). ', // 9
  'Please enter a valid gas price. ', // 10 - NOT USED
  'Please enter a valid nonce (Must be integer).', // 11
  'Invalid signed transaction. ', // 12
  'A wallet with this nickname already exists. ', // 13
  'Wallet not found. ', // 14
  "Whoops. It doesn't look like a proposal with this ID exists yet or there is an error reading this proposal. ", // 15 - NOT USED
  'A wallet with this address already exists in storage. Please check your wallets page. ', // 16
  '(error_17) Insufficient balance of ETH. Your gas limit * gas price + amount to send exceeds your current balance. Send more ETH to your account or use the "Send Entire Balance" button. If you believe this is in error, try pressing generate again. Required (d+) and got: (d+). [Learn More.](https://kb.myetherwallet.com/transactions/transactions-not-showing-or-pending.html)', // 17
  'All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.', // 18
  'Please enter a valid symbol', // 19
  'Not a valid ERC-20 token', // 20
  'Could not estimate gas. There are not enough funds in the account, or the receiving contract address would throw an error. Feel free to manually set the gas and proceed. The error message upon sending may be more informative.', // 21
  'Please enter valid node name', // 22
  'Enter valid URL. If you are on https, your URL must be https', // 23
  'Please enter a valid port. ', // 24
  'Please enter a valid chain ID. ', // 25
  'Please enter a valid ABI. ', // 26
  'Minimum amount: 0.01. Max amount: ', // 27
  'You need this Keystore File + Password or the Private Key (next page) to access this wallet in the future. ', // 28
  'Please enter a valid user and password. ', // 29
  'Please enter a valid name (7+ characters, limited punctuation) ', // 30
  'Please enter a valid secret phrase. ', // 31
  'Could not connect to the node. Refresh your page, try a different node (top-right corner), check your firewall settings. If custom node, check your configs.', // 32
  "The wallet you have unlocked does not match the owner's address. ", // 33
  'The name you are attempting to reveal does not match the name you have entered. ', // 34
  'Input address is not checksummed. <a href="https://kb.myetherwallet.com/addresses/what-does-checksummed-mean.html" target="_blank" rel="noopener noreferrer"> Click here to learn what this means.</a>', // 35
  'Please enter valid TX hash', // 36
  'Please enter valid hex string. Hex only contains: 0x, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, a, b, c, d, e, f', // 37
  'Offer must have either price or reserve set to more than 0', // 38
  'Bid must be more than the specified minimum', // 39
  'Please enter a valid private key', // 40
]
