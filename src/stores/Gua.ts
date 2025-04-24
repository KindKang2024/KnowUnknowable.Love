import {immerable} from "immer";
import {YAO} from "./YAO";
import {binaryIChingMap, commonIChingMap} from "@/i18n/symbols";

/**
 * Gua class represents a complete hexagram in I Ching divination.
 * It consists of 6 individual Yao (lines) and provides methods to
 * analyze the hexagram's properties and transformations.
 */
export class Gua {
    [immerable] = true;

    private undividedGroupCounts: number[] = [];

    // Derived binary representation (0/1) of the hexagram
    private binaryArr: number[] = [];

    // Mutation array indicating which lines has mutability and could be mutated
    private mutabilityArr: boolean[] = [false, false, false, false, false, false];

    // Mutation array indicating which lines has been mutated, means actually mutated situation
    private mutationArr: boolean[] = [false, false, false, false, false, false];


    // Flag to indicate if the hexagram is complete (has 6 lines)
    private isComplete: boolean = false;

    public totalMutationCount: number = 0;
    // public mutationGua: string = '';


    public yaos: YAO[] = [];

    /**
     * Constants to explain the hex string length
     */
    private static readonly BITS_PER_YINCOUNT = 6;  // 6 bits per yinCount (range 1-49)
    private static readonly TOTAL_BITS = 6 * 3 * Gua.BITS_PER_YINCOUNT;  // 108 bits
    private static readonly BYTES16_HEX_LENGTH = 32;  // 16 bytes = 32 hex characters for bytes16

    /**
     * Private constructor - use factory methods to create instances
     */
    private constructor(undividedGroupCounts: number[], yaos: YAO[]) {
        for (const undividedGroupCount of undividedGroupCounts) {
            this.addYaoUndividedGroupCount(undividedGroupCount)
        }
        for (const yao of yaos) {
            this.yaos.push(yao);
        }
    }

    /**
     * Factory method to create a Gua from 6 complete YAO instances
     * @param yaos Array of 6 YAO instances
     * @returns A new Gua instance
     * @throws Error if any YAO is incomplete or if not exactly 6 YAOs provided
     */
    public static createFrom6Yao(undividedGroupCounts: number[]): Gua {
        if (undividedGroupCounts.length !== 6) {
            throw new Error("A Gua must consist of exactly 6 YAO instances");
        }

        return new Gua(undividedGroupCounts, []);
    }

    public static createFromYaoArray(yaos: YAO[]): Gua {
        if (yaos.length !== 6) {
            throw new Error("A Gua must consist of exactly 6 YAO instances");
        }
        const undividedGroupCounts = yaos.map(yao => yao.getFinalUndividedGroupCount());
        return new Gua(undividedGroupCounts, yaos);
    }


    public static fakeCreateFromBinary(binary: string): Gua {
        const binaryArr = binary.split('').map(Number);
        const undividedGroupCounts = binaryArr.map(bit => bit === 0 ? 8 : 7);

        //takeout_1 5,9 takeout_2 4,8 takeout_3 4,8
        // 8 => 32 ,49 - 32 = 17 ; possible 5，4，8 yin: [1,1,5]
        // 7 => 28 ;  49 - 28 = 21: possible: 9,4,8  yin: [5,1,5]
        // just use fake and inconsistent number here, may not correct
        // create 6 YAO instances
        // error
        // const yaos = undividedGroupCounts.map(count =>
        //     YAO.fromYinCounts([count == 7 ? 1 : 5, count == 7 ? 1 : 1, count == 7 ? 5 : 5]));
        const yaos = YAO.fakeCreateFromBinary(binary);
        return new Gua(undividedGroupCounts, yaos);
    }


    /**
     * Factory method to create an empty Gua for incremental building
     * @returns A new empty Gua instance
     */
    public static createEmpty(): Gua {
        const yaos = Array.from({ length: 6 }, () => YAO.createEmpty());
        return new Gua([], yaos);
    }


    public divide(yinCount: number): Gua {
        const firstNonCompletedIndex = this.yaos.findIndex(yao => !yao.isCompleted());
        // Add the division to the current YAO
        this.yaos[firstNonCompletedIndex].addDivision(yinCount);
        // console.log(state);
        // If we've completed a YAO (3 divisions), add it to our collection
        if (this.yaos[firstNonCompletedIndex].isCompleted()) {
            // Add the completed YAO's undivided group count to the Gua
            const undividedGroupCount = this.yaos[firstNonCompletedIndex].getFinalUndividedGroupCount();
            this.addYaoUndividedGroupCount(undividedGroupCount);
        }
        return this;
    }

    public symbol(): string {
        return binaryIChingMap[this.getBinaryString()]?.symbol;
    }

