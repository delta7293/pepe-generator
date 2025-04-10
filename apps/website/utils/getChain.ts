import { defineChain } from 'viem';
import { foundry, mainnet, sepolia } from 'viem/chains';


export default function getChain() {
  if (process.env.NEXT_PUBLIC_CHAIN === 'mainnet') {
    return mainnet;
  }

  if (process.env.NEXT_PUBLIC_CHAIN === 'sepolia') {
    return sepolia;
  }

  if (process.env.NEXT_PUBLIC_CHAIN === 'remoteFoundry') {
    return defineChain({
      id: 90_092,
      name: 'Foundry (Pepe)',
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: {
        default: {
          http: ['http://3.226.229.3:8545'],
          webSocket: ['ws://3.226.229.3:8545'],
        },
      },
    });
  }

  return foundry;
}
