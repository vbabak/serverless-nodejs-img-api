module.exports = {
  isString: function(s) {
    return (typeof s === 'string');
  },
  minLength: function(s, length) {
    return (s.length >= length);
  },
  maxLength: function(s, length) {
    return (s.length <= length);
  },
  isEmail: function(email) {
    const re = /^[\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,}$/usi;
    return re.test(email);
  },
  emailNotExists: async function(dynamoDb, email) {
    let params = {
      Key: { email },
      TableName: process.env.DYNAMODB_TABLE,
      ConsistentRead: true
    };
    let res = await dynamoDb.get(params).promise();
    return !res.Item;
  },
};