    public getMutationsCount(): number {
        return this.mutabilityArr.filter(mutation => mutation).length ?? 0;
    }

    public getTotalManifestationsCount(): number {
        return Math.pow(2, this.getMutationsCount());
    }

    public isDivinationCompleted(): boolean {
        // return this.isComplete;
        return this.yaos[5].isCompleted();
    }

    public getCurrentRound(): number {
        return this.yaos.filter(yao => yao.isCompleted()).length;
    }

    public getTotalDivisions(): number {
        const firstNonCompletedIndex = this.yaos.findIndex(yao => !yao.isCompleted());
        if (firstNonCompletedIndex === -1) {
            return 18;
        }
        return (firstNonCompletedIndex * 3) + this.yaos[firstNonCompletedIndex].getYangCounts().length;
    }

    public getCurrentYao(): YAO {
        return this.yaos[this.yaos.length - 1];
    }

    /**
     * Add a YAO to the Gua
     * @param yao A complete YAO instance to add
     * @returns The Gua instance for chaining
     * @throws Error if already complete or if YAO is incomplete
     */
    public addYaoUndividedGroupCount(undividedGroupCount: number): Gua {
        if (this.isComplete) {
            throw new Error("This Gua is already complete with 6 YAO instances");
        }
        // Update binary and mutation arrays for this YAO
        this.binaryArr.push(undividedGroupCount % 2);
        // this.mutabilityArr.push(undividedGroupCount === 6 || undividedGroupCount === 9);
        this.mutabilityArr[this.binaryArr.length - 1] = (undividedGroupCount === 6 || undividedGroupCount === 9);
        this.undividedGroupCounts.push(undividedGroupCount);

        // Check if we've completed all six YAOs
        if (this.undividedGroupCounts.length === 6) {
            this.isComplete = true;
            this.totalMutationCount = 2 ** this.mutabilityArr.filter(mutation => mutation).length - 1;
        }

        return this;
    }

    /**
   * Check if the Gua is complete with 6 YAO instances
   * @returns True if complete, false otherwise
   */
    public isCompleted(): boolean {
        return this.isComplete;
    }

    public hasMutability(): boolean {
        return this.mutabilityArr.some(mutation => mutation);
    }

    public getMutabilityArray(): boolean[] {
        return [...this.mutabilityArr];
    }
    public getMutabilityString(): string {
        return this.mutabilityArr.map(mutation => mutation ? '1' : '0').join('');
    }

    // mutated: boolean, at: number
    public mutate(mutated: boolean, at: number) {
        if (!this.isComplete) {
            return;
        }
        this.mutationArr[at] = mutated && this.mutabilityArr[at];
        // this.mutationGua = this.getMutationGuaId();
    }

    public getMutationGuaId(): string {
        if (!this.isComplete || this.mutationArr.every(mutation => !mutation)) {
            return ''
        }

        // Create a copy of the binary array
        const mutatedBinary = [...this.binaryArr];

        // Flip bits where mutations have occurred
        for (let i = 0; i < 6; i++) {
            if (this.mutationArr[i]) {
                // Flip the bit (0->1, 1->0)
                mutatedBinary[i] = mutatedBinary[i] === 0 ? 1 : 0;
            }
        }

        // Convert to binary string
        const binaryStr = mutatedBinary.join('');

        // Return the binary string as the ID
        return binaryStr;
    }

    public getBinaryString(): string {
        if (!this.isComplete) {
            return '';
        }
        return this.binaryArr.join('');
    }

    public getDecimalNumberString(): string {
        return this.binaryArr.reduce((acc, curr, index) => {
            return acc + (curr * Math.pow(2, 5 - index));
        }, 0).toString();
    }

    // 64 protein code , T/U -- A, G--C
    public getGeneticCode(): string {
        // group by 2
        const binaryString = this.getBinaryString();
        return Gua.getGeneticCodeFromBinary(binaryString);
    }

    public static binaryToDecimalString(binary: string, paddingSpace: boolean = false): string {
        let num = commonIChingMap[binary].num;
        if (num === undefined || num === null) {
            return '';
        }
        if (paddingSpace) {
            return num.toString().padStart(2, '0');
        }
        return num.toString();
    }

    public static binaryToBinaryDecimalString(binary: string, paddingSpace: boolean = false): string {
        if (paddingSpace) {
            return parseInt(binary, 2).toString().padStart(2, ' ') + "b";
        }
        return parseInt(binary, 2).toString() + "b";
    }


    public static getGeneticCodeFromBinary(binary: string): string {
        if (binary.length === 0) {
            return '️❤️';
        }
        if (binary.length == 1 || binary.length == 3) {
            //  ignore it, have no idea yet
            return ""
        }

        const mapping = {
            "00": 'U', // Uracil (RNA equivalent of Thymine)
            "01": 'C', // Cytosine
            "10": 'G', // Guanine
            "11": 'A', // Adenine
        }
        const grouped = binary.match(/.{1,2}/g);
        return grouped.map(group => mapping[group]).join('');
    }

