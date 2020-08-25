const Metadata = require('./metadata');

module.exports.createMetaFile = async event => {
  const meta = new Metadata();
  let res = await meta.createMetaFile(event).catch(console.error);
  return res;
};
