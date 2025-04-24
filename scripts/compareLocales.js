import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Replicate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find keys in obj1 that are not in obj2, maintaining structure
function findMissingKeys(obj1, obj2) {
  let missing = {};

  if (typeof obj1 !== "object" || obj1 === null) {
    return missing; // Should not happen for the initial call, but good for recursion robustness
  }

  for (const key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      // Case 1: Key exists in obj1 but not in obj2, or obj2 is not an object
      if (
        typeof obj2 !== "object" || obj2 === null || !obj2.hasOwnProperty(key)
      ) {
        missing[key] = obj1[key]; // Add the entire value from obj1
      } // Case 2: Key exists in both, and both values are objects (and not null)
      else if (
        typeof obj1[key] === "object" && obj1[key] !== null &&
        typeof obj2[key] === "object" && obj2[key] !== null
      ) {
        // Recurse into nested objects
        const nestedMissing = findMissingKeys(obj1[key], obj2[key]);
        // If the recursive call found missing keys in the nested structure,
        // add the result to our current missing object under the original key.
        if (Object.keys(nestedMissing).length > 0) {
          missing[key] = nestedMissing;
        }
      }
      // Case 3: Key exists in both, but types differ or one is not an object.
      // The current logic only flags keys completely missing or missing within nested objects.
      // If you needed to flag type mismatches for the same key, logic would go here.
    }
  }
  return missing;
}

// Paths to the JSON files
const enFilePath = path.join(__dirname, "../src/i18n/locales/en.json");
const zhFilePath = path.join(__dirname, "../src/i18n/locales/zh.json");
const outputFilePath = path.join(__dirname, "missing_keys.json"); // Define output file path

try {
  // Read and parse the JSON files
  const enData = JSON.parse(fs.readFileSync(enFilePath, "utf8"));
  const zhData = JSON.parse(fs.readFileSync(zhFilePath, "utf8"));

  console.log("Comparing en.json against zh.json...");
  const missingInZh = findMissingKeys(enData, zhData);

  if (Object.keys(missingInZh).length === 0) {
    console.log("No missing keys found in zh.json compared to en.json.");
    // Write an empty JSON object to the output file if none are missing
    fs.writeFileSync(outputFilePath, JSON.stringify({}, null, 2), "utf8");
    console.log(`Wrote empty object to ${outputFilePath}`);
  } else {
    console.log(`Found ${Object.keys(missingInZh).length} missing keys.`);
    // Convert the missing keys object to a pretty-printed JSON string
    const outputJson = JSON.stringify(missingInZh, null, 2);

    // Write the JSON string to the output file
    fs.writeFileSync(outputFilePath, outputJson, "utf8");
    console.log(`Successfully wrote missing keys to ${outputFilePath}`);
  }
} catch (error) {
  console.error("Error processing locale files or writing output:", error);
}
