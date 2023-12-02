import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import { ERRORS } from 'constants/errors';
import { NextResponse } from 'next/server';
import { sendErrorResponse } from '@utils/response';
import { getLastPartOfUrl } from '@utils/getLastPartOfUrl';
import { getSessionFromRequest } from '@utils/getSessionFromRequest';
import { SUCCESS } from 'constants/success';

export const dynamic = 'force-dynamic';

/**
 * 프로필 이미지 수정 api
 * @URL /api/v1/profile/updateImage/:userId
 * @param request
 */
async function PUT(request) {
  await dbConnect();

  try {
    const userId = getLastPartOfUrl(request.url);

    const session = await getSessionFromRequest(request);
    if (!session) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
    }

    if (session.mongoId !== userId) {
      throw new Error(ERRORS.UNAUTHORIZED_USER.MESSAGE);
    }

    const bodyData = await request.text();
    const parsedData = JSON.parse(bodyData);
    const { imageUrl } = parsedData;

    await User.findByIdAndUpdate(userId, { profileImage: imageUrl }).exec();

    return NextResponse.json({
      status: 200,
      message: SUCCESS.PROFILE_PUT_IMAGE,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { PUT };
