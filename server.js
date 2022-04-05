/**
 * References: 
 * 1. https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html - S3 Bucket policy
 * 2. https://www.npmjs.com/package/aws-sdk - AWS javascript sdk library
 * 3. https://aws.plainenglish.io/deploying-a-nodejs-application-in-aws-ec2-c1618b9b3874 - EC2 setup
 */


/**
 * Necessary import of libraries
 */
const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const axios = require("axios").default;

/**
 * Creating an instace of AWS S3 Bucket from the account details
 */
const s3 = new AWS.S3({
  accessKeyId: "ASIA4ACA2CZTFK6QJ46S",
  secretAccessKey: "VjKI2uLXbVIUA/vbbbh//XKoorZnFMRmUAjnlD4E",
  sessionToken:
    "FwoGZXIvYXdzEP7//////////wEaDLYHT6h6jZIooEijwSLAASSgsWfTh7dttPzpc+BJ9OpH7D5Uajfzk9JyODmbAoZZ7O7Qo3r7DWU00VbgzrG/9JHzqL99PshjQtk6zobbNK0X+7W7Qsodey1jllagNXqGJtuGHl6iK34eQyDJp5tfrYeqd774M+o/K/wThlM8iu+FUcXoQesuzXO+LiJ2rDuMt5O/RjFV7eGLfZVV+Q4XrkmC3+LVvaGoS4j3hjb+TLoPt23uWZmXR9vryCUGwXTlN4G+uZz5e68CnyGH1AlaxyiSoYaRBjItr2p6c6MEqCYOpslxC5R2/fqM9OYNzwkQ72Y5+EVPRMdYoc48JdydBT30lcf2",
});

/**
 * Configuring express for running the server
 */
app.use(express.json());

app.listen(80, () => {
  console.log("Listening on port 80...");
});


/** 
 * Description: Sample REST API for testing
 * Method: GET
*/
app.get("/", (req, res) => {
  res.send({ message: `Hello World` });
});

/** 
 * Description: begin API for sending banner id and details to Rob's Server 
 * Method: POST
*/
app.post("/begin", async (req, res) => {
  await axios
    .post("http://3.88.132.229/begin", {
      banner: "B00870510",
      ip: "ec2-54-210-126-152.compute-1.amazonaws.com",
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  res.sendStatus(200);
});

/** 
 * Description: storeData API for uploading file to AWS S3 Bucket  
 * Method: POST
*/
app.post("/storedata", async (req, res) => {
  console.log("/storedata POST API CALLED");
  const url = await uploadFile(req.body.data);
  res.send({ s3uri: url }).status(200);
});

/**
 * Description: Helper function to upload file to AWS S3 Bucket and retrieve the public URI 
 * for location of the file in the bucket
 * @param {Parameter for provisioning string provided by Rob's API} text 
 * @returns {Returns location (URI) of the uploaded file in the AWS S3 storage}
 */
const uploadFile = async (text) => {
  const params = {
    Bucket: "csci5709-a2",
    Key: "sample.txt",
    Body: text,
  };
  const stored = await s3.upload(params).promise();
  return stored.Location;
};
