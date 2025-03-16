// updateHexagrams.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 JSON 文件
const filePath = path.join(__dirname, './../src/i18n/locales/en.json');
// fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('读取文件失败:', err);
//         return;
//     }

//     // 解析 JSON 数据
//     let jsonData;
//     try {
//         jsonData = JSON.parse(data);
//     } catch (parseError) {
//         console.error('解析 JSON 失败:', parseError);
//         return;
//     }

//     // 补全 num 字段
//     if (jsonData.iChing && jsonData.iChing.hexagrams) {
//         jsonData.iChing.hexagrams.forEach((hexagram, index) => {
//             hexagram.num = index + 1; // 从 1 开始
//         });
//     }

//     // 将更新后的数据写回文件
//     fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeError) => {
//         if (writeError) {
//             console.error('写入文件失败:', writeError);
//         } else {
//             console.log('num 字段已成功补全并写入文件。');
//         }
//     });
// });


// Function to extract name, symbol, and num from hexagrams
function extractHexagramData(hexagrams, indexByBinaryString = false) {
    if (indexByBinaryString) {
        let bigMap = {};
        for (let i = 0; i < hexagrams.length; i++) {
            bigMap[hexagrams[i].id] = {
                name: hexagrams[i].name,
                symbol: hexagrams[i].symbol,
                gua_ci: hexagrams[i].gua_ci,
                yao_ci: hexagrams[i].yao_ci
            };
        }
        return bigMap;
    }
    return hexagrams.map(({ name, symbol, num }) => ({ name, symbol, num }));
}

// Read the JSON data
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Parse JSON data
    const jsonData = JSON.parse(data);

    // Extract data
    const extractedData = extractHexagramData(jsonData.iChing.hexagrams, true);

    // Write extracted data to a new file
    fs.writeFile('extractedHexagrams.json', JSON.stringify(extractedData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing file:', writeErr);
        } else {
            console.log('Data successfully extracted and written to extractedHexagrams.json');
        }
    });
}); 