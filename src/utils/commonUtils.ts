import deployedContracts from "@/contracts/deployedContracts";
import {defaultChainWhenNotConnected, dukiDaoContractConfig} from "@/contracts/externalContracts";


export function serializeData(data: any): any {
    return JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}

export function objectIsEmpty(obj: any): boolean {
    if (obj === null || obj === undefined) return true;
    return false;
}
export function objectIsNotEmpty(obj: any): boolean {
    return !objectIsEmpty(obj);
}

export function getTxLink(tx: string, chainId: number): string {
    // deployedContracts
    if (!tx) return "";
    const explorer = deployedContracts[chainId].explorer;
    return `${explorer}/tx/${tx}`;
}

export function getAccountLink(address: string, chainId?: number): string {
    // if (!chainId) return "";
    if (!chainId) chainId = defaultChainWhenNotConnected;
    // deployedContracts
    const explorer = dukiDaoContractConfig[chainId].explorer;
    return `${explorer}/address/${address}`;
}


export function getContractLink(chainId?: number): string {
    // if (!chainId) return "";
    if (!chainId) chainId = defaultChainWhenNotConnected;
    // deployedContracts
    const explorer = dukiDaoContractConfig[chainId].explorer;
    return `${explorer}/address/${deployedContracts[chainId].ERC1967Proxy.address}`;
}

export function getBridgeLink(chainId?: number): string {
    // if (!chainId) return "";
    if (!chainId) chainId = defaultChainWhenNotConnected;
    // deployedContracts
    return dukiDaoContractConfig[chainId].bridge;
}


export const formatContractMoney = (number?: bigint) => {
    if (number == null || number === undefined) {
        return '0';
    }
    return formatNumber(Number(number) / 1000000);
}

export const formatNumber = (number?: number) => {
    if (number == null) {
        return '0';
    }

    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(number);
}




export function processGuaText(yaoText: string, maxNewlines = 1): string {
    // Case 1: No newlines in the input
    if (!yaoText.includes('\n')) {
        return yaoText.trim();
    }

    // Split the text into segments and filter out empty ones
    const segments = yaoText.split('\n').filter(segment => segment.trim() !== '');

    // Case 2: Number of segments is within the allowed limit
    if (segments.length <= maxNewlines + 1) {
        return segments.map(segment => segment.trim()).join('\n');
    }

    // Case 3: Too many segments, redistribute words
    const flatText = segments.join(' ').replace(/\s+/g, ' ').trim();
    const words = flatText.split(' ');
    const totalWords = words.length;
    const wordsPerLine = Math.ceil(totalWords / (maxNewlines + 1));
    const lines = [];

    for (let i = 0; i < totalWords; i += wordsPerLine) {
        const lineWords = words.slice(i, i + wordsPerLine);
        lines.push(lineWords.join(' '));
        if (lines.length === maxNewlines + 1) break;
    }

    return lines.join('\n');
}