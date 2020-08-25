const crypto = require('crypto');

class Users {
  constructor(db) {
    this.db = db;
  }

  createSalt(password) {
    return password.substring(0, 3);
  }

  createItem(email, password) {
    let hash = this.getPasswordHash(password);
    return { email, password: hash };
  }

  getPasswordHash(password) {
    let salt = this.createSalt(password);
    let hash = crypto.createHash('sha256').update(salt + '' + password).digest("hex");
    return hash;
  }

  async save(email, pwd) {
    let params = {
      Item: this.createItem(email, pwd),
      TableName: process.env.DYNAMODB_TABLE,
    };
    return await this.db.put(params).promise();
  }

  async getUserItem(email) {
    let params = {
      Key: { email },
      TableName: process.env.DYNAMODB_TABLE
    };
    let res = await this.db.get(params).promise();
    return res.Item;
  }
}

module.exports = Users;
