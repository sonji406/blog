'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostItem } from './PostItem';
import { postListHref } from '@utils/postListHref';
import { ERRORS } from 'constants/errors';

function PostList({ blogUserId }) {
  const params = useSearchParams();

  const searchValue = params.get('q');
  const page = params.get('page') || 1;
  const limit = params.get('limit') || 10;

  const { data } = useSession();
  const loggedInUserId = data?.mongoId;

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonText, setButtonText] = useState('포스트 작성하기');
  const [error, setError] = useState(null);

  const searchApi = blogUserId
    ? `/api/v1/posts/search/${blogUserId}`
    : '/api/v1/posts/search';
  const postListApi = '/api/v1/posts';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = searchValue
          ? await axios.get(searchApi, {
              params: { q: searchValue, page, limit },
            })
          : await axios.get(postListApi, {
              params: { userId: blogUserId, page, limit },
            });

        if (response.data.status !== 200) {
          setError(response.data.message);
          return;
        }

        setPosts(response.data.data);
        setTotalPosts(response.data.totalPosts);
      } catch (e) {
        setError(ERRORS.POST_LOADING_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [blogUserId, page, limit, searchValue, searchApi]);

  const totalPage = Math.ceil(totalPosts / limit);
  const pageNumbers = [];

  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='px-5 mt-[22px] mx-auto'>
      {error && <div>{error}</div>}
      {isLoading ? (
        <div className='flex justify-center items-center h-[50vh]'>
          로딩 중...
        </div>
      ) : (
        <>
          {searchValue && (
            <div className='block ml-20 mb-10 mt-10'>
              {blogUserId && '이 블로그에서'} {searchValue}(으)로 검색한
              결과입니다
            </div>
          )}
          {posts.length > 0 ? (
            <div className='flex justify-center flex-wrap gap-x-8 gap-y-4'>
              {posts.map((post) => {
                return (
                  <div
                    key={post._id}
                    className='border-solid border-white border-8 shadow-md'
                  >
                    <Link href={`/post/${post.author}/${post._id}`}>
                      <PostItem post={post} />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='flex justify-center items-center h-[50vh]'>
              {searchValue
                ? '검색 결과가 없습니다.'
                : '현재 작성된 포스트가 없습니다.'}
            </div>
          )}

          <div className='flex justify-between items-center mt-4'>
            <div className='flex justify-center flex-grow'>
              {pageNumbers.map((number) => (
                <Link
                  key={number}
                  href={`/posts/${postListHref(
                    blogUserId,
                    searchValue,
                    number,
                    limit,
                  )}`}
                >
                  <button
                    type='button'
                    className='w-10 h-10 m-0.5 text-xl text-white font-bold bg-[#6B99C3] border-2 border-white border-inherit rounded-full hover:bg-[#16354D] hover:text-[#E4E5EA]'
                  >
                    {number}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          <div className='flex justify-end mr-4'>
            <button
              style={{
                minWidth: '200px',
                maxWidth: '300px',
                minHeight: '50px',
                maxHeight: '50px',
              }}
              className={`text-xl font-bold py-2 px-8 ${
                loggedInUserId || buttonText !== '로그인 후 작성 가능'
                  ? 'text-white bg-[#6B99C3] border-4 border-white border-inherit rounded-full hover:bg-[#16354D] hover:text-[#E4E5EA]'
                  : ''
              }`}
              disabled={!loggedInUserId}
              onMouseOver={() => {
                if (!loggedInUserId) {
                  setButtonText('로그인 후 작성 가능');
                }
              }}
              onMouseOut={() => {
                setButtonText('포스트 작성하기');
              }}
            >
              {loggedInUserId ? (
                <Link href={`/post/editor/${loggedInUserId}`}>
                  {buttonText}
                </Link>
              ) : (
                buttonText
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export { PostList };