    /**
     * Get the binary representation of the hexagram
     * @returns Array of 6 numbers (0 or 1)
     * @throws Error if Gua is not complete
     */
    public getBinaryArray(): number[] {
        if (!this.isComplete) {
            throw new Error("Cannot get binary array before Gua is complete");
        }
        return [...this.binaryArr];
    }

    /**
     * Get the mutation array indicating which lines are changing
     * @returns Array of 6 booleans
     * @throws Error if Gua is not complete
     */
    public getMutationArray(): boolean[] {
        if (!this.isComplete) {
            throw new Error("Cannot get mutation array before Gua is complete");
        }
        return [...this.mutabilityArr];
    }

    /**
     * Get the transformed Gua after applying mutations
     * @returns A new Gua with mutations applied
     * @throws Error if Gua is not complete
     */
    public getMutationGua(mutationWillArr: boolean[]): Gua {
        if (!this.isComplete) {
            throw new Error("Cannot transform an incomplete Gua");
        }

        const actualMutationArr = this.mutabilityArr.map((mutation, index) => {
            return mutationWillArr[index] && mutation;
        });


        // Create new YAOs with the same properties but flipped if they are mutating
        const transformedUndividedGroupCounts: number[] = this.undividedGroupCounts.map((undividedGroupCount, index) => {
            if (actualMutationArr[index]) {
                // 6->7, 9->8
                return undividedGroupCount === 6 ? 7 : 8;
            }
            // For non-mutating lines, keep the original YAO
            return undividedGroupCount;
        });

        return Gua.createFrom6Yao(transformedUndividedGroupCounts);
    }


    public getAllPossibleBinary(excludeOriginal: boolean = false): string[] {
        const allPossibleEvolutions = Gua.getAllPossibleEvolutions(this, excludeOriginal);
        return allPossibleEvolutions.map(e => e.map(bit => bit ? '1' : '0').join(''));
    }

    public getAllPossibleMutationSymbols(excludeOriginal: boolean = false): string[] {
        const allPossibleEvolutions = Gua.getAllPossibleEvolutions(this, excludeOriginal);
        return allPossibleEvolutions.map(e => binaryIChingMap[e.map(bit => bit ? '1' : '0').join('')].symbol);
    }

    public getAllRepresentationGuaList(excludeOriginal: boolean  = false): Gua[] {
        const allRepresentations = this.getAllPossibleBinary(excludeOriginal);
        const allGuaList = allRepresentations.map(e => Gua.fakeCreateFromBinary(e));
        if (!excludeOriginal) {
            allGuaList[0].yaos = [...this.yaos];
            allGuaList[0].binaryArr = [...this.binaryArr];
            allGuaList[0].undividedGroupCounts = [...this.undividedGroupCounts];
            allGuaList[0].isComplete = this.isComplete;
        }
        return allGuaList;
    }

    // each bool area is 6  
    public static getAllPossibleEvolutions(gua: Gua, excludeOriginal: boolean = false): boolean[][] {
        const mutabilityArr = gua.mutabilityArr;
        const binaryArr = gua.binaryArr;

        const allPossibleEvolutions: boolean[][] = [];

        // Convert binary array to boolean array where true means yin (0) and false means yang (1)
        const originalState = [...binaryArr.map(bit => bit === 1)];
        // const allEvolutions: boolean[][] = [originalState];
        if (!excludeOriginal) {
            allPossibleEvolutions.push(originalState);
        }

        // Find indices of mutable positions
        const mutableIndices: number[] = [];
        for (let i = 0; i < mutabilityArr.length; i++) {
            if (mutabilityArr[i]) {
                mutableIndices.push(i);
            }
        }

        const mutationCount = mutableIndices.length;

        // If there are no mutable positions, return empty array
        if (mutationCount === 0) {
            return allPossibleEvolutions;
        }
        // Generate all possible combinations of mutations
        // For n mutable positions, there are 2^n - 1 possible mutations (excluding the original state)
        const totalCombinations = Math.pow(2, mutationCount) - 1;

        for (let i = 1; i <= totalCombinations; i++) {
            // Create a new state starting with the original state
            const newState = [...originalState];

            // For each bit in the binary representation of i
            for (let j = 0; j < mutationCount; j++) {
                // If the j-th bit of i is 1, flip the corresponding position
                if ((i & (1 << j)) !== 0) {
                    const posToFlip = mutableIndices[j];
                    newState[posToFlip] = !newState[posToFlip];
                }
            }

            allPossibleEvolutions.push(newState);
        }
        return allPossibleEvolutions;
    }

