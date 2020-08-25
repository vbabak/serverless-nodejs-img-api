const Validators = require('../../libs/validators');
const Token = require('../../libs/token');
const dynamoDb = require('../../libs/db');
const Users = require('../../libs/users');
const parsePayload = require('../../libs/parse-payload');

class Login {
  constructor() {
    this.response = {
      code: 200,
      body: {
        token: null,
      }
    };
    this.db = dynamoDb;
  }

  isDataValid(data) {
    let email = data.email;
    if (!email) throw new Error('"email" is missing');
    if (!Validators.isString(email)) throw new Error('"email" is not a string');
    if (!Validators.maxLength(email, 64)) throw new Error('"email" should not be longer 64 symbols');
    if (!Validators.isEmail(email)) throw new Error('"email" is not a valid email');

    let password = data.password;
    if (!password) throw new Error('"password" is missing');
    if (!Validators.isString(password)) throw new Error('"password" is not a string');
    if (!Validators.maxLength(password, 64)) throw new Error('"password" should not be longer 64 symbols');
    if (!Validators.minLength(password, 6)) throw new Error('"password" should not be less 6 symbols');

    return true;
  }

  async getUser(email, password) {
    let users = new Users(this.db);
    let item = await users.getUserItem(email);
    if (!item) throw new Error('User not found');
    if (item.password != users.getPasswordHash(password)) throw new Error('User credentials mismatch');
    return item;
  }

  async login(payload) {
    let data = null;
    let userItem = null;
    try {
      data = parsePayload(payload);
      this.isDataValid(data);
      userItem = await this.getUser(data.email, data.password);
    } catch (e) {
      this.response.code = 400;
      this.response.body.error = e.message;
      return this.response;
    }
    try {
      let token = new Token();
      let jwt = token.sign(userItem.email);
      if (!jwt) throw new Error("Token sign error");
      this.response.body.token = jwt;

    } catch (e) {
      console.error(e);
      this.response.code = 500;
      this.response.body.error = e.message;
    }
    return this.response;
  }
}

module.exports = Login;
