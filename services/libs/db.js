const AWS = require('aws-sdk');
let dynamodbOptions = {};
if (process.env.IS_OFFLINE) {
  dynamodbOptions = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  };
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamodbOptions);

module.exports = dynamoDb;
