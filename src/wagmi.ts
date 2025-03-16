import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {http} from 'wagmi';
import {arbitrum, foundry, mainnet, optimism, polygon} from 'wagmi/chains';

const ANVIL_URL = 'http://127.0.0.1:8545';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'a159d003adf3197c439c82598a53231b',
  // chains: [mainnet, polygon, optimism, arbitrum, base, foundry],
  chains: [foundry],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [foundry.id]: http(ANVIL_URL),
  },

});