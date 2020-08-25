const AWS = require('aws-sdk');
const getHeader = require('../../libs/headers');

class Image {
  constructor() {
    this.response = {
      code: 200,
      body: {
        url: null,
      }
    };
  }

  getFileName(headers) {
    let file = getHeader(headers, 'x-amz-meta-filekey');
    return file;
  }

  getUserId(requestContext) {
    return requestContext.authorizer.principalId.replace('@', '.');
  }

  async getSignedUrl(event) {
    try {
      const { S3_BUCKET, REGION } = process.env;
      if (!REGION) throw new Error('REGION env is required!');
      const S3 = new AWS.S3({ signatureVersion: 'v4', REGION });
      if (!S3_BUCKET) throw new Error('BUCKET env is required!');
      let file = this.getFileName(event.headers);
      if (!file) throw new Error('"x-amz-meta-filekey" header is missing');
      let userId = this.getUserId(event.requestContext);
      if (!userId) throw new Error('user is not recognized');

      const params = {
        Bucket: S3_BUCKET,
        Key: userId + "/" + file,
        Expires: 1200, // 20 min
      };
      const url = await S3.getSignedUrlPromise('putObject', params);
      this.response.body.url = url;
    } catch (e) {
      console.error(e);
      this.response.code = 500;
      this.response.body.status = "error";
      this.response.body.error = e.message;
    }

    return this.response;
  }
}

module.exports = Image;
