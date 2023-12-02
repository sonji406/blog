import createDOMPurify from 'dompurify';
import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

import Post from '@models/Post';
import User from '@models/User';
import dbConnect from '@lib/dbConnect';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';
import { findById } from '@utils/findById';
import { getLastPartOfUrl } from '@utils/getLastPartOfUrl';
import { getSessionFromRequest } from '@utils/getSessionFromRequest';
import { verifyPostAuthor } from '@utils/verifyPostAuthor';
import { SUCCESS } from 'constants/success';

export const dynamic = 'force-dynamic';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * 블로그 포스트 조회 API
 * @URL /api/v1/post/:postId
 * @param request
 */
async function GET(request) {
  await dbConnect();

  try {
    const postId = getLastPartOfUrl(request.url);
    validateObjectId(postId);

    const post = await findById(Post, postId, ERRORS.POST_NOT_FOUND);

    return NextResponse.json({
      status: 200,
      data: post,
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 블로그 포스트 삭제 API
 * @URL /api/v1/post/:postId
 * @param request
 */
async function DELETE(request) {
  await dbConnect();

  try {
    const postId = getLastPartOfUrl(request.url);
    validateObjectId(postId);

    const session = await getSessionFromRequest(request);
    if (!session) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
    }

    const post = await findById(Post, postId, ERRORS.POST_NOT_FOUND);
    verifyPostAuthor(post, session);

    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new Error(ERRORS.POST_NOT_FOUND.MESSAGE);
    }

    await User.findByIdAndUpdate(post.author, {
      $pull: { blogPosts: post._id },
    });

    return NextResponse.json({
      status: 200,
      data: {
        message: SUCCESS.POST_DELETE,
        post: deletedPost,
      },
    });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

/**
 * 블로그 포스트 수정 API
 * @URL /api/v1/post/:postId
 * @param request
 */
async function PUT(request) {
  await dbConnect();

  try {
    const postId = getLastPartOfUrl(request.url);
    validateObjectId(postId);

    const session = await getSessionFromRequest(request);
    if (!session) {
      throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
    }
    const post = await findById(Post, postId, ERRORS.POST_NOT_FOUND);
    verifyPostAuthor(post, session);

    const parsedData = JSON.parse(await request.text());

    let { title, content } = parsedData;
    title = DOMPurify.sanitize(title);
    if (!content || !content.blocks || !Array.isArray(content.blocks)) {
      throw new Error(ERRORS.MISSING_POST_FIELDS.MESSAGE);
    }

    content.blocks = content.blocks.map((block) => {
      if (block.type === 'paragraph') {
        block.data.text = DOMPurify.sanitize(block.data.text);
      } else if (block.type === 'image') {
        block.data.caption = DOMPurify.sanitize(block.data.caption);
      }
      return block;
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true },
    );

    if (!updatedPost) {
      throw new Error(ERRORS.POST_NOT_FOUND.MESSAGE);
    }

    return NextResponse.json({
      status: 200,
      data: {
        message: SUCCESS.POST_PUT,
        post: updatedPost,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return sendErrorResponse(ERRORS.INVALID_JSON.MESSAGE);
    }
    return sendErrorResponse(error);
  }
}

export { GET, DELETE, PUT };
