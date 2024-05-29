# Terraform Template
Template for deploying Node.js or Python Lambdas to AWS using Terraform, with Role and Lambda Layers.
See the file ```deploy/example.deploy.yaml``` for available options.
Sample code in src/index.js runs a port test

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
  - ```npm run deploy prod```
  - ```npm run deploy dev```
- Destroy: (removes all objects from AWS)
  - ```npm run destroy prod```
  - ```npm run destroy dev``` 
- Clean: 
  - ```npm run clean``` (removes local temp files)


### Local dev
Before running ```npm run startpy```, you should create a venv and run ```pip3 install -r requirements.txt``` or some other magical Python incantation.
