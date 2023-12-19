terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/prog_name/layer/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

# Zip file for Lambda Layer
data "archive_file" "prog_name_layer_zip" {
  type        = "zip"
  source_dir  = "${path.module}/nodejs"
  output_path = "${path.module}/layer.zip"
}

# Lambda Layer
resource "aws_lambda_layer_version" "prog_name_layer" {
  filename   = "${path.module}/layer.zip"
  source_code_hash = data.archive_file.prog_name_layer_zip.output_base64sha256
  layer_name = "prog_name_layer"
}

output "prog_name_layer_arn" {
  value = aws_lambda_layer_version.prog_name_layer.arn
}

# Zip file for Lambda Function
data "archive_file" "prog_name_zip" {
  type        = "zip"
  source_dir  = "${path.module}/function"
  output_path = "${path.module}/function.zip"
}

#Env vars
data "external" "env" {
  program = ["node", "--env-file=../.env", "./get-env.js"]
}


# Lambda Function
resource "aws_lambda_function" "prog_name" {
  description      = "Lambda description" 
  function_name    = "prog_name"
  role             = aws_iam_role.prog_name-role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename = data.archive_file.prog_name_zip.output_path
  source_code_hash = data.archive_file.prog_name_zip.output_base64sha256
  layers = [aws_lambda_layer_version.prog_name_layer.arn]
  # timeout          = 900
  # memory_size      = 256
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
  tags = {
    Name          = "prog_name"
    "coa:application" = "prog_name"
    "coa:department"  = "information-technology"
    "coa:owner"       = "jtwilson@ashevillenc.gov"
    "coa:owner-team"  = "dev"
    Description   = "Lambda description"
  }
  environment {
    variables = {
      "CONNECTSTRING": data.external.env.result.CONNECTSTRING
    }
  }
}

output "prog_name_arn" {
  value = aws_lambda_function.prog_name.arn
}