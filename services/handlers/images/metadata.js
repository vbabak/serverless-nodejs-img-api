const util = require('util');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const crypto = require('crypto');
const fs = require('fs');
const exiftool = require('../../libs/exiftool');
const getExifFromLocalFileUsingNodeFs = util.promisify(exiftool.getExifFromLocalFileUsingNodeFs);


class Metadata {

  async getObject(record) {
    try {
      let fname = record.s3.object.key
      const params = {
        Bucket: record.s3.bucket.name,
        Key: fname
      };
      let tmp_dir = '/tmp/metadata/';
      if (!fs.existsSync(tmp_dir)) {
        // console.log("TMP dir does not exists, creating");
        fs.mkdirSync(tmp_dir);
      }
      let tmpfile = tmp_dir + crypto.createHash('md5').update(fname).digest('hex');
      // console.log({ tmpfile });
      await this.download(params, tmpfile);
      // console.log({ file_exists: fs.existsSync(tmpfile) });
      // console.log({ stats: fs.statSync(tmpfile) });
      return tmpfile;
    } catch (e) {
      console.error("s3.getObject error");
      throw e;
    }
  }

  download(params, tmpfile) {
    return new Promise((resolve, reject) => {
      const s3Stream = s3.getObject(params).createReadStream();
      const fileStream = fs.createWriteStream(tmpfile);
      s3Stream.on('error', reject);
      fileStream.on('error', reject);
      fileStream.on('close', () => { resolve(tmpfile); });
      s3Stream.pipe(fileStream);
    });
  }

  async writeMetadata(record, metadata) {
    try {
      // console.log({ metadata });
      metadata['SourceFile'] = record.s3.object.key;
      const destparams = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key + ".meta.json",
        Body: JSON.stringify(metadata, null, 2),
        ContentType: "application/json"
      };
      const putResult = await s3.putObject(destparams).promise();
      return putResult;
    } catch (e) {
      console.error("s3.putObject error");
      throw e;
    }
  }

  async getMeta(file) {
    try {
      // console.log({ file });
      let metadata = await getExifFromLocalFileUsingNodeFs(fs, file);
      fs.unlinkSync(file);
      return metadata;
    } catch (e) {
      console.error("getMeta() error");
      throw e;
    }
  }

  async createMetaFile(event) {
    for (let record of event.Records) {
      if (record.s3.object.key.substr(-5) == ".json") throw new Error("JSON file is not supported");
      let tmp_file = await this.getObject(record);
      let metadata = await this.getMeta(tmp_file);
      await this.writeMetadata(record, metadata);
      break;
    }
    return true;
  }
}

module.exports = Metadata;
