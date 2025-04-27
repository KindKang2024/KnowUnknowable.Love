import {foundry} from "viem/chains";
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

// if development, use foundry
// if production, use scroll
const scroll = 534352;
const scrollSepolia = 534351;

export const defaultChainWhenNotConnected = process.env.NODE_ENV === 'development' ? foundry.id : scroll;

export const MaxInvestorCount = 64; 
export const InvestFeeDollarAmount = 369; // 369 USDT,
export const InvestFeeBaseAmount = InvestFeeDollarAmount * 10 ** 6; // 369 USDT,


export const dukiDaoContractConfig = {
    [foundry.id]: {
        name: "Foundry",
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[foundry.id].ERC1967Proxy.address,
        stableCoin: deployedContracts[foundry.id].MyERC20Mock.address,
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        explorer: "http://localhost:3000/debug",
        bridge: "http://localhost:3000/debug",
        requestDaoEvolutionGasLimit: 100000000000000,
    },
    [scrollSepolia]: {
        name: "Scroll Sepolia",
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[scrollSepolia].ERC1967Proxy.address,
        stableCoin: deployedContracts[scrollSepolia].MyERC20Mock.address,
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        explorer: "https://sepolia.scrollscan.com",
        bridge: "https://portal-sepolia.scroll.io/bridge",
        requestDaoEvolutionGasLimit: 100000000000000,
    },
    [scroll]: {
        name: "Scroll",
        ZeroAddress: '0x0000000000000000000000000000000000000000',
        address: deployedContracts[scroll].ERC1967Proxy.address,
        stableCoin: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
        StableCoinBase: 10 ** 6,
        StableCoinDecimals: 6,
        explorer: "https://scrollscan.com",
        bridge: "https://portal.scroll.io/bridge",
        requestDaoEvolutionGasLimit: 100000000000000,
    }
} as const;


export const isMaintainer = (address: string) => {
    return address === '0xe6e340d132b5f46d1e472debcd681b2abc16e57e';
}
