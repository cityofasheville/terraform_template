const lambda_auth_settings = (config) => {
return `\n
resource "aws_apigatewayv2_api" "${config.prog_name}" {
  name          = "${config.prog_name}"
  protocol_type = "HTTP"
  # target        = aws_lambda_function.${config.prog_name}.arn
  tags = {
    Name          = "${config.prog_name}"
    "coa:application" = "${config.prog_name}"
    "coa:department"  = "information-technology"
    "coa:owner"       = "${config.owner_tag}"
    "coa:owner-team"  = "dev"
  }
  cors_configuration {
    allow_headers     = ["*"]
    allow_methods     = ["POST", "GET"]
    allow_origins     = ["*"]
    expose_headers    = ["*"]
    max_age           = 300
  }
}

resource "aws_apigatewayv2_domain_name" "domain-name-${config.prog_name}" {
  domain_name = "${config.domain_name}"
  domain_name_configuration {
    certificate_arn = "${config.certificate_arn}"
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_stage" "default_stage_${config.prog_name}" {
  api_id      = aws_apigatewayv2_api.${config.prog_name}.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_api_mapping" "apigw-map-${config.prog_name}" {
  api_id      = aws_apigatewayv2_api.${config.prog_name}.id
  domain_name = "${config.domain_name}"
  
  # This now points to the name of the explicit stage we created
  stage       = aws_apigatewayv2_stage.default_stage_${config.prog_name}.name
}

# resource "aws_lambda_permission" "apigw-${config.prog_name}" {
#  action        = "lambda:InvokeFunction"
#  function_name = aws_lambda_function.${config.prog_name}.function_name
#  principal     = "apigateway.amazonaws.com"
#  source_arn = "\${aws_apigatewayv2_api.${config.prog_name}.execution_arn}/*/*"
#}

output "${config.prog_name}_api_url" {
  value = aws_apigatewayv2_domain_name.domain-name-${config.prog_name}.domain_name
}

output "${config.prog_name}_api_id" {
  value = aws_apigatewayv2_api.${config.prog_name}.id
}

# --- AUTHORIZER RESOURCES ---

# Zip file for Lambda Function
data "archive_file" "${config.prog_name}_authorizer_zip" {
  type        = "zip"
  source_dir  = "${config.build_dir}/authdir"
  output_path = "${config.build_dir}/function_auth.zip"
}

# Lambda Function
resource "aws_lambda_function" "${config.prog_name}_authorizer" {
  description      = "Authorizer for ${config.description}" 
  function_name    = "${config.prog_name}_authorizer"
  role             = aws_iam_role.${config.prog_name}-role.arn
  handler          = "index.handler"
  runtime          = "${config.nodejs_or_python==='nodejs'?'nodejs20.x':'python3.12'}"
  filename = data.archive_file.${config.prog_name}_authorizer_zip.output_path
  source_code_hash = data.archive_file.${config.prog_name}_authorizer_zip.output_base64sha256
  layers = [aws_lambda_layer_version.${config.prog_name}_layer.arn]
  timeout          = 900
  # memory_size      = 256
  ${config.vpc_settings}
  tags = {
    Name          = "${config.prog_name}"
    "coa:application" = "${config.prog_name}"
    "coa:department"  = "information-technology"
    "coa:owner"       = "${config.owner_tag}"
    "coa:owner-team"  = "dev"
    Description   = "${config.prog_name}"
  }
  environment {
    variables = {}
  }
}

output "${config.prog_name}_authorizer_arn" {
  value = aws_lambda_function.${config.prog_name}_authorizer.arn
}

resource "aws_apigatewayv2_authorizer" "${config.prog_name}_authorizer" {
  name                              = "${config.prog_name}-authorizer"
  api_id                            = aws_apigatewayv2_api.${config.prog_name}.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.${config.prog_name}_authorizer.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = true
  identity_sources = ["$request.header.Authorization"]
}

# This permission allows API Gateway to invoke your AUTHORIZER function.
resource "aws_lambda_permission" "apigw-authorizer-${config.prog_name}" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.${config.prog_name}_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "\${aws_apigatewayv2_api.${config.prog_name}.execution_arn}/authorizers/\${aws_apigatewayv2_authorizer.${config.prog_name}_authorizer.id}"
}

# --- END: AUTHORIZER RESOURCES ---


# --- INTEGRATION AND ROUTE ---

# This creates the integration with your MAIN business logic Lambda.
resource "aws_apigatewayv2_integration" "${config.prog_name}" {
  api_id                 = aws_apigatewayv2_api.${config.prog_name}.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.${config.prog_name}.invoke_arn
  payload_format_version = "2.0"
}

# This creates a "$default" route to catch all requests and attaches the authorizer.
resource "aws_apigatewayv2_route" "default-${config.prog_name}" {
  api_id    = aws_apigatewayv2_api.${config.prog_name}.id
  route_key = "$default"
  target    = "integrations/\${aws_apigatewayv2_integration.${config.prog_name}.id}"

  # This secures the route
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.${config.prog_name}_authorizer.id
}

# --- END: INTEGRATION AND ROUTE ---

# This permission allows API Gateway (via the integration) to invoke your MAIN function.
resource "aws_lambda_permission" "apigw-${config.prog_name}" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.${config.prog_name}.function_name
  principal     = "apigateway.amazonaws.com"
  
  # Source ARN is updated to reflect the explicit route
  source_arn = "\${aws_apigatewayv2_api.${config.prog_name}.execution_arn}/*"
}
`
}
export {lambda_auth_settings};