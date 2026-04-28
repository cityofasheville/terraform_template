import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

export async function addProject(nodejs_or_python) { 
  if (nodejs_or_python !== 'nodejs' && nodejs_or_python !== 'python' ) {
    throw new Error('Invalid option. Enter either nodejs or python.');
  }
  const __lib_dir = `${import.meta.dirname}/lib`;
  const current_dir = process.cwd();
  const project_dir = `${current_dir}/${nodejs_or_python}-template`;
  try {
    if (await directoryExists(`${current_dir}/src`)) {
      console.log(`This is currently a single lambda project.`);
      console.log(`Converting to multi-lambda format...`);
      await fs.mkdir(`${current_dir}/projectA`,{ recursive: true });
      await fs.rename(`${current_dir}/src/`, `${current_dir}/projectA/src/`);
      await moveIfExists(`${current_dir}/package.json`, `${current_dir}/projectA/package.json`);
      await moveIfExists(`${current_dir}/.env`, `${current_dir}/projectA/.env`);
      await moveIfExists(`${current_dir}/example.env`, `${current_dir}/projectA/example.env`);
      await moveIfExists(`${current_dir}/deploy.yaml`, `${current_dir}/projectA/deploy.yaml`);
      await moveIfExists(`${current_dir}/example.deploy.yaml`, `${current_dir}/projectA/example.deploy.yaml`);
      await moveIfExists(`${current_dir}/README.md`, `${current_dir}/projectA/README.md`);
      await fs.cp(`${__lib_dir}/project_multi/`, `${current_dir}/`, { recursive: true });
      await fs.copyFile(`${__lib_dir}/project/.gitignore`, `${current_dir}/.gitignore`);
      await fs.rm(`${current_dir}/deploy`,{ recursive: true });
      await fs.rm(`${current_dir}/node_modules`,{ recursive: true });
      await init(`${current_dir}/projectA`);
    } 
    if (await directoryExists(project_dir)) {
      console.log(`Project folder "${nodejs_or_python}" already exists!!!`);
    } else {
      await fs.cp(`${__lib_dir}/${nodejs_or_python}/`, `${project_dir}/`, { recursive: true });
      await fs.copyFile(`${__lib_dir}/project/package.json`, `${project_dir}/package.json`);
      await init(project_dir);
    }
  } catch (err) {
    console.log(err);
  }
}

async function moveIfExists(src, dest) {
  try {
    await fs.rename(src, dest);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Source file "${src}" does not exist, skipping copy.`);
    } else {
      throw error;
    }
  }
}

async function directoryExists (dir) {
  try {
    await fs.access(dir)
    console.log(`Directory "${dir}" exists!`);
    console.log(`Rename the existing directory.`);
    return true
  } catch (err) {
    // console.log(err);
    return false
  }
}

export async function startSingleProject(nodejs_or_python) {
  try {
    if (nodejs_or_python !== 'nodejs' && nodejs_or_python !== 'python' ) {
      throw new Error('Invalid option. Enter either nodejs or python.');
    }
    const __lib_dir = `${import.meta.dirname}/lib`;
    const current_dir = process.cwd();
    await fs.cp(`${__lib_dir}/${nodejs_or_python}/`, `${current_dir}/`, { recursive: true });
    await fs.copyFile(`${__lib_dir}/project/.gitignore`, `${current_dir}/.gitignore`);
    await fs.copyFile(`${__lib_dir}/project/package.json`, `${current_dir}/package.json`);
    await fs.copyFile(`${__lib_dir}/project/README.md`, `${current_dir}/README.md`);
    await init(current_dir);
    // const commandToExec = `npm install && npm link terraform-template` //`npm install && npm run init`
    // await executeCommand(commandToExec, current_dir);

  } catch (err) {
    console.log(err);
  }
}

export async function startMultiProject() {
  try {
    const __lib_dir = `${import.meta.dirname}/lib`;
    const current_dir = process.cwd();
    await fs.cp(`${__lib_dir}/nodejs/`, `${current_dir}/nodejs-template/`, { recursive: true });
    await fs.copyFile(`${__lib_dir}/project/package.json`, `${current_dir}/nodejs-template/package.json`);
    await fs.cp(`${__lib_dir}/python/`, `${current_dir}/python-template/`, { recursive: true });
    await fs.copyFile(`${__lib_dir}/project/package.json`, `${current_dir}/python-template/package.json`);
    await fs.cp(`${__lib_dir}/project_multi/`, `${current_dir}/`, { recursive: true });
    await fs.copyFile(`${__lib_dir}/project/.gitignore`, `${current_dir}/.gitignore`);
    await initAll();
    // const commandToExec = `npm install && npm link terraform-template` //`npm install`
    // await executeCommand(commandToExec, current_dir);
    // await runCommandInDirs(commandToExec);


  } catch (err) {
    console.log(err);
  }
}

export async function init(current_dir) {
  try {
    const __lib_dir = `${import.meta.dirname}/lib`;
    const deploy_dir = `${current_dir}/deploy`;
    await fs.cp(`${__lib_dir}/deploy/`, `${deploy_dir}/`, { recursive: true });
    await fs.copyFile(`${__lib_dir}/project/example.deploy.yaml`, `${current_dir}/example.deploy.yaml`);
    await fs.copyFile(`${__lib_dir}/project/.env.example`, `${current_dir}/example.env`);

  } catch (err) {
      console.log(err);
  }
}

export async function initAll() {
  let commandToExec = `npm run init`;
  await runCommandInDirs(commandToExec);
}
export async function cleanAll() {
  await fs.rm(`${process.cwd()}/node_modules`,{recursive: true})
  let commandToExec = `npm run clean`;
  await runCommandInDirs(commandToExec);
}

export async function deployAll() {
  let commandToExec = `npm run init && npm run deploy`;
  await runCommandInDirs(commandToExec);
}

export async function destroyAll() {
  let commandToExec = `npm run destroy`;
  await runCommandInDirs(commandToExec);
}

async function runCommandInDirs (commandToExec) {
  try {
    const currentDir = process.cwd();
    console.log(`Scanning for directories in: ${currentDir}`);
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    const directories = entries
      .filter(entry => 
        entry.isDirectory() && 
        entry.name !== '.git' && 
        entry.name !== 'node_modules'
      )
      .map(entry => entry.name);

    if (directories.length === 0) {
      console.log('No subdirectories found to deploy.');
      return;
    }

    console.log(`Found directories to deploy: ${directories.join(', ')}`);
    console.log('---');

    for (const dir of directories) {
        const dirPath = path.join(currentDir, dir);
        try {
          console.log(`--- Executing in ${dir} ---`);
          await executeCommand(commandToExec, dirPath);
        } catch (e) {
          console.error(e.message);
          console.error(`Stopping script due to failure in ${dir}.`);
          break;
        }
    }
    
    console.log('---');
    console.log('All commands finished.');

  } catch (err) {
      console.error('---');
      console.error(`Critical error during directory scan: ${err.message}`);
      console.error('Some commands may not have completed.');
  }
}

function executeCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    // Execute the command, setting the 'cwd' option
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error in ${cwd}:\n${error.message}`);
        return reject(error);
      }

      if (stderr) {
        console.warn(`Stderr in ${cwd}:\n${stderr}`);
      }

      console.log(`Stdout from ${cwd}:\n${stdout}`);
      resolve(stdout);
    });
  });
}