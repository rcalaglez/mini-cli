const { Command } = require("commander");

const program = new Command();

program.description("Extract keys from i18n translation files").action(() => {
  console.log("Translate command called");
});

program.parse(process.argv);
