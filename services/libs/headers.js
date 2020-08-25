module.exports = function(headers, header) {
  let val = null;
  for (let k in headers) {
    if (k.toLowerCase() === header.toLowerCase()) {
      val = headers[k];
    }
  }
  return val;
};