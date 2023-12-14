# Terraform Template
Template for creating Node.js Lambdas, with role and Lambda Layers.
Sample code in index.js runs a port test

To use:
## Prerequisites
- Do a full replace of the string "prog_name" with your program name.
- Adjust the role policies needed in deploy/role.tf
  - If you don't need VPC, also remove subnet_ids and security_group_ids from 5 files.

## Commands
- Test Locally: npm start
- Deploy: npm run deploy
- Clean: npm run clean (removes local temp files)
- Destroy: npm run destroy (removes all objects from AWS)
