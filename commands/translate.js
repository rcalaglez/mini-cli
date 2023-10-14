const { Command } = require("commander");
const fs = require("fs");
const { getKeysWithTranslations } = require("../functions/translate");

const program = new Command();

program
  .description("Extract keys from i18n translation files")
  .option("-j, --json <path>", "Path to JSON file with translation paths")
  .action((options) => {
    // Lee el archivo JSON con las rutas de traducción

    console.log(options.json);

    const translationPaths = JSON.parse(fs.readFileSync(options.json, "utf-8"));
    const keysWithTranslations = getKeysWithTranslations(translationPaths);

    console.log(keysWithTranslations);
  });

program.parse(process.argv);
