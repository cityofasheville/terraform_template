terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/prog_name/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "prog_name_layer" {
  backend = "s3"
  config = {
    bucket = "avl-tfstate-store"
    key    = "terraform/prog_name/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_function" "prog_name" {
  filename         = "function.zip"
  description      = "Lambda description" 
  function_name    = "prog_name"
  role             = aws_iam_role.prog_name-role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("function.zip")
  layers = [data.terraform_remote_state.prog_name_layer.outputs.prog_name_layer_arn]
  timeout          = 900
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
}

output "prog_name_arn" {
  value = aws_lambda_function.prog_name.arn
}
