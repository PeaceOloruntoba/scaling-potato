const { ethers } = require("ethers");

// Helper: format timestamps
const formatTimestamp = (ts) => new Date(ts * 1000).toISOString();

/* ------------------------
   CONFIGURATION VARIABLES
------------------------- */

// Replace with your wallet address
// .env -> WALLET_ADDRESS=0xYourWalletAddressHere
const WALLET_ADDRESS = "0xYourWalletAddressHere";

// BNB Testnet WebSocket RPC
// .env -> BNB_TESTNET_RPC=wss://bsc-testnet.publicnode.com
const BNB_TESTNET_RPC = "wss://bsc-testnet.publicnode.com";

// USDT contract on BNB Testnet
// .env -> USDT_ADDRESS=0x337610d27c682E347C9cD60BD4b3b107C9d34dDd
const USDT_ADDRESS = "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd";

const USDT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function decimals() view returns (uint8)",
];

/* ------------------------
   PROVIDER + CONTRACT SETUP
------------------------- */
const provider = new ethers.WebSocketProvider(BNB_TESTNET_RPC);
const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, provider);

let usdtDecimals = 18;
(async () => {
  try {
    usdtDecimals = await usdtContract.decimals();
    console.log(`USDT decimals: ${usdtDecimals}`);
  } catch {
    console.warn("⚠️ Could not fetch decimals, defaulting to 18");
  }
})();

/* ------------------------
   MONITOR INCOMING BNB
------------------------- */
provider.on("block", async (blockNumber) => {
  try {
    // includeTransactions = true
    const block = await provider.getBlock(blockNumber, true);
    for (const tx of block.transactions) {
      if (
        tx.to?.toLowerCase() === WALLET_ADDRESS.toLowerCase() &&
        tx.value > 0n
      ) {
        console.log({
          type: "BNB",
          txHash: tx.hash,
          amount: ethers.formatEther(tx.value) + " BNB",
          sender: tx.from,
          timestamp: formatTimestamp(block.timestamp),
        });
      }
    }
  } catch (error) {
    console.error("Error processing block:", error);
  }
});

/* ------------------------
   MONITOR INCOMING USDT
------------------------- */
usdtContract.on("Transfer", async (from, to, value, event) => {
  if (to.toLowerCase() === WALLET_ADDRESS.toLowerCase()) {
    try {
      const block = await provider.getBlock(event.log.blockNumber);
      console.log({
        type: "USDT",
        txHash: event.log.transactionHash,
        amount: ethers.formatUnits(value, usdtDecimals) + " USDT",
        sender: from,
        timestamp: formatTimestamp(block.timestamp),
      });
    } catch (error) {
      console.error("Error processing USDT transfer:", error);
    }
  }
});

console.log(
  `🚀 Monitoring ${WALLET_ADDRESS} for incoming BNB/USDT on BNB Testnet...`
);

process.on("SIGINT", () => {
  provider.destroy();
  process.exit();
});
