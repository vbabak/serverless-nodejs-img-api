const Users = require('../../libs/users');
const Validators = require('../../libs/validators');
const Token = require('../../libs/token');
const dynamoDb = require('../../libs/db');
const parsePayload = require('../../libs/parse-payload');

class Registration {
  constructor() {
    this.response = {
      code: 201,
      body: {
        status: "created",
        token: null,
      }
    };
    this.db = dynamoDb;
  }

  async isDataValid(data) {
    let email = data.email;
    if (!email) throw new Error('"email" is missing');
    if (!Validators.isString(email)) throw new Error('"email" is not a string');
    if (!Validators.maxLength(email, 64)) throw new Error('"email" should not be longer 64 symbols');
    if (!Validators.isEmail(email)) throw new Error('"email" is not a valid email');
    let not_exists = await Validators.emailNotExists(this.db, email);
    if (!not_exists) throw new Error('"email" is already exists');

    let password = data.password;
    if (!password) throw new Error('"password" is missing');
    if (!Validators.isString(password)) throw new Error('"password" is not a string');
    if (!Validators.maxLength(password, 64)) throw new Error('"password" should not be longer 64 symbols');
    if (!Validators.minLength(password, 6)) throw new Error('"password" should not be less 6 symbols');

    return true;
  }

  async register(payload) {
    let user = new Users(this.db);
    let data = null;
    try {
      data = parsePayload(payload);
      await this.isDataValid(data);
    } catch (e) {
      // console.error(e);
      this.response.code = 400;
      this.response.body.status = "error";
      this.response.body.error = e.message;
      return this.response;
    }
    try {
      await user.save(data.email, data.password);
      let token = new Token();
      let jwt = token.sign(data.email);
      if (!jwt) throw new Error("Token sign error");
      this.response.body.token = jwt;

    } catch (e) {
      console.error(e);
      this.response.code = 500;
      this.response.body.status = "error";
      this.response.body.error = e.message;
    }
    return this.response;
  }
}

module.exports = Registration;
