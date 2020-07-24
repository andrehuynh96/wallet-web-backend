// const {s3} = require('app/lib/cdn');
// const config = require('app/config');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: "https://s3.ap-southeast-1.amazonaws.com",
  accessKeyId: "AKIAWSQSDOR5NKVSF37P",
  secretAccessKey: "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",
  sslEnabled: true
});

let putParams = {
  Body: "thangdv",
  Bucket: "terraform-state-web-wallet",
  Key: "passphrase/thangdv.txt",
  ServerSideEncryption: "AES256",
  StorageClass: "STANDARD_IA"
}

// s3.putObject(putParams, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
let getParams = {
  Bucket: "terraform-state-web-wallet",
  Key: "kycs/test_upload-1595576415308.png"
}
s3.getObject(getParams, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(typeof data.Body);           // successful response
});