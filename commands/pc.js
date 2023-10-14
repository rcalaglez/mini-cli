const { Command } = require("commander");

const program = new Command();

program.description("Command pc description here").action(() => {
  console.log("PC command called");
});

program.parse(process.argv);
