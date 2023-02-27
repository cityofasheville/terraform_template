echo "Packaging function as zip..."
rm -f function.zip
zip -q function.zip ../../*.js ../../package.json

echo "send it"
# terraform apply -auto-approve -var-file=ca.tfvars
terraform apply -var-file=ca.tfvars 