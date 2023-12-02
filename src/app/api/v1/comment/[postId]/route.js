import createError from 'http-errors';
import { NextResponse } from 'next/server';

import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import User from '@models/User';
import Comment from '@models/Comment';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';
import { getLastPartOfUrl } from '@utils/getLastPartOfUrl';

export const dynamic = 'force-dynamic';

/**
 * 댓글 생성 API
 * @URL /api/v1/comment/:postId
 * @param request
 */
async function POST(request) {
  await dbConnect();

  try {
    const postId = getLastPartOfUrl(request.url);
    const { comment, author } = await request.json();

    if (!comment || !author) {
      throw createError(
        ERRORS.MISSING_PARAMETERS.STATUS_CODE,
        ERRORS.MISSING_PARAMETERS.MESSAGE,
      );
    }

    validateObjectId(postId);
    validateObjectId(author);

    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
      throw createError(
        ERRORS.POST_NOT_FOUND.STATUS_CODE,
        ERRORS.POST_NOT_FOUND.MESSAGE,
      );
    }

    const newComment = await Comment.create({
      comment,
      author,
      blogPost: postId,
    });

    const authorInfo = await User.findById(author, 'nickname');

    newComment.author = authorInfo;

    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } },
      { new: true, useFindAndModify: false },
    );

    await User.findByIdAndUpdate(
      author,
      { $push: { comments: newComment._id } },
      { new: true, useFindAndModify: false },
    );

    return NextResponse.json({
      status: 200,
      data: newComment,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 댓글 조회 API
 * @URL /api/v1/comment/:postId
 * @param request
 */
async function GET(request) {
  await dbConnect();

  try {
    const postId = getLastPartOfUrl(request.url);
    validateObjectId(postId);

    const currentPost = await Post.findById(postId).lean().exec();

    if (!currentPost) {
      throw createError(
        ERRORS.POST_NOT_FOUND.STATUS_CODE,
        ERRORS.POST_NOT_FOUND.MESSAGE,
      );
    }

    const comments = await Comment.find({
      _id: { $in: currentPost.comments },
    })
      .populate({ path: 'author', select: 'nickname' })
      .lean()
      .exec();

    return NextResponse.json({
      status: 200,
      data: comments,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { POST, GET };
