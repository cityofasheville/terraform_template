# Terraform Template
Template for creating Node.js Lambdas, with role and Lambda Layers.
Sample code in index.js runs a port test

To use:
## Prerequisites
- Program code goes in src dir.
- Add the program name as environment variable in the .env file as prog_name=
- Adjust the role policies needed in deploy/role.tf
  - If you don't need VPC, also remove subnet_ids and security_group_ids from 5 files.

## Commands
- Test Locally: npm start
- Deploy: npm run deploy
- Clean: npm run clean (removes local temp files)
- Destroy: npm run destroy (removes all objects from AWS)

## Environment variables
deploy/get-env.js allows copying of .env variables to Lambda without appearing in repo. Called from config.tf

## TODO
The deploy scripts could be rewritten in JavaScript, which would facilitate cross platform usage. 

