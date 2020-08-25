const Login = require('./login');

module.exports.login = async event => {
  const reg = new Login();
  let { code, body } = await reg.login(event.body).catch(console.error);
  return {
    statusCode: code,
    body: JSON.stringify(body),
  };
};
