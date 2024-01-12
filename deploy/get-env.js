// This script is used to get the environment variables from the .env file and load them into Terraform.
// Called from config.tf - Each env variable is hard coded in files: .env, config.tf, get-env.js, and variables.tf
// and then used in program as process.env.CONNECTSTRING
// Node 20 reads .env file with command line "node --env-file=.env script.js", for earlier vers use dotenv
console.log( JSON.stringify({
  CONNECTSTRING: process.env.CONNECTSTRING
}) );