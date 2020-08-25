module.exports = function(payload) {
  let data;
  try {
    data = JSON.parse(payload);
  } catch (e) {
    throw new Error('payload is not a valid JSON');
  }
  return data;
};
