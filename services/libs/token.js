const jwt = require('jsonwebtoken');

class Token {
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = 86400 // expires in 24 hours
  }

  setExpiresIn(expiresIn) {
    this.expiresIn = expiresIn;
  }

  sign(email) {
    let token = false;
    try {
      token = jwt.sign({ email }, this.secret, {
        expiresIn: this.expiresIn
      });
    } catch (e) {
      console.error(e);
    }
    return token;
  }

  verify(token) {
    let decoded = false;
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (e) {
      // console.error(e);
    }
    return decoded;
  }
}

module.exports = Token;
