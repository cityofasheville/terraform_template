echo "Packaging function as zip..."
rm -f layer.zip
rm -rf nodejs
mkdir nodejs
cd nodejs
cp ../../../package.json .
cp ../../../package-lock.json .
npm ci
cd ..
zip -rq layer.zip nodejs/

echo "send it"
# terraform apply -auto-approve -var-file=ca.tfvars
terraform apply -var-file=ca.tfvars 