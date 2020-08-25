const Regitration = require('./registration');

module.exports.register = async event => {
  const reg = new Regitration();
  let { code, body } = await reg.register(event.body).catch(console.error);
  return {
    statusCode: code,
    body: JSON.stringify(body),
  };
};
