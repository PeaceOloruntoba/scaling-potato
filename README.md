# Scaling Potato - BNB Testnet Wallet Monitor

This script monitors a given wallet address for **incoming BNB** and **USDT (BEP20)** transactions on the **BNB Smart Chain Testnet**.  
It listens to new blocks and `Transfer` events, then logs any detected transactions to the console with details like amount, sender, timestamp, and transaction hash.

---

## Features
- ✅ Detects **incoming BNB transfers**  
- ✅ Detects **incoming USDT transfers** (BEP20 testnet contract)  
- ✅ Formats amounts using correct decimals  
- ✅ Shows transaction hash, sender, timestamp in ISO format  
- ✅ Easy configuration via variables or `.env` file  

---

## Requirements
- Node.js (v18 or later recommended)  
- NPM or Yarn  
- An internet connection  

---

## Installation

Clone the repo (or copy the script) and install dependencies:

```bash
npm install ethers
```

---

## Configuration

In the script, update the variables at the top:

```js
// 🔑 Replace with your wallet address (Testnet address)
const WALLET_ADDRESS = "0xYourWalletAddressHere";

// 🛰️ BNB Testnet WebSocket RPC
const BNB_TESTNET_WSS = "wss://bsc-testnet.publicnode.com";

// 💵 USDT Contract on BNB Testnet
const USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";
```

Alternatively, you can use a `.env` file:

```env
WALLET_ADDRESS=0xYourWalletAddressHere
BNB_TESTNET_WSS=wss://bsc-testnet.publicnode.com
USDT_ADDRESS=0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
```

---

## Running the Script

Start monitoring with:

```bash
node monitor.js
```

You should see:

```
🚀 Monitoring 0xYourWalletAddressHere for incoming BNB/USDT on BNB Testnet...
USDT decimals: 18
```

---

## Testing the Script

1. Create a **BNB Testnet wallet** (use MetaMask or similar).  
2. Get **test BNB** from a [BNB Testnet faucet](https://testnet.bnbchain.org/faucet-smart).  
3. Send some **BNB** to your wallet → the script will log it.  
4. For USDT testing, use the official **BNB Testnet USDT contract** and transfer tokens to your wallet.

---

## Example Output

```
🚀 Monitoring 0x1234...abcd for incoming BNB/USDT on BNB Testnet...
USDT decimals: 18

{
  type: 'BNB',
  txHash: '0xabcdef123456...',
  amount: '0.5 BNB',
  sender: '0x9876...1234',
  timestamp: '2025-09-26T19:55:47.000Z'
}

{
  type: 'USDT',
  txHash: '0x9876543210...',
  amount: '100.0 USDT',
  sender: '0x5555...aaaa',
  timestamp: '2025-09-26T20:05:21.000Z'
}
```

---

## Stopping the Script

Press **CTRL + C** to exit. The WebSocket connection will close automatically.

---
