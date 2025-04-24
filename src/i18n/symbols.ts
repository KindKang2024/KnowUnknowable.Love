export const commonIChingMap = {
    "000000": { "num": 2, "symbol": "䷁" }, "000001": { "num": 24, "symbol": "䷖" }, "000010": { "num": 7, "symbol": "䷇" }, "000011": { "num": 19, "symbol": "䷓" },
    "000100": { "num": 15, "symbol": "䷏" }, "000101": { "num": 36, "symbol": "䷢" }, "000110": { "num": 46, "symbol": "䷬" }, "000111": { "num": 11, "symbol": "䷋" },
    "001000": { "num": 16, "symbol": "䷎" }, "001001": { "num": 51, "symbol": "䷳" }, "001010": { "num": 40, "symbol": "䷦" }, "001011": { "num": 54, "symbol": "䷴" },
    "001100": { "num": 62, "symbol": "䷽" }, "001101": { "num": 55, "symbol": "䷷" }, "001110": { "num": 32, "symbol": "䷞" }, "001111": { "num": 34, "symbol": "䷠" },
    "010000": { "num": 8, "symbol": "䷆" }, "010001": { "num": 3, "symbol": "䷃" }, "010010": { "num": 29, "symbol": "䷜" }, "010011": { "num": 60, "symbol": "䷺" },
    "010100": { "num": 39, "symbol": "䷧" }, "010101": { "num": 63, "symbol": "䷿" }, "010110": { "num": 48, "symbol": "䷮" }, "010111": { "num": 5, "symbol": "䷅" },
    "011000": { "num": 45, "symbol": "䷭" }, "011001": { "num": 17, "symbol": "䷑" }, "011010": { "num": 47, "symbol": "䷯" }, "011011": { "num": 58, "symbol": "䷸" },
    "011100": { "num": 31, "symbol": "䷟" }, "011101": { "num": 49, "symbol": "䷱" }, "011110": { "num": 28, "symbol": "䷛" }, "011111": { "num": 43, "symbol": "䷫" },
    "100000": { "num": 23, "symbol": "䷗" }, "100001": { "num": 27, "symbol": "䷚" }, "100010": { "num": 4, "symbol": "䷂" }, "100011": { "num": 41, "symbol": "䷩" },
    "100100": { "num": 52, "symbol": "䷲" }, "100101": { "num": 22, "symbol": "䷔" }, "100110": { "num": 18, "symbol": "䷐" }, "100111": { "num": 26, "symbol": "䷘" },
    "101000": { "num": 35, "symbol": "䷣" }, "101001": { "num": 21, "symbol": "䷕" }, "101010": { "num": 64, "symbol": "䷾" }, "101011": { "num": 38, "symbol": "䷤" },
    "101100": { "num": 56, "symbol": "䷶" }, "101101": { "num": 30, "symbol": "䷝" }, "101110": { "num": 50, "symbol": "䷰" }, "101111": { "num": 14, "symbol": "䷌" },
    "110000": { "num": 20, "symbol": "䷒" }, "110001": { "num": 42, "symbol": "䷨" }, "110010": { "num": 59, "symbol": "䷻" }, "110011": { "num": 61, "symbol": "䷼" },
    "110100": { "num": 53, "symbol": "䷵" }, "110101": { "num": 37, "symbol": "䷥" }, "110110": { "num": 57, "symbol": "䷹" }, "110111": { "num": 9, "symbol": "䷉" },
    "111000": { "num": 12, "symbol": "䷊" }, "111001": { "num": 25, "symbol": "䷙" }, "111010": { "num": 6, "symbol": "䷄" }, "111011": { "num": 10, "symbol": "䷈" },
    "111100": { "num": 33, "symbol": "䷡" }, "111101": { "num": 13, "symbol": "䷍" }, "111110": { "num": 44, "symbol": "䷪" }, "111111": { "num": 1, "symbol": "䷀" }
};

export const commonIChingBinaryOrder = Object.keys(commonIChingMap).sort((a, b) => parseInt(a) - parseInt(b));

export const commonIChingBinaryList = [...commonIChingBinaryOrder.slice(0, 32), ...commonIChingBinaryOrder.slice(32).reverse()];

const generationProgressUnitsMap = {
    "☯️": { "num": "", "symbol": "☯️" },
    "0": { "num": 0, "symbol": "⚋" },
    "1": { "num": 1, "symbol": "⚊" },
    "00": { "num": 0, "symbol": "⚏" },
    "01": { "num": 1, "symbol": "⚎" },
    "10": { "num": 2, "symbol": "⚍" },
    "11": { "num": 3, "symbol": "⚌" },
    "000": { "num": 0, "symbol": "☷" },
    "001": { "num": 1, "symbol": "☶" },
    "010": { "num": 2, "symbol": "☵" },
    "011": { "num": 3, "symbol": "☴" },
    "100": { "num": 4, "symbol": "☳" },
    "101": { "num": 5, "symbol": "☲" },
    "110": { "num": 6, "symbol": "☱" },
    "111": { "num": 7, "symbol": "☰" },
}
export const binaryIChingMap = { ...generationProgressUnitsMap, ...commonIChingMap };