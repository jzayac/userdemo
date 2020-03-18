#!/usr/bin/env node
const yargs = require('yargs');

yargs
  .commandDir('command')
  .strict()
  .demandCommand(1, 'You have to specify a command!')
  .count('verbose')
  .alias('v', 'verbose')
  .help().argv;
