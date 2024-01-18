# Terraform Template
Template for creating Node.js Lambdas, with role and Lambda Layers.
Sample code in index.js runs a port test

## Usage
### Prerequisites
- Program code goes in src dir.
- Add the name of the Lambda as environment variable in the .env file as prog_name="" (see Environment Variables below)
- Adjust the role policies needed in deploy/role.tf
  - If you don't need VPC, also remove subnet_ids and security_group_ids from 5 files.
- Make sure you have AWS administrator permissions to deploy.

### Commands
- Test Locally: npm start (runs Lambda with test/sam_event.json as event)
- Deploy: npm run deploy
- Clean: npm run clean (removes local temp files)
- Destroy: npm run destroy (removes all objects from AWS)

### Environment variables
Environment variables can be included in the file .env
Copy the format from .env.example
Notice that this is a TF formatted env file with double quotes around values.
In the env.example, there is the _prog_name_ variable which is used to name all the AWS infrastructure.
All the other variables are Terraform variables, (eg. they appear in a TF variable block,) and can be used to build infrastructure or as environment variables for the lambda.
