#!/usr/bin/env node


import {addProject,startSingleProject,startMultiProject,init,initAll,deployAll,destroyAll,cleanAll} from './index.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import version from './package.json' with { type: 'json' };

yargs(hideBin(process.argv))
  .command(
    'init',
    'Copy terraform files to single project', 
    // The builder function (to define options)
    (yargs) => {
      return yargs
    }, 
    // The handler function (the action)
    async (argv) => {
      const current_dir = process.cwd();
      await init(current_dir);
    }
  )
  .command(
    'init-all',
    'Copy all terraform files for each project',
    (yargs) => {
      return yargs;
    },
    async (argv) => {
      console.log('Deploying...');
      await initAll();
    }
  )
  .command(
    'deploy-all',
    'Deploy all terraform infrastructure for each project',
    (yargs) => {
      return yargs;
    },
    async (argv) => {
      console.log('Deploying...');
      await deployAll();
    }
  )
  .command(
    'destroy-all',
    'Destroy all terraform infrastructure for each project',
    (yargs) => {
      return yargs;
    },
    async (argv) => {
      console.log('Destroying...');
      await destroyAll();
    }
  )
  .command(
    'clean-all',
    'Delete all temp files for each project',
    (yargs) => {
      return yargs;
    },
    async (argv) => {
      console.log('Starting cleaning...');
      await cleanAll();
    }
  )
  .command(
    'start-single-project <template>',
    'Copy single project template files',
    (yargs) => {
      return yargs.positional('template', {
        describe: 'The name of the template to use (either "nodejs" or "python")',
        type: 'string',
      });
    },
    async (argv) => {
      console.log('Starting single lambda project...');
      await startSingleProject(argv.template);
    }
  )
  .command(
    'start-multi-project',
    'Copy multi-project template files',
    (yargs) => {
      return yargs
    },
    async (argv) => {
      console.log('Starting multi-lambda project...');
      await startMultiProject();
    }
  )   
  .command(
    'add-project <template>',
    'Converts single-projects, if needed, and adds a project.',
    (yargs) => {
      return yargs.positional('template', {
        describe: 'The name of the template to use (either "nodejs" or "python")',
        type: 'string',
      });
    },
    async (argv) => {
      console.log('Adding project to your multi-project...');
      await addProject(argv.template);
    }
  ) 
  .version(version.version)
  .alias('version', 'v')
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'You must provide a command')
  .parse();