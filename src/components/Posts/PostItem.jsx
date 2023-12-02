import Image from 'next/legacy/image';
import { useState, useEffect } from 'react';

function getRandomColor() {
  const colors = [
    'bg-[#FDEACA]',
    'bg-[#A8C9EA]',
    'bg-[#92DAD9]',
    'bg-[#FFBDBD]',
    'bg-[#F7E2E1]',
    'bg-[#DCE0EB]',
    'bg-[#D1FFD3]',
    'bg-[#F5E8FF]',
    'bg-[#FFFFC4]',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function PostItem({ post }) {
  const [randomColor, setRandomColor] = useState('');

  useEffect(() => {
    setRandomColor(getRandomColor());
  }, []);

  const imageContent = post.content.blocks.find(
    (block) => block.type === 'image',
  );
  const textContent = post.content.blocks.find(
    (block) => block.type === 'paragraph',
  );

  const imageUrl = imageContent ? imageContent.data.file.url : '';
  const title = post.title;
  const textValue = textContent ? textContent.data.text : '';

  return (
    <div className='w-[400x] h-[250px] flex flex-col items-center'>
      <div className='w-[200px] h-[250px] card bg-white transform transition-transform duration-200 hover:scale-105'>
        <div className='w-full h-[170px] relative'>
          {imageUrl ? (
            <Image
              className='object-cover'
              src={imageUrl}
              alt={textValue}
              layout='fill'
            />
          ) : (
            <div className={`w-full h-[170px] ${randomColor}`} />
          )}
        </div>
        <div className='p-4'>
          <div className='text-l font-bold truncate'>{title}</div>{' '}
          <div className='text-sm text-gray-400 mt-2 truncate w-full'>
            {textValue}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PostItem };
