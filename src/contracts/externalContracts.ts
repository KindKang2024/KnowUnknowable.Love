import { foundry } from "viem/chains";
import deployedContracts from "./deployedContracts";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */

// const chainId = foundry.id;
// is development or production
const scroll = 534352;
const scrollSepolia = 534351;


export const dukiDaoContractConfig = {
    [foundry.id]: {
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[foundry.id].ERC1967Proxy.address,
        stableCoin: deployedContracts[foundry.id].MyERC20Mock.address,
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        investFee: 100, // 100 USDT,
        explorer: "http://localhost:8545",
        requestDaoEvolutionGasLimit: 100000000000000,
    },
    [scrollSepolia]: {
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[scrollSepolia].ERC1967Proxy.address,
        stableCoin: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        explorer: "https://sepolia.scrollscan.com",
        requestDaoEvolutionGasLimit: 100000000000000,
    },
    [scroll]: {
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[scroll].ERC1967Proxy.address,
        stableCoin: "0x6b1757362ca034e2bf97ab53b1783c0041bd8f7e",
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        explorer: "https://scrollscan.com",
        requestDaoEvolutionGasLimit: 100000000000000,
    }
} as const;


export const isMaintainer = (address: string) => {
    return address === '0xe6e340d132b5f46d1e472debcd681b2abc16e57e';
}
