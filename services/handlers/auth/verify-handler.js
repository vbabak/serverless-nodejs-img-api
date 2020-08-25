const Verification = require("./verification");

module.exports.auth = async event => {
  const token = event.authorizationToken;
  const methodArn = event.methodArn;
  let verify = new Verification(token);
  return verify.generateAuthResponse(methodArn);
};
