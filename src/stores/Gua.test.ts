import {Gua} from './Gua';
import {YAO} from './YAO';

//  npx tsx src/stores/Gua.test.ts
function test(name: string, fn: () => void) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
    } catch (error) {
        console.error(`❌ FAIL: ${name}`);
        console.error(error);
        process.exit(1);
    }
}

// Helper function to create a YAO with specific yinCounts
function createYao(yinCounts: [number, number, number]): YAO {
    return YAO.fromYinCounts(yinCounts);
}

// Helper function to create a Gua with specific YAOs
function createGua(yaoYinCounts: [number, number, number][]): Gua {
    const yaos = yaoYinCounts.map(yinCounts => createYao(yinCounts));
    return Gua.createFromYaoArray(yaos);
}

// Test toBigNumber
test('toBigNumber should convert Gua to BigInt correctly', () => {
    // Create a Gua with known YAO values
    const gua = createGua([
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [3, 3, 3]
    ]);

    // Convert to BigInt
    const bigNumber = gua.toOpsString();

    // Verify it's a 0x string
    if (!bigNumber.startsWith('0x')) {
        throw new Error('toBigNumber should return a string starting with 0x');
    }

    // Log the value for debugging
    console.log(`BigInt value: ${bigNumber}`);
    // binary representation
    console.log(`Binary representation: ${bigNumber}`);
    // ops string
    console.log(`Ops string: ${gua.toOpsDebugString()}`);
});

// Test createFromBigNumber
test('createFromBigNumber should convert BigInt back to Gua correctly', () => {
    // Create a Gua with known YAO values
    const originalGua = createGua([
        [24, 18, 12], // First YAO (map to MSB of Gua since it matters most)
        [25, 17, 11], // Second YAO
        [26, 16, 10], // Third YAO
        [27, 15, 9],  // Fourth YAO
        [28, 14, 8],  // Fifth YAO
        [29, 13, 7]   // Sixth YAO (map to LSB of Gua it matter less )
    ]);

    // Convert to BigInt
    const bigNumber = originalGua.toOpsString();

    console.log(`Ops string: ${originalGua.toOpsDebugString()}`);

    // Convert back to Gua
    const recreatedGua = Gua.createFromOpsString(bigNumber);
    console.log(`recreated Ops string: ${recreatedGua.toOpsDebugString()}`);

    // Verify the recreated Gua has 6 YAOs
    if (recreatedGua.yaos.length !== 6) {
        throw new Error(`Recreated Gua should have 6 YAOs, but has ${recreatedGua.yaos.length}`);
    }

    // Verify each YAO's yinCounts match the original
    for (let i = 0; i < 6; i++) {
        const originalYinCounts = originalGua.yaos[i].getYinCounts();
        const recreatedYinCounts = recreatedGua.yaos[i].getYinCounts();

        if (JSON.stringify(originalYinCounts) !== JSON.stringify(recreatedYinCounts)) {
            throw new Error(
                `YAO ${i + 1} yinCounts don't match: ` +
                `Original: ${JSON.stringify(originalYinCounts)}, ` +
                `Recreated: ${JSON.stringify(recreatedYinCounts)}`
            );
        }
    }
});

// Test with different Gua values
test('toBigNumber and createFromBigNumber should work with different values', () => {
    // Create a different Gua
    const originalGua = createGua([
        [10, 10, 10], // First YAO (top)
        [15, 15, 15], // Second YAO
        [20, 20, 20], // Third YAO
        [25, 25, 25], // Fourth YAO
        [30, 30, 30], // Fifth YAO
        [35, 35, 35]  // Sixth YAO (bottom)
    ]);

    // Convert to BigInt and back
    const bigNumber = originalGua.toOpsString();

    console.log(`Ops string: ${originalGua.toOpsDebugString()}`);
    const recreatedGua = Gua.createFromOpsString(bigNumber);
    console.log(`recreated Ops string: ${recreatedGua.toOpsDebugString()}`);
    // Verify each YAO's yinCounts match the original
    for (let i = 0; i < 6; i++) {
        const originalYinCounts = originalGua.yaos[i].getYinCounts();
        const recreatedYinCounts = recreatedGua.yaos[i].getYinCounts();

        if (JSON.stringify(originalYinCounts) !== JSON.stringify(recreatedYinCounts)) {
            throw new Error(
                `YAO ${i + 1} yinCounts don't match: ` +
                `Original: ${JSON.stringify(originalYinCounts)}, ` +
                `Recreated: ${JSON.stringify(recreatedYinCounts)}`
            );
        }
    }
});

// Test with edge case values
test('toBigNumber and createFromBigNumber should handle edge cases', () => {
    // Create a Gua with minimum and maximum valid values
    const originalGua = createGua([
        [1, 1, 1],     // Minimum valid values
        [49, 49, 49],  // Maximum valid values
        [10, 20, 30],  // Mixed values
        [30, 20, 10],  // Reverse mixed values
        [5, 5, 5],     // Small values
        [40, 40, 40]   // Large values
    ]);

    // Convert to BigInt and back
    const bigNumber = originalGua.toOpsString();
    const recreatedGua = Gua.createFromOpsString(bigNumber);

    // Verify each YAO's yinCounts match the original
    for (let i = 0; i < 6; i++) {
        const originalYinCounts = originalGua.yaos[i].getYinCounts();
        const recreatedYinCounts = recreatedGua.yaos[i].getYinCounts();

        if (JSON.stringify(originalYinCounts) !== JSON.stringify(recreatedYinCounts)) {
            throw new Error(
                `YAO ${i + 1} yinCounts don't match: ` +
                `Original: ${JSON.stringify(originalYinCounts)}, ` +
                `Recreated: ${JSON.stringify(recreatedYinCounts)}`
            );
        }
    }
});

console.log('✨ All tests passed!'); 