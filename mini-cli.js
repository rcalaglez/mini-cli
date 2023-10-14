#!/usr/bin/env node

const { Command } = require("commander");

const program = new Command();

program.version("0.0.1").description("CLI Tools Box");

program
  .command("translate [options]", "Translate command description", {
    executableFile: "./commands/translate.js",
  })
  .command("pc [options]", "PC command description", {
    executableFile: "./commands/pc.js",
  });

program.parse(process.argv);
