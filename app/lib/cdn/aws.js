const config = require('app/config');
const AWS = require('aws-sdk');

let s3 = new AWS.S3({
  endpoint: config.CDN.url,
  accessKeyId: config.CDN.accessKey,
  secretAccessKey: config.CDN.secretKey,
  sslEnabled: true
}); 

module.exports = s3;