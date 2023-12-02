import { ERRORS } from '../constants/errors';
import { getSessionFromRequest } from './getSessionFromRequest';
import { validateObjectId } from './validateObjectId';

export async function isLoggedInUser(request, userId) {
  validateObjectId(userId);

  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new Error(ERRORS.USER_NOT_LOGGED_IN.MESSAGE);
  }

  if (session.mongoId !== userId) {
    throw new Error(ERRORS.UNAUTHORIZED_USER.MESSAGE);
  }

  return true;
}
