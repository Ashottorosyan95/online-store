const {
    S3Client,
    HeadBucketCommand,
    DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
require("dotenv").config();

const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const S3_BUCKET_NAME = process.env.S3_BUCKET;
const headBucketParams = { Bucket: S3_BUCKET_NAME };
const headBucketCommand = new HeadBucketCommand(headBucketParams);

const checkS3Connection = async () => {
    try {
        await s3.send(headBucketCommand);
        console.log("S3 connection successful");
    } catch (error) {
        console.error("Error connecting to S3:", error);
    }
};

const S3UploadImg = async (filePath, buffer, width = 800) => {
    try {
        const resizedImgBuffer = await sharp(buffer)
            .resize(width) // resize the image to a maximum width of 800 pixels
            .toBuffer(); // convert the image to a Buffer object
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: filePath,
            Body: resizedImgBuffer,
        });
        const response = await s3.send(command);
        return response;
    } catch (err) {
        return err;
    }
};

const S3GetImg = async (filePath) => {
    return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${filePath}`;
};

const S3DeleteImg = async (filePath) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: filePath,
        });
        const response = await s3.send(command);
        return response;
    } catch (err) {
        return err;
    }
};

module.exports = {
    S3UploadImg,
    S3GetImg,
    checkS3Connection,
    S3DeleteImg,
};  