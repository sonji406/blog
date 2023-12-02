import { NextResponse } from 'next/server';
import createError from 'http-errors';
import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';

export const dynamic = 'force-dynamic';

/**
 * 포스트 검색 API(메인)
 * @URL /v1/posts/search?q=검색어&page={page_number}&limit={items_per_page}
 * 포스트 검색 API (블로그 메인)
 * @URL /v1/posts/search/:userId?q=검색어&page={page_number}&limit={items_per_page}
 * @param request
 */
async function GET(request, { params }) {
  await dbConnect();

  try {
    const userId = params.userId ? params.userId[0] : '';
    const { searchParams } = new URL(request.url);
    const searchValue = searchParams.get('q');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    if (userId) {
      validateObjectId(userId);
    }

    if (!searchValue || !page || !limit) {
      throw createError(
        ERRORS.MISSING_PARAMETERS.STATUS_CODE,
        ERRORS.MISSING_PARAMETERS.MESSAGE,
      );
    }

    const keywardMatchOption = { $regex: searchValue, $options: 'i' };

    const findOption = {
      $or: [
        { title: keywardMatchOption },
        {
          'content.blocks.data.text': keywardMatchOption,
        },
      ],
    };

    if (userId) {
      findOption.author = userId;
    }

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
