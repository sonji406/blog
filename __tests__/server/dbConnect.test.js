import mongoose from 'mongoose';
import dbConnect from '../../lib/dbConnect';
import { ERRORS } from '../../constants/errors';

jest.mock('mongoose');

describe('dbConnect', () => {
  beforeEach(() => {
    global.mongoose = { conn: null, promise: null };
    process.env.MONGODB_URI = 'mocked-uri';
  });

  it('MONGODB_URI가 설정되지 않았을 경우 에러를 발생시켜야 함', async () => {
    delete process.env.MONGODB_URI;
    expect(dbConnect).rejects.toThrow(ERRORS.MONGODB_URI_NOT_FOUND);
  });

  it('아직 데이터베이스에 연결되지 않았다면 연결해야 함', async () => {
    mongoose.connect.mockResolvedValueOnce(mongoose);

    await dbConnect();

    expect(mongoose.connect).toBeCalledWith('mocked-uri', expect.any(Object));
  });

  it('이미 연결된 상태라면 재연결하지 않아야 함', async () => {
    const mockConnection = {};
    global.mongoose = { conn: mockConnection, promise: null };

    const connection = await dbConnect();

    expect(connection).toBe(mockConnection);
    expect(mongoose.connect).not.toBeCalled();
  });

  it('연결 중 오류가 발생할 경우 오류를 처리해야 함', async () => {
    mongoose.connect.mockRejectedValueOnce(new Error('mocked error'));

    await expect(dbConnect()).rejects.toThrow('mocked error');
    expect(global.mongoose.promise).toBeNull();
  });
});
