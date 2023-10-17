terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/prog_name/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_layer_version" "prog_name_layer" {
  filename   = "layer.zip"
  source_code_hash = filebase64sha256("layer.zip")
  layer_name = "prog_name_layer"
}

output "prog_name_layer_arn" {
  value = aws_lambda_layer_version.prog_name_layer.arn
}
