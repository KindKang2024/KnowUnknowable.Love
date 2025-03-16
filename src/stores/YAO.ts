import {immerable} from "immer";

/**
 * YAO class implements a divination algorithm based on the I Ching principles.
 * It divides 49 counts through three rounds of yin-yang separation,
 * tracking the process and resulting values.
 */
export class YAO {
    [immerable] = true;

    // The count of values in yin part for each round
    private yinCounts: number[] = [];
    private yangCounts: number[] = [];

    // Counts for each round (human, yin, yang)
    private humanCount: number = 1;
    private yinLeftCountArr: number[] = [];
    private yangLeftCountArr: number[] = [];

    // Undivided count left after all rounds
    private undividedCountArr: number[] = [];

    private isComplete: boolean = false;

    /**
     * Factory method to create a YAO instance from yin counts
     * @param yinCounts Array of 3 numbers representing the yin counts in each round
     * @returns A new YAO instance with divination completed
     */
    public static fromYinCounts(yinCounts: [number, number, number]): YAO {
        const yao = new YAO();
        return yao.divine(yinCounts);
    }

    public finalUndividedGroupCount(): number {
        return this.undividedCountArr[this.undividedCountArr.length - 1] / 4;
    }

    /**
     * Factory method to create an empty YAO instance for incremental building
     * @returns A new empty YAO instance
     */
    public static createEmpty(): YAO {
        return new YAO();
    }

    // 
    public static fakeCreateFromBinary(binary: string): YAO[] {
        const binaryArr = binary.split('').map(Number);
        const yaos = binaryArr
            .map(bit => bit === 0 ? 8 : 7)
            .map(count => {
                const yao = new YAO();
                yao.undividedCountArr = [count * 4, count * 4, count * 4];
                yao.isComplete = true;
                yao.humanCount = 1;
                yao.yinCounts = [-1, -1, -1];
                yao.yangCounts = [-1, -1, -1];
                yao.yinLeftCountArr = [0, 0, 0];
                yao.yangLeftCountArr = [0, 0, 0];
                return yao;
            });
        return yaos;
    }

    /**
     * Add a yang count to the distribution and calculate incrementally
     * @param yangCount The yang count to add for the next round
     * @returns The YAO instance for chaining
     * @throws Error if already complete or trying to add more than 3 rounds
     */
    public addDivision(yinCount: number): YAO {
        if (this.isComplete) {
            throw new Error("This YAO instance is already complete");
        }

        if (this.yinCounts.length >= 3) {
            throw new Error("Cannot add more than 3 yin counts");
        }

        // Add the yang count to the distribution
        this.yinCounts.push(yinCount);

        // Get the current round
        const round = this.yinCounts.length - 1;
        let totalCount = round === 0 ? 49 : this.undividedCountArr[round - 1];


        // Calculate yin count
        const yangCount = totalCount - yinCount;
        this.yangCounts.push(yangCount);

        // Take one from yin part as human count
        const remainingYinCount = yinCount - this.humanCount;

        // Group values and calculate remainder counts
        const yinLeftCount = remainingYinCount % 4 === 0 ? 4 : remainingYinCount % 4;
        const yangLeftCount = yangCount % 4 === 0 ? 4 : yangCount % 4;

        this.yinLeftCountArr.push(yinLeftCount);
        this.yangLeftCountArr.push(yangLeftCount);

        // Calculate counts for next round
        this.undividedCountArr.push(totalCount - yinLeftCount - yangLeftCount - this.humanCount);

        // Check if we've completed all three rounds
        if (this.yinCounts.length === 3) {
            this.isComplete = true;
        }

        return this;
    }

    /**
     * Check if the YAO instance has all required yang counts and divination is complete
     * @returns True if divination is complete, false otherwise
     */
    public isCompleted(): boolean {
        return this.isComplete;
    }

    public isMutable(): boolean {
        return this.isComplete && (this.getFinalUndividedGroupCount() === 6 || this.getFinalUndividedGroupCount() === 9);
    }

    public isYin(): boolean {
        return this.isComplete && this.getFinalUndividedGroupCount() % 2 === 0;
    }

    public isYang(): boolean {
        return this.isComplete && this.getFinalUndividedGroupCount() % 2 === 1;
    }



    /**
     * Performs the divination process with 49 counts
     * @param yangDistribution Array of 3 numbers representing the yang values in each round
     * @returns The YAO instance for chaining
     */
    public divine(yinCounts: [number, number, number]): YAO {
        // Reset state
        for (let i = 0; i < 3; i++) {
            this.addDivision(yinCounts[i]);
        }

        return this;
    }

    /**
     * Returns the current yang distribution
     */
    public getYangCounts(): number[] {
        return [...this.yangCounts];
    }

    public getFinalUndividedCount(): number {
        if (this.undividedCountArr.length === 0) {
            return 49
        }
        return this.undividedCountArr[this.undividedCountArr.length - 1];
    }
    public getFinalUndividedGroupCount(): number {
        return Math.floor(this.getFinalUndividedCount() / 4);
    }

    /**
     * Returns the yin counts for each round
     */
    public getYinCounts(): number[] {
        return [...this.yinCounts];
    }

    /**
     * Returns the yin remainder counts for each round
     */
    public getYinLeftCounts(includeHumanCount: boolean = false): number[] {
        if (includeHumanCount) {
            return this.yinLeftCountArr.map(count => count + 1);
        }
        return [...this.yinLeftCountArr];
    }


    /**
     * Returns the yang remainder counts for each round
     */
    public getYangLeftCounts(): number[] {
        return [...this.yangLeftCountArr];
    }

    /**
     * Returns the undivided count left after three rounds
     */
    public getUndividedCounts(): number[] {
        return [...this.undividedCountArr];
    }

    /**
     * Returns a summary of the divination process
     * @throws Error if divination is not complete
     */
    public getSummary(): string {
        let summary = "Divination Summary:\n";

        for (let round = 0; round < this.yinCounts.length; round++) {
            summary += `Round ${round + 1}:\n`;
            summary += `  Yang count: ${this.yangCounts[round]}\n`;
            summary += `  Yin count: ${this.yinCounts[round]}\n`;

            if (round === 0) {
                summary += `  Human count: ${this.humanCount}\n`;
            }

            summary += `  Yin remainder: ${this.yinLeftCountArr[round]}\n`;
            summary += `  Yang remainder: ${this.yangLeftCountArr[round]}\n`;
        }

        summary += `Undivided count remaining: ${this.undividedCountArr[this.undividedCountArr.length - 1]}`;
        return summary;
    }

    /**
     * Returns the numerical results as an array
     * [yin1, yin2, yin3, yinRemainder1, yinRemainder2, yinRemainder3, 
     *  yangRemainder1, yangRemainder2, yangRemainder3, undividedCount]
     * @throws Error if divination is not complete
     */
    public getResults(): number[] {
        if (!this.isComplete) {
            throw new Error("Cannot get results before divination is complete");
        }

        return [
            ...this.yinCounts,
            ...this.yinLeftCountArr,
            ...this.yangLeftCountArr,
            ...this.undividedCountArr
        ];
    }
} 