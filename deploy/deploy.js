
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url)); // current directory

let buildDir = 'build';
// // create build dir if not exists
// try {
//   await fs.access(buildDir);
// } catch (error) {
//   await fs.mkdir(buildDir);
// }

// if build dir exists delete it (THIS DOESNT WORK???)
try {
  await fs.access('./'+buildDir);
  await fs.rm('./'+buildDir, { recursive: true });
}
catch(err) {
  console.log(err);
}
// create empty build dir
await fs.mkdir('./'+buildDir);

// copy all files to build dir
let filelist = await fs.readdir(__dirname);
filelist.forEach(file => {
  if(file === 'deploy.js' || file === buildDir) return;
  fs.copyFile(file, './'+buildDir+'/'+file);
});

// get Lambda name from .env file "prog_name" and replace in Terraform files
let env = await fs.readFile('../.env', 'utf8');
let lambdaName = env.split('\n').find(line => line.startsWith('prog_name')).split('=')[1];
let terraformFiles = await fs.readdir('./build');
terraformFiles.forEach(async file => {
  let data = await fs.readFile('./build/'+file, 'utf8');
  let result = data.replace(/\$\{prog_name\}/g, lambdaName);
  await fs.writeFile('./build/'+file, result, 'utf8');
});

// make subdirectory nodejs in build dir and copy in package.json and package-lock.json
await fs.mkdir('./build/nodejs');
await fs.copyFile('../package.json', './build/nodejs/package.json');
await fs.copyFile('../package-lock.json', './build/nodejs/package-lock.json');

// make subdirectory function in build dir and recursively copy in all files from /src 
await fs.mkdir('./build/function');
let srcFiles = await fs.readdir('../src');
srcFiles.forEach(async file => {
  await fs.copyFile('../src/'+file, './build/function/'+file);
});

// call external program "npm install" in nodejs subdirectory
exec('npm install --omit=dev', { cwd: './build/nodejs' }, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
});

// call external program "terraform init" in build dir
exec('terraform init', { cwd: './build' }, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
});
// call external program "terraform apply" in build dir
exec('terraform apply -auto-approve -var-file=../.env', { cwd: './build' }, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
});





// CHEATSHEET
// Copy a file   await fs.copyFile(source, destination);
// Move a file   await fs.rename(source, destination);
// List files in a directory   await fs.readdir(directory);
// Delete a file  await fs.unlink(path);
// Make a directory   await fs.mkdir(path);
// Test if dir exists await fs.access(path);