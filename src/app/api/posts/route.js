import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@lib/dbConnect';
import Post from '@models/Post';
import { ERRORS } from 'constants/errors';

export const dynamic = 'force-dynamic';

async function POST(request, response) {
  await dbConnect();

  const successResponse = {
    status: 200,
  };

  const failureResponse = {
    status: 500,
  };

  try {
    const { title, content, author } = await request.json();

    if (!title || !content || !author) {
      throw {
        message: ERRORS.MISSING_PARAMETERS.MESSAGE,
        status: ERRORS.MISSING_PARAMETERS.STATUS_CODE,
      };
    }

    const _id = new mongoose.Types.ObjectId();

    const post = await Post.create({
      _id,
      title,
      author: author,
      content,
    });

    successResponse.data = post;

    return NextResponse.json(successResponse);
  } catch (error) {
    failureResponse.status = error.status;
    failureResponse.message = error.message;
    return NextResponse.json(failureResponse);
  }
}

export { POST };
