

export function serializeData(data: any): any {
    return JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
    );
}


export function scrollTxLink(tx: string | null): string {
    if (!tx) return "";
    return `https://scrollscan.com/tx/${tx}`;
}


export function ethTxLink(tx: string): string {
    return `https://etherscan.io/tx/${tx}`;
}