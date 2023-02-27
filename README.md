# Terraform Template
Template for creating Node.js Lambdas, with role and Lambda Layers.

To use:
- Do a full replace of the string "prog_name" with your program name.
- Adjust the role policies needed in utils/deploy/role.tf
  - If you don't need VPC, also remove subnet_ids and security_group_ids from 5 files.
- Test Locally: utils/test/runsam.sh
- Deploy:
  - cd utils/deploy_layer/
    - terraform init (First time only)
    - zipdeploy_layer.sh
  - cd utils/deploy/
    - terraform init (First time only)
    - zipdeploy.sh

- Tear it all back down in the reverse order
  - terraform destroy -var-file=ca.tfvars