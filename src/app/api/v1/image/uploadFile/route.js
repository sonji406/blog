import { NextResponse } from 'next/server';
import { S3 } from '@aws-sdk/client-s3';
import createError from 'http-errors';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';

export const dynamic = 'force-dynamic';

const s3Data = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * 이미지 조회 api
 * @URL /api/v1/image/uploadFile
 * @param request
 */
async function GET(request) {
  try {
    const { file: fileName, fileType } = request.query;

    const s3Params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };

    const signedUrl = await new Promise((resolve, reject) => {
      s3Data.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          reject(
            createError(
              ERRORS.SIGNED_URL_CREATION_ERROR.STATUS_CODE,
              ERRORS.SIGNED_URL_CREATION_ERROR.MESSAGE,
            ),
          );
        } else {
          resolve(data);
        }
      });
    });

    return NextResponse.json({
      signedRequest: signedUrl,
      url: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 이미지 업로드 api
 * @URL /api/v1/image/uploadFile
 * @param request
 */
async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      throw createError(
        ERRORS.FILE_NOT_FOUND.STATUS_CODE,
        ERRORS.FILE_NOT_FOUND.MESSAGE,
      );
    }

    const fileName = file.name;
    const fileType = file.type;
    const fileStream = file.stream();
    let fileBuffer = Buffer.alloc(0);

    for await (const chunk of fileStream) {
      fileBuffer = Buffer.concat([fileBuffer, chunk]);
    }

    const s3Params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: fileType,
      ACL: 'public-read',
    };

    await s3Data.putObject(s3Params);

    const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

    return NextResponse.json({
      success: 1,
      file: {
        url: fileUrl,
        name: fileName,
        size: fileBuffer.length,
      },
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { GET, POST };
