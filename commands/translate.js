const { Command } = require("commander");
const fs = require("fs");
const {
  getKeysWithTranslations,
  keysWithTranslationsToCsv,
  getKeysComparison,
  csvToObject,
} = require("../functions/translate");

const program = new Command();

program
  .description("Extract keys from i18n translation files")
  .option("-j, --json <path>", "Path to JSON file with translation paths")
  .option("-o, --output [filename]", "Output filename", "output.csv")
  .option("-c, --compare-with [path]", "Path to previous translations CSV")
  .action((options) => {
    const translationPaths = JSON.parse(fs.readFileSync(options.json, "utf-8"));
    const keysWithTranslations = getKeysWithTranslations(translationPaths);

    let previousData = {};
    if (options.compareWith) {
      const previousCsv = fs.readFileSync(options.compareWith, "utf-8");
      previousData = csvToObject(previousCsv);
    }

    const comparison = getKeysComparison(keysWithTranslations, previousData);
    const csvData = keysWithTranslationsToCsv(comparison);

    fs.writeFileSync(options.output, csvData, "utf-8");
    console.log(`Data saved to ${options.output}`);
  });

program.parse(process.argv);
