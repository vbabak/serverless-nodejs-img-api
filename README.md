# Serverless Image Upload API
Tested on serverless v1.79.0 and AWS Lambda.

## Setup

### Configure
```bash
cd services
cp sample.secrets.json secrets.dev.json
cp sample.secrets.json secrets.prod.json
```

Edit `secrets.dev.json` values and `secrets.prod.json` values.
Set your unique S3_BUCKET name.

### Install Serverless
```bash
npm install serverless -g
```

### Install Required Packages
```bash
npm i
```

Run Tests
```bash
npm test
```

## Local Mode

### DynamoDB Local (Re)install
```bash
sls dynamodb remove
sls dynamodb install
```

### Serverless Oflline Start
```bash
sls offline start
```

### Test Requests

#### Create User
```bash
curl -i -d '{"email": "testuser@email.com", "password": "123456"}' http://localhost:3000/dev/register
```
#### Login
```bash
curl -i -d '{"email": "testuser@email.com", "password": "123456"}' https://aozanz6q1d.execute-api.eu-west-1.amazonaws.com/prod/login
```

#### Get Image Upload URL
```bash
curl -i -X POST -H 'X-AMZ-meta-filekey: smile.jpg' -H 'Authorization: TOKEN' http://localhost:3000/dev/get-upload-url
```

#### Upload Image
```bash
curl -i -X PUT -T "../smile-icon.jpg" 'https://signed_url'
```

#### Upload Image
```bash
curl -i -X POST -H "Content-Type: multipart/form-data" -F "data=@../smile-icon.jpg" 'https://signed_url'
```
Use single quotes to avoid url parsing by bash.

## Deploy
```bash
serverless deploy --stage prod
```

### Fetch Metadata
Currently configured for files with suffix ".jpg".

## Uninstall Stack
```
serverless remove --stage prod
```
