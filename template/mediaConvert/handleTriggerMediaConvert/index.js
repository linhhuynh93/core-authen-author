const AWS = require("aws-sdk");
const axios = require("axios");

AWS.config.update({ region: process.env.REGION });

const mediaconvert = new AWS.MediaConvert({ apiVersion: '2017-08-29' });

exports.handler = async (event) => {
  try {
    const params = {
      MaxResults: 0,
    };
    const endpoints = await mediaconvert.describeEndpoints(params).promise();
    const convert = new AWS.MediaConvert({ apiVersion: '2017-08-29', endpoint: endpoints.Endpoints[0].Url });

    for (const index in event.Records) {
      const record = event.Records[index];
      let body = record.body;
      if (typeof (body) === "string") {
        body = JSON.parse(body);
      }
      const job = await convert.getJob({ Id: body.detail.jobId }).promise();
      const fileUrl = job.Job.Settings.Inputs[0].FileInput
      const fileNames = fileUrl.split('/');
      const name = fileNames[fileNames.length - 1];
      // @TODO: call with internal key
      const result = await axios({
        method: "patch",
        url: `${process.env.UPDATE_MEDIA_STATUS_API}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization-internal": process.env.INTERNAL_KEY,
        },
        data: { name, status: job.Job.Status.toLowerCase() },
      });
      if (result.data.message) {
        throw new Error(result.data.message);
      }
    }
    return;
  } catch (err) { 
    throw new Error(err);
  }
};
