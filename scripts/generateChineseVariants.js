import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import * as OpenCC from 'opencc-js';
import * as Locale from 'opencc-js/preset';

// Replicate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts the base zh.json file to zh-TW.json and zh-HK.json
 */
const generateChineseVariants = () => {
  console.log('Generating Chinese variant locale files...');
  
  // Paths
  const localesDir = path.join(__dirname, '../src/i18n/locales');
  const zhFilePath = path.join(localesDir, 'zh.json');
  const zhHKFilePath = path.join(localesDir, 'zh-HK.json');
  
  try {
    // Read zh.json
    console.log(`Reading Simplified Chinese file: ${zhFilePath}`);
    const zhData = fs.readFileSync(zhFilePath, 'utf8');
    
    // Create converters
    console.log('Creating OpenCC converters...');
    const s2twConverter = OpenCC.ConverterFactory(
      Locale.from.cn,  // From Simplified Chinese
      Locale.to.tw,    // To Traditional Chinese (Taiwan)
      []
    );
    
    const s2hkConverter = OpenCC.ConverterFactory(
      Locale.from.cn,  // From Simplified Chinese
      Locale.to.hk,    // To Traditional Chinese (Hong Kong)
      []
    );
    
    // Convert zh to zh-TW
    console.log('Converting to Traditional Chinese (Taiwan)...');
    const zhTWData = s2twConverter(zhData);
    
    // Convert zh to zh-HK
    console.log('Converting to Traditional Chinese (Hong Kong)...');
    const zhHKData = s2hkConverter(zhData);
    
    
    console.log(`Writing Traditional Chinese (Hong Kong) file: ${zhHKFilePath}`);
    fs.writeFileSync(zhHKFilePath, zhHKData, 'utf8');
    
    console.log('✅ Chinese variant locale files generated successfully');
  } catch (error) {
    console.error('Error generating Chinese variant locale files:', error);
    process.exit(1);
  }
};

// Execute the function
generateChineseVariants(); 