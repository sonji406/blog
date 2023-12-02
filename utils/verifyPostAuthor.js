import { ERRORS } from 'constants/errors';

export async function verifyPostAuthor(post, session) {
  if (post.author.toString() !== session.mongoId) {
    throw new Error(ERRORS.NOT_POST_AUTHOR.MESSAGE);
  }
}
