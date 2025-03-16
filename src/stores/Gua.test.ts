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
    const bigNumber = gua.toOpsBigint();

    // Verify it's a BigInt
    if (typeof bigNumber !== 'bigint') {
        throw new Error('toBigNumber should return a BigInt');
    }

    // Log the value for debugging
    console.log(`BigInt value: ${bigNumber}`);
    // binary representation
    console.log(`Binary representation: ${bigNumber.toString(2)}`);
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
    const bigNumber = originalGua.toOpsBigint();

    console.log(`Ops string: ${originalGua.toOpsDebugString()}`);

    // Convert back to Gua
    const recreatedGua = Gua.createFromOpsBigint(bigNumber);
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
    const bigNumber = originalGua.toOpsBigint();

    console.log(`Ops string: ${originalGua.toOpsDebugString()}`);
    const recreatedGua = Gua.createFromOpsBigint(bigNumber);
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
    const bigNumber = originalGua.toOpsBigint();
    const recreatedGua = Gua.createFromOpsBigint(bigNumber);

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

// Test validation function, 
// validate not  quite right, since must < 49 and >=1 and less than left
test('isValidPackedYao should validate correctly', () => {
    // This function doesn't exist yet, but we can add a simple implementation for testing
    // Add this function to Gua class if needed

    if (typeof Gua.isValidPackedYao === 'function') {
        // Create a valid Gua and convert to BigInt
        const validGua = createGua([
            [24, 18, 12],
            [25, 17, 11],
            [26, 16, 10],
            [27, 15, 9],
            [28, 14, 8],
            [29, 13, 7]
        ]);
        const validBigNumber = validGua.toOpsBigint();

        // Should be valid
        if (!Gua.isValidPackedYao(validBigNumber)) {
            throw new Error('Valid packed YAO data should validate as true');
        }

        // Create an invalid BigInt (too large for yinCount)
        const invalidBigNumber = validBigNumber | (100n << 102n); // Set a yinCount to 100 (invalid)

        // Should be invalid
        if (Gua.isValidPackedYao(invalidBigNumber)) {
            throw new Error('Invalid packed YAO data should validate as false');
        }
    } else {
        console.log('⚠️ isValidPackedYao function not implemented, skipping validation test');
    }
});

// Test uint256 compatibility
test('toBigNumber should fit within uint256', () => {
    // Create a Gua with maximum valid values
    const gua = createGua([
        [49, 49, 49],
        [49, 49, 49],
        [49, 49, 49],
        [49, 49, 49],
        [49, 49, 49],
        [49, 49, 49]
    ]);

    // Convert to BigInt
    const bigNumber = gua.toOpsBigint();

    // Check if it fits within uint256 (2^256 - 1)
    const uint256Max = 2n ** 256n - 1n;
    if (bigNumber > uint256Max) {
        throw new Error(`BigInt value ${bigNumber} exceeds uint256 maximum ${uint256Max}`);
    }

    // Log the bit length for reference
    const bitLength = bigNumber.toString(2).length;
    console.log(`Maximum bit length: ${bitLength} bits (uint256 allows 256 bits)`);
});

console.log('✨ All tests passed!'); 