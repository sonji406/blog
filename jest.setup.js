import '@testing-library/jest-dom';

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('axios');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/navigation', () => {
  return {
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
  };
});
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { mongoId: 'someId' },
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('@utils/useComment', () => ({
  useComments: jest.fn(),
}));
jest.mock('@utils/usePost', () => ({
  usePost: jest.fn(),
}));
jest.mock('@utils/useUserProfile');
jest.mock('@utils/useImageUpload');
jest.mock('@utils/useNicknameUpdate');
jest.mock('@editorjs/editorjs');
jest.mock('next/legacy/image', () => {
  const MockedImage = ({ src, alt }) => <img src={src} alt={alt} />;
  MockedImage.displayName = 'MockedImage';
  return MockedImage;
});

global.mockPostData = {
  _id: 'testPostId1',
  title: 'Test Title',
  author: {
    $oid: 'testAuthorId',
  },
  content: {
    blocks: [
      {
        id: 'testPostContentId1',
        type: 'image',
        data: {
          file: {
            url: 'https://example.com/test.jpg',
            name: 'test_image.jpeg',
          },
          caption: 'testCaption',
          withBorder: false,
          stretched: false,
          withBackground: false,
        },
      },
      {
        id: 'testPostContentId2',
        type: 'paragraph',
        data: {
          text: 'testParagraphContent',
        },
      },
    ],
  },
  comments: [
    {
      $oid: 'testCommentId1',
    },
    {
      $oid: 'testCommentId2',
    },
  ],
};

global.mockUserData = {
  _id: 'testUserId',
  nickname: 'testUserNickname',
  email: 'test@test.com',
  socialLoginType: 'google',
  profileImage: 'https://example.com/test.jpg',
  blogPosts: ['testBlogId'],
  comments: ['testCommentId'],
};

global.mockCommentData = [
  {
    _id: 'testCommentId1',
    comment: 'testCommentContent1',
    author: {
      _id: 'testCommentAuthorId1',
    },
    blogPost: 'testPostId1',
  },
  {
    _id: 'testCommentId2',
    comment: 'testCommentContent2',
    author: {
      _id: 'testCommentAuthorId2',
    },
    blogPost: 'testPostId2',
  },
];

global.mockProfileData = {
  _id: 'testUserId',
  profileImage: 'https://example.com/test.jpg',
  nickname: 'testUserNickname',
};

global.TextEncoder = require('util').TextEncoder;

global.TextDecoder = require('util').TextDecoder;
