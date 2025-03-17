

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

export function processYaoText(yaoText: string, maxNewlines = 1): string {
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