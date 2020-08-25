const Token = require('../../libs/token');

class Verification {

  constructor(token) {
    this.token = token;
  }

  generatePolicy(principalId, effect, resource) {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17';
      policyDocument.Statement = [];
      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke';
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
    }
    return authResponse;
  }

  generateAuthResponse(resource) {
    let tokenService = new Token();
    let decoded = tokenService.verify(this.token);
    let effect = "Deny";
    let principalId = "user";
    if (decoded) {
      effect = "Allow";
      principalId = decoded.email;
    }
    return this.generatePolicy(principalId, effect, resource);
  }

}

module.exports = Verification;
