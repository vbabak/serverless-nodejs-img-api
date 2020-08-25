const Verification = require("../handlers/auth/verification");
const TokenService = require("../libs/token");

beforeAll(async (done) => {
  process.env.JWT_SECRET = "1371839bjjbj";
  done();
});
describe('Verification.generateAuthResponse()', () => {
  test('check policyDocument for expired token', async () => {
    let tkn = new TokenService();
    tkn.setExpiresIn(-1);
    const token_expired = tkn.sign("user@email.com");
    let arn = "resource";
    let verify = new Verification(token_expired);
    let authResponse = verify.generateAuthResponse(arn);

    expect(authResponse).toHaveProperty("principalId");
    expect(authResponse).toHaveProperty("policyDocument");
    expect(authResponse.policyDocument).toHaveProperty("Statement");
    expect(authResponse.policyDocument.Statement[0]).toHaveProperty("Effect");
    expect(authResponse.policyDocument.Statement[0].Effect).toBe("Deny");
    expect(authResponse.policyDocument.Statement[0]).toHaveProperty("Resource");
    expect(authResponse.policyDocument.Statement[0].Resource).toBe(arn);
  });

  test('check policyDocument for valid token', async () => {
    let tkn = new TokenService();
    tkn.setExpiresIn(1000);
    const token = tkn.sign("user@email.com");
    let arn = "resource";
    let verify = new Verification(token);
    let authResponse = verify.generateAuthResponse(arn);

    expect(authResponse).toHaveProperty("policyDocument");
    expect(authResponse.policyDocument).toHaveProperty("Statement");
    expect(authResponse.policyDocument.Statement[0]).toHaveProperty("Effect");
    expect(authResponse.policyDocument.Statement[0].Effect).toBe("Allow");
    expect(authResponse.policyDocument.Statement[0]).toHaveProperty("Resource");
    expect(authResponse.policyDocument.Statement[0].Resource).toBe(arn);
  });
});
