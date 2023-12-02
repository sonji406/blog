import createError from 'http-errors';
import User from '@models/User';
import { ERRORS } from 'constants/errors';

export async function findUserById(userId) {
  const user = await User.findOne({ _id: userId }).lean().exec();
  if (!user) {
    throw createError(
      ERRORS.USER_NOT_FOUND.STATUS_CODE,
      ERRORS.USER_NOT_FOUND.MESSAGE,
    );
  }
  return user;
}
