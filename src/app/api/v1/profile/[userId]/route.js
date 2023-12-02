import createError from 'http-errors';
import { NextResponse } from 'next/server';

import dbConnect from '@lib/dbConnect';
import User from '@models/User';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';
import { findById } from '@utils/findById';
import { getLastPartOfUrl } from '@utils/getLastPartOfUrl';
import { getSessionFromRequest } from '@utils/getSessionFromRequest';
import { SUCCESS } from 'constants/success';

export const dynamic = 'force-dynamic';

/**
 * 유저 프로필 조회 API
 * @URL /api/v1/profile/:userId
 * @param request
 */
async function GET(request) {
  await dbConnect();

  try {
    const userId = getLastPartOfUrl(request.url);
    validateObjectId(userId);

    const session = await getSessionFromRequest(request);
    if (!session) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
    }

    if (session.mongoId !== userId) {
      throw new Error(ERRORS.UNAUTHORIZED_USER.MESSAGE);
    }

    const userProfile = await findById(User, userId, ERRORS.USER_NOT_FOUND);

    return NextResponse.json({
      status: 200,
      data: userProfile,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 유저 프로필 수정 API
 * @URL /api/v1/profile/:userId
 * @param request
 */
async function PUT(request) {
  await dbConnect();

  try {
    const userId = getLastPartOfUrl(request.url);
    validateObjectId(userId);

    const session = await getSessionFromRequest(request);
    if (!session) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
    }

    if (session.mongoId !== userId) {
      throw new Error(ERRORS.UNAUTHORIZED_USER.MESSAGE);
    }

    const bodyData = await request.text();
    const parsedData = JSON.parse(bodyData);
    const { nickname } = parsedData;

    if (!nickname) {
      throw createError(
        ERRORS.MISSING_NICKNAME.STATUS_CODE,
        ERRORS.MISSING_NICKNAME.MESSAGE,
      );
    }

    const existingUser = await User.findOne({ nickname }).lean().exec();
    if (existingUser && String(existingUser._id) !== userId) {
      throw createError(
        ERRORS.DUPLICATE_NICKNAME.STATUS_CODE,
        ERRORS.DUPLICATE_NICKNAME.MESSAGE,
      );
    }

    const userProfile = await findById(User, userId, ERRORS.USER_NOT_FOUND);

    if (userProfile.nickname === nickname) {
      throw createError(
        ERRORS.SAME_NICKNAME.STATUS_CODE,
        ERRORS.SAME_NICKNAME.MESSAGE,
      );
    }

    await User.findByIdAndUpdate(userId, { nickname }).exec();

    return NextResponse.json({
      status: 200,
      data: {
        message: SUCCESS.PROFILE_PUT,
      },
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { GET, PUT };
