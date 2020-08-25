const Image = require('./image');

module.exports.getSignedUrl = async event => {
  const reg = new Image();
  let { code, body } = await reg.getSignedUrl(event).catch(console.error);
  return {
    statusCode: code,
    body: JSON.stringify(body),
  };
};