    /**
     * Returns a summary of the Gua
     * @throws Error if Gua is not complete
     */
    public getSummary(): string {
        if (!this.isComplete) {
            throw new Error("Cannot get summary before Gua is complete");
        }

        let summary = "Hexagram Summary:\n";

        for (let i = 0; i < 6; i++) {
            summary += `Line ${i + 1}: Undivided Group Count=${this.undividedGroupCounts[i]}\n`;
        }

        return summary;
    }

    /**
     * Converts the Gua to a string representation of operations
     * Format: "1,2,3 1,2,3 1,2,3 1,2,3 1,2,3 1,2,3"
     * Each group represents a YAO's yinCounts separated by commas
     * Groups are separated by spaces
     * @returns String representation of operations
     */
    public toOpsDebugString(): string {
        const yaoStrings: string[] = [];

        // Process YAOs from first to last (0 to 5)
        for (let i = 0; i < this.yaos.length; i++) {
            const yao = this.yaos[i];
            const yinCounts = yao.getYinCounts();

            // Join the yinCounts with commas
            const yaoString = yinCounts.join(',');
            yaoStrings.push(yaoString);
        }

        // Join the YAO strings with spaces
        return yaoStrings.join(' ');
    }
    /**
 * Converts the Gua to a BigInt representation
 * First YAO is in the most significant bits
 */
    private toOpsBigint(): bigint {
        let result = 0n;

        // Process YAOs from first to last (0 to 5)
        for (let i = 0; i < this.yaos.length; i++) {
            const yao = this.yaos[i];
            const yinCounts = yao.getYinCounts();

            // Process rounds from first to last (0 to 2)
            for (let j = 0; j < yinCounts.length; j++) {
                // Shift left by 6 bits and add the yinCount
                result = (result << 6n) | BigInt(yinCounts[j]);
            }
        }

        return result;
    }

    public toOpsString(): string {
        // Convert to hex and pad to 32 characters (16 bytes) for bytes16 compatibility
        const hexString = this.toOpsBigint().toString(16).padStart(Gua.BYTES16_HEX_LENGTH, '0');
        return '0x' + hexString;
    }

    /**
     * Creates a Gua from a bytes32 hex string representation
     * @param opsValue - Hex string (with or without '0x' prefix) or bigint
     */
    public static createFromOpsString(opsValue: string): Gua {
        try {
            let hexValue: string = opsValue.toLowerCase().replace('0x', '');
            if (!/^[0-9a-f]+$/.test(hexValue)) {
                throw new Error('Invalid hex string');
            }
            // Convert hex string to BigInt
            const packedValue = BigInt('0x' + hexValue);

            const allYinCounts: number[][] = [];
            let tempValue = packedValue;
            const mask = 0x3Fn; // 6 bits mask (0x3F = 63)

            // Extract all 18 yinCount values (6 YAOs × 3 rounds)
            for (let i = 0; i < 6 * 3; i++) {
                const position = Math.floor(i / 3); // Which YAO (0-5)
                const round = i % 3; // Which round (0-2)

                // If this is the first round of a YAO, create a new array
                if (round === 0) {
                    allYinCounts[5 - position] = [];
                }

                // Extract the least significant 6 bits
                const yinCount = Number(tempValue & mask);
                tempValue = tempValue >> 6n;

                // Store in the correct position (in reverse order)
                allYinCounts[5 - position][2 - round] = yinCount;
            }

            // Create YAOs from the extracted yinCounts
            const yaos: YAO[] = allYinCounts.map(yinCounts =>
                YAO.fromYinCounts(yinCounts as [number, number, number])
            );

            return Gua.createFromYaoArray(yaos);
        } catch (error) {
            console.error(error);
            return Gua.createEmpty();
        }
    }

    /**
     * Validates if a BigInt represents valid packed YAO data
     * todo: validate not quite complete, just mark it here
     */
    public static isValidPackedYao(packedValue: string): boolean {
        if (!packedValue.startsWith('0x')) {
            return false;
        }

        // Extract all yinCounts to validate them
        let tempValue = BigInt(packedValue);
        const mask = 0x3Fn; // 6 bits mask

        // For each of the 6 YAOs
        for (let i = 0; i < 6; i++) {
            // For each of the 3 rounds per YAO
            for (let j = 0; j < 3; j++) {
                // Extract the yinCount (6 bits)
                const yinCount = Number(tempValue & mask);
                tempValue = tempValue >> 6n;

                // Basic validation: yinCount should be between 1 and 49
                if (yinCount < 1 || yinCount > 49) {
                    return false;
                }
            }
        }

        // If we've passed all checks, the data is valid
        return true;
    }

} 