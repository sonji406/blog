import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import createError from 'http-errors';
import { NextResponse } from 'next/server';

import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import User from '@models/User';
import { ERRORS } from 'constants/errors';
import { sendErrorResponse } from '@utils/response';
import { validateObjectId } from '@utils/validateObjectId';

export const dynamic = 'force-dynamic';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * 포스트 생성 API
 * @URL /api/v1/post
 * @param request
 */
async function POST(request) {
  await dbConnect();

  try {
    const parsedData = await request.json();
    let { title, content, author } = parsedData;

    title = DOMPurify.sanitize(title);
    author = DOMPurify.sanitize(author);

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

    if (!title || !content || !author) {
      throw createError(
        ERRORS.MISSING_PARAMETERS.STATUS_CODE,
        ERRORS.MISSING_PARAMETERS.MESSAGE,
      );
    }

    validateObjectId(author);

    const post = await Post.create({
      title,
      author,
      content,
    });

    await User.findByIdAndUpdate(author, {
      $push: { blogPosts: post._id },
    });

    return NextResponse.json({ status: 200, data: post });
  } catch (error) {
    return sendErrorResponse(error);
  }
}

export { POST };
