import { Injectable } from '@nestjs/common';
const sharp = require('sharp')

import * as aws from 'aws-sdk';
import * as uuid from 'uuid';

import { getFileExtension } from '../utils/string.util';
import { S3Folder } from './enums/s3-folder.enum';

const s3 = new aws.S3();

@Injectable()
export class UploadService {
  
  constructor() {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async upload(path, file) {
    console.log('upload', path)
    var image = await sharp(file.buffer) //.resize({ width: 400, height:400 }) Resize if you want
    // .jpeg({
    //     quality: 40,
    // })
    .toFile(path)
    .catch( err => { 
        console.log('file upload error: ', err);
        return false;
    })

    return true;
  }

  uploadToS3(file: any): Promise<string> {
    const fileExtension = getFileExtension(file.originalname);
    const path = `${S3Folder.Files}/${uuid.v4()}${fileExtension}`;
    return this.uploadToS3WithBuffer(file.buffer, path, {});
  }

  uploadToS3WithBuffer(buffer: Buffer, path: string, meta: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      s3.putObject({
        Body: buffer,
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path,
        Metadata: meta,
        ContentType: 'image/png',
      })
        .promise()
        .then(() => resolve(`${ process.env.STORAGE_HOST }${ path }`), error => reject(error));
        // .then(() => resolve(path), error => reject(error));
    });
  }

  readS3File(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: path
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })  
    })
  }

  getSignedUrl(path: string) {
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: path,
      Expires: 60*5
    })

    console.log('signed url: ', signedUrl);
  }
}
