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
import { getSessionFromRequest } from '@utils/getSessionFromRequest';
import { isLoggedInUser } from '@utils/isLoggedInUser';
import { SUCCESS } from 'constants/success';

export const dynamic = 'force-dynamic';

/**
 * 댓글 수정 API
 * @URL /api/v1/comment/:postId/:commentId
 * @param request
 */
async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { postId, commentId } = params;
    const { comment: newMessage } = await request.json();

    if (!postId || !commentId) {
      throw createError(
        ERRORS.MISSING_PARAMETERS.STATUS_CODE,
        ERRORS.MISSING_PARAMETERS.MESSAGE,
      );
    }

    validateObjectId(postId);
    validateObjectId(commentId);

    const currentComment = await Comment.findById(commentId).exec();
    const commentAuthor = currentComment.author.toString();
    await isLoggedInUser(request, commentAuthor);

    currentComment.comment = newMessage;
    await currentComment.save();

    return NextResponse.json({
      status: 200,
      message: SUCCESS.COMMENT_PUT,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 댓글 삭제 API
 * @URL /api/v1/comment/:postId/:commentId
 * @param request
 */
async function DELETE(request) {
  await dbConnect();

  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      throw createError(
        ERRORS.COMMENT_USER_NOT_LOGGED_IN.STATUS_CODE,
        ERRORS.COMMENT_USER_NOT_LOGGED_IN.MESSAGE,
      );
    }

    const currentUserId = session.mongoId;
    const commentId = getLastPartOfUrl(request.url);

    validateObjectId(commentId);

    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw createError(
        ERRORS.COMMENT_NOT_FOUND.STATUS_CODE,
        ERRORS.COMMENT_NOT_FOUND.MESSAGE,
      );
    }

    const postId = comment.blogPost;
    const authorId = comment.author.toString();

    if (currentUserId !== authorId) {
      throw createError(
        ERRORS.NOT_COMMENT_AUTHOR.STATUS_CODE,
        ERRORS.NOT_COMMENT_AUTHOR.MESSAGE,
      );
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true, useFindAndModify: false },
    );

    await User.findByIdAndUpdate(
      authorId,
      { $pull: { comments: commentId } },
      { new: true, useFindAndModify: false },
    );

    return NextResponse.json({
      status: 200,
      message: SUCCESS.COMMENT_DELETE,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { PUT, DELETE };
