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

export const dukiDaoContractConfig = {
    ZeroAddress: '0x0000000000000000000000000000000000000000',
    address: deployedContracts[foundry.id].ERC1967Proxy.address,
    stableCoin: deployedContracts[foundry.id].MyERC20Mock.address,
    StableCoinBase: 10 ** 6,
    chainId: foundry.id,
    yearlySubscriptionFee: 12, // 12 USDT, be same with the contract
    investFee: 120, // 120 USDT
    joinCommunityLotteryFee: 10, // 10 USDT
} as const;
// 0xe6e340d132b5f46d1e472debcd681b2abc16e57e
