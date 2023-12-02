import mongoose from 'mongoose';
import createError from 'http-errors';
import { ERRORS } from 'constants/errors';

export function validateObjectId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError(
      ERRORS.INVALID_MONGO_ID.STATUS_CODE,
      ERRORS.INVALID_MONGO_ID.MESSAGE,
    );
  }
}
