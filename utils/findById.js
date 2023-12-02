import createError from 'http-errors';

export async function findById(schema, id, error) {
  const result = await schema.findOne({ _id: id }).lean().exec();
  if (!result) {
    throw createError(error.STATUS_CODE, error.MESSAGE);
  }
  return result;
}
