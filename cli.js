#!/usr/bin/env node


import {init} from './index.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import version from './package.json' with { type: 'json' };

yargs(hideBin(process.argv))
  .command(
    'init',
    'Copy terraform files to project', 
    // The builder function (to define options)
    (yargs) => {
      return yargs
        .positional('init', {
          describe: 'Copy files',
          type: 'string'
        });
    }, 
    // The handler function (the action)
    (argv) => {
      init();
    }
  )
  .version(version.version)
  .alias('version', 'v')
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'You must provide a command')
  .parse();