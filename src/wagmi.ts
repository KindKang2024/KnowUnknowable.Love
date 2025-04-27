import {getDefaultConfig} from '@rainbow-me/rainbowkit';
import {fallback, http} from 'wagmi';
import {arbitrum, foundry, mainnet, optimism, polygon, scroll, scrollSepolia} from 'wagmi/chains';


const ANVIL_URL = 'http://127.0.0.1:8545';
const SCROLL_URL = "https://scroll-mainnet.g.alchemy.com/v2/won93Ou1nTcFLb8kzr1Fd15vdvPoczLu";

const isDev = process.env.NODE_ENV === 'development';

export const config = getDefaultConfig({
  appName: 'KnowUnknownable.Love',
  projectId: 'a159d003adf3197c439c82598a53231b',
  // chains: [mainnet, polygon, optimism, arbitrum, base, foundry],
  // chains: [foundry, scroll, scrollSepolia],
  chains: [isDev ? foundry : scroll],
  pollingInterval: 8000,
  cacheTime: 8000,
  ssr: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    // [arbitrum.id]: fallback([http(), http()]),
    [scroll.id]: fallback([http(SCROLL_URL), http()]),
    [scrollSepolia.id]: http(),
    [foundry.id]: http(ANVIL_URL),
  },

});