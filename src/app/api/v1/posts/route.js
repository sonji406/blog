import createError from 'http-errors';
import { NextResponse } from 'next/server';

import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';

export const dynamic = 'force-dynamic';

/**
 * 포스트 목록 조회 API
 * @URL /api/v1/posts?userId=:userId&page={page_number}&limit={items_per_page}
 * @param request
 */
async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    if (userId) {
      validateObjectId(userId);
    }

    if (!page || !limit) {
      throw createError(
        ERRORS.MISSING_PARAMETERS.STATUS_CODE,
        ERRORS.MISSING_PARAMETERS.MESSAGE,
      );
    }

    const findOption = userId ? { author: userId } : {};
    const posts = await Post.find(findOption)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const totalPosts = await Post.countDocuments(findOption);

    return NextResponse.json({
      status: 200,
      data: posts,
      totalPosts: totalPosts,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { GET };
