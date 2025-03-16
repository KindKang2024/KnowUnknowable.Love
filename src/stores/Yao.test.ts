import {YAO} from './YAO';

//  npx tsx src/components/divination/Yao.test.ts
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

// Factory methods
test('fromYinCounts should create a complete YAO instance', () => {
    const yao = YAO.fromYinCounts([24, 18, 12]);
    if (!yao.isCompleted()) throw new Error('YAO should be completed');
    if (JSON.stringify(yao.getYinCounts()) !== JSON.stringify([24, 18, 12]))
        throw new Error('Yin counts don\'t match');
});

test('createEmpty should create an incomplete YAO instance', () => {
    const yao = YAO.createEmpty();
    if (yao.isCompleted()) throw new Error('YAO should not be completed');
    if (yao.getYinCounts().length !== 0) throw new Error('Yin counts should be empty');
});

// Incremental building
test('addDivision should add yin counts and calculate correctly', () => {
    const yao = YAO.createEmpty();

    // First round
    yao.addDivision(24);
    if (yao.getYinCounts()[0] !== 24)
        throw new Error('First round yin counts don\'t match');
    if (yao.getYangCounts()[0] !== 25)
        throw new Error('First round yang counts don\'t match');
    if (yao.isCompleted()) throw new Error('Should not be completed after first round');

    if (yao.getYinLeftCounts()[0] !== 3)
        throw new Error('First round yin left counts don\'t match');
    if (yao.getYangLeftCounts()[0] !== 1)
        throw new Error('First round yang left counts don\'t match');


    // Second round
    console.log(yao.getUndividedCounts());
    yao.addDivision(18);
    if (yao.getYinCounts()[1] !== 18)
        throw new Error('Second round yin counts don\'t match');
    if (yao.getYangCounts()[1] !== 26)
        throw new Error('Second round yang counts don\'t match');
    if (yao.isCompleted()) throw new Error('Should not be completed after second round');

    console.log(yao.getYinLeftCounts());
    console.log(yao.getUndividedCounts());

    if (yao.getYinLeftCounts()[1] !== 1)
        throw new Error('Second round yin left counts don\'t match');
    if (yao.getYangLeftCounts()[1] !== 2)
        throw new Error('Second round yang left counts don\'t match');

    // Third round
    yao.addDivision(12);
    if (JSON.stringify(yao.getYinCounts()) !== JSON.stringify([24, 18, 12]))
        throw new Error('Third round yin counts don\'t match');
    if (yao.getYangCounts().length !== 3)
        throw new Error('Third round yang counts length incorrect');
    if (!yao.isCompleted()) throw new Error('Should be completed after third round');
    console.log(yao.getFinalUndividedCount());

    if (yao.getFinalUndividedCount() !== 32)
        throw new Error('Third round undivided count incorrect');

});

test('addDivision should throw error when adding more than 3 rounds', () => {
    const yao = YAO.createEmpty();
    yao.addDivision(24);
    yao.addDivision(18);
    yao.addDivision(12);

    let errorThrown = false;
    try {
        yao.addDivision(6);
    } catch (e) {
        errorThrown = true;
    }

    if (!errorThrown) throw new Error('Should throw error when adding more than 3 rounds');
});

// Calculation correctness
test('should calculate yang counts correctly', () => {
    const yao = YAO.fromYinCounts([24, 18, 12]);
    const yangCounts = yao.getYangCounts();

    // First round: 49 - 24 = 25
    if (yangCounts[0] !== 25) throw new Error('First round yang count incorrect');
});

test('should calculate remainders correctly', () => {
    const yao = YAO.fromYinCounts([24, 18, 12]);

    // Check that remainders are between 1-4
    const yinLeftCounts = yao.getYinLeftCounts();
    const yangLeftCounts = yao.getYangLeftCounts();

    yinLeftCounts.forEach(count => {
        if (count < 1 || count > 4) throw new Error(`Yin remainder ${count} out of range 1-4`);
    });

    yangLeftCounts.forEach(count => {
        if (count < 1 || count > 4) throw new Error(`Yang remainder ${count} out of range 1-4`);
    });
});

console.log('✨ All tests passed!'); 