import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

// Replicate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Custom sort function for object keys:
 * - "☯️" comes first
 * - Numeric keys sorted by length first, then value (binary interpretation)
 * - Numeric keys come before non-numeric keys
 * - Other keys use default alphabetical sorting
 * @param {string} a - First key
 * @param {string} b - Second key
 * @returns {number} - Sort order
 */
const customKeySorter = (a, b) => {
  if (a === '☯️') return -1;
  if (b === '☯️') return 1;

  const isANumeric = /^\d+$/.test(a);
  const isBNumeric = /^\d+$/.test(b);

  if (isANumeric && isBNumeric) {
    // Primary sort: Length
    if (a.length !== b.length) {
      return a.length - b.length;
    }

    // Secondary sort: Binary value
    const valA = parseInt(a, 2);
    const valB = parseInt(b, 2);

    // Check if *both* parsed correctly as binary
    if (!isNaN(valA) && !isNaN(valB)) {
      if (valA !== valB) {
        return valA - valB;
      }
      // If binary values are the same (e.g., "0" vs "00" if length check failed), use locale compare.
      return a.localeCompare(b); 
    } else {
      // Binary parse failed for at least one key. This shouldn't happen for the iChing keys.
      // Log a warning and fallback to standard decimal numeric comparison.
      console.warn(`[Warn] Binary parse failed for keys: '${a}', '${b}'. Falling back to decimal sort.`);
      const decA = parseInt(a, 10); // Use radix 10
      const decB = parseInt(b, 10);
       if (!isNaN(decA) && !isNaN(decB)) {
          if (decA !== decB) return decA - decB;
       }
       // Final fallback if decimal parse also fails or values are equal
       return a.localeCompare(b);
    }
  }

  // One is numeric, one is not. Numeric comes first.
  if (isANumeric) return -1;
  if (isBNumeric) return 1;

  // Default for two non-numeric keys
  return a.localeCompare(b);
};

/**
 * Custom JSON stringifier that respects key order based on customKeySorter.
 * @param {*} value - The value to stringify.
 * @param {number} indentLevel - Current indentation level.
 * @returns {string} - The JSON string representation.
 */
function customStringify(value, indentLevel = 0) {
  const indent = '  '.repeat(indentLevel); // Two spaces per indent level
  const nextIndent = '  '.repeat(indentLevel + 1);

  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value); // Use native stringify for correct escaping
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString();
  
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map(item => `${nextIndent}${customStringify(item, indentLevel + 1)}`);
    return `[\n${items.join(',\n')}\n${indent}]`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value).sort(customKeySorter); // Sort keys here
     if (keys.length === 0) return '{}';
    const properties = keys.map(key => {
      const keyString = JSON.stringify(key); // Ensure key is correctly quoted
      const valueString = customStringify(value[key], indentLevel + 1);
      return `${nextIndent}${keyString}: ${valueString}`;
    });
    return `{\n${properties.join(',\n')}\n${indent}}`;
  }

  return undefined; // Should not happen for valid JSON structures
}

function processLocaleFile(filePath) {
  try {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`--- Generating custom sorted string for ${path.basename(filePath)} ---`);
    
    // Use the custom stringifier which sorts keys internally
    const sortedJsonString = customStringify(data);

    // Write the correctly sorted string back to the file
    fs.writeFileSync(filePath, sortedJsonString + '\n', 'utf8'); // Add newline at end
    console.log(`Successfully sorted and wrote ${path.basename(filePath)} using custom stringify`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Path to the locales directory
const localesDir = path.join(__dirname, '../src/i18n/locales');

try {
  // Read all files in the locales directory
  const files = fs.readdirSync(localesDir);
  
  // Filter for JSON files only
  const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
  
  console.log(`Found ${jsonFiles.length} JSON files in locales directory`);
  
  // Process each JSON file
  jsonFiles.forEach(file => {
    const filePath = path.join(localesDir, file);
    console.log(`Processing ${file}...`);
    processLocaleFile(filePath);
  });
  
  console.log('All locale files processed');
  
} catch (error) {
  console.error('Error accessing locales directory:', error);
} 