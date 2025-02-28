# Terraform Template
Template for deploying Node.js or Python Lambdas to AWS using Terraform, with Role and Lambda Layers.
See the file ```deploy/example.deploy.yaml``` for available options.
Sample code in src/index.js runs a port test

## Installing prerequisites
This script uses Node.js and Terraform to deploy. If you are deploying Python you obviously need that too, and if you require cross-compiling the Python also install AWS SAM and Docker.

## Setting Up
- Copy the file ```deploy/example.deploy.yaml``` to ```deploy/deploy.yaml```.
- If your program uses environment variables, copy ```.env.example``` to ```.env```.
- Terraform will need an empty S3 Bucket to store its state file. This allows sharing of state with your esteemed colleagues.
- Program code goes in src/ dir.
  - For Node.js:
    - The file src/index.js should export the function handler.
    - The file src/local.js can import index.js for local testing.
    - Any other program files and subdirs needed can also go in src/.
  - For Python:
    - Set nodejs_or_python to python in ```deploy.yaml```. 
    - The file src/index.py should export the function handler.
    - You can include a requirements.txt file in src/
- Make sure you have AWS administrator permissions to deploy.

### Usage
First run ```npm install```

```package.json``` has these scripts:
- Test Locally: 
  - ```npm start``` (or for a Python program: ```npm run startpy```)
- Deploy: 
  - ```npm run deploy```
- Destroy: (removes all objects from AWS)
  - ```npm run destroy```
- Clean: 
  - ```npm run clean``` (removes local temp files)

The Deploy/Destroy commands use the name of the active GitHub branch when creating AWS resources.
For example, if the active GitHub branch is "feature" and the name of the resource is "template", the resource is named "template_feature". For API gateway domains, it's "feature-template.ashevillenc.gov". Production (or main) branches do not get a prefix/suffix.

### Local dev
Before running ```npm run startpy```, you should create a venv and run ```pip3 install -r requirements.txt``` or some other magical Python incantation.
