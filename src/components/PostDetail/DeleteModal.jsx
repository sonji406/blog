function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <h3 className='mb-4'>이 포스트를 삭제하시겠습니까?</h3>
        <div className='flex justify-end'>
          <button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className='bg-red-500 text-white py-2 px-4 rounded mr-2'
          >
            확인
          </button>
          <button onClick={onClose} className='py-2 px-4 rounded'>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
