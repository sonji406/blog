import { METAINFO } from 'constants/metaInfo';
import { generateMetadata as generateMetadataForUser } from '@src/app/posts/[[...userId]]/page';
import { generateMetadata as generateMetadataForPost } from '@src/app/post/[userId]/[postId]/page';
import axios from 'axios';

const mockAxiosSuccess = (data) => {
  axios.mockResolvedValueOnce({ data: { data } });
};

const mockAxiosFailure = () => {
  axios.mockRejectedValueOnce(new Error('API Error'));
};

describe('generateMetadata for User', () => {
  it('유효한 사용자 ID에 대한 올바른 메타데이터가 생성되어야 한다.', async () => {
    mockAxiosSuccess({
      nickname: 'testUserNickname',
      blogPosts: ['post1', 'post2'],
    });

    const metadata = await generateMetadataForUser({
      params: { userId: ['testUserId'] },
    });

    expect(metadata).toEqual({
      title: 'testUserNickname',
      description: 'testUserNickname님의 블로그입니다. 포스트 수 2',
    });
  });

  it('에러 발생 시에는 기본 메타 데이터를 사용해야 한다.', async () => {
    mockAxiosFailure();

    const metadata = await generateMetadataForUser({
      params: { userId: ['testUserId'] },
    });

    expect(metadata).toEqual({
      title: METAINFO.BLOG_HOME.TITLE,
      description: METAINFO.BLOG_HOME.DESCRIPTION,
    });
  });
});

describe('generateMetadata for Post', () => {
  it('유효한 포스트 ID에 대한 올바른 메타데이터가 생성되어야 한다.', async () => {
    mockAxiosSuccess({
      title: 'testPostTitle',
      content: {
        blocks: [{ type: 'text', data: { text: 'testPostContent' } }],
      },
    });

    const metadata = await generateMetadataForPost({
      params: { postId: 'testPostId' },
    });

    expect(metadata).toEqual({
      title: 'testPostTitle',
      description: 'testPostContent',
    });
  });

  it('에러 발생 시에는 기본 메타 데이터를 사용해야 한다.', async () => {
    mockAxiosFailure();

    const metadata = await generateMetadataForPost({
      params: { postId: 'testPostId' },
    });

    expect(metadata).toEqual({
      title: METAINFO.POST_DETAIL.TITLE,
      description: METAINFO.POST_DETAIL.DESCRIPTION,
    });
  });
});
