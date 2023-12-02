import Image from 'next/legacy/image';

function PostContent({ title, content }) {
  return (
    <div className='bg-white rounded-lg p-8 mx-auto max-w-3xl'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold'>제목</h2>
        <p className='text-lg mt-2'>{title}</p>
      </div>
      <div className='border-2 border-gray-300 p-8 rounded-lg mb-8'>
        {' '}
        {content.blocks.map((item) => {
          if (item.type === 'image') {
            return (
              <div key={item.id} className='my-4 text-center'>
                <img
                  src={item.data.file.url}
                  alt={item.data.file.name}
                  style={{ margin: 'auto', display: 'block' }}
                />
                <p className='text-sm italic text-gray-600 mt-2'>
                  {item.data.caption}
                </p>
              </div>
            );
          }
          if (item.type === 'paragraph') {
            return (
              <p key={item.id} className='mb-4'>
                {item.data.text}
              </p>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default PostContent;
