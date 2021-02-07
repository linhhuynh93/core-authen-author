const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });

const mediaconvert = new AWS.MediaConvert({ apiVersion: '2017-08-29' });

exports.handler = async (event) => {
  const params = {
    MaxResults: 0,
  };
  const endpoints = await mediaconvert.describeEndpoints(params).promise();
  const convert = new AWS.MediaConvert({ apiVersion: '2017-08-29', endpoint: endpoints.Endpoints[0].Url });
  await convert.createJob({
    Role: process.env.ROLE,
    AccelerationSettings: {
      Mode: "DISABLED"
    },
    Settings: {
      "Inputs": [
        {
          "AudioSelectors": {
            "Audio Selector 1": {
              "Offset": 0,
              "DefaultSelection": "DEFAULT",
              "ProgramSelection": 1
            }
          },
          "VideoSelector": {
            "ColorSpace": "FOLLOW",
            "Rotate": "DEGREE_0",
            "AlphaBehavior": "DISCARD"
          },
          "FilterEnable": "AUTO",
          "PsiControl": "USE_PSI",
          "FilterStrength": 0,
          "DeblockFilter": "DISABLED",
          "DenoiseFilter": "DISABLED",
          "TimecodeSource": "ZEROBASED",
          "FileInput": `s3://${event.Records[0].s3.bucket.name}/${event.Records[0].s3.object.key}`
        }
      ]
    },
    JobTemplate: process.env.JOB_TEMPLATE,
  }).promise();
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda2!'),
  };
  return response;
};
