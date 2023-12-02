function BurgerMenu({ isOpen }) {
  return (
    <div
      className={`w-5 h-5 flex flex-col justify-between ${
        isOpen ? 'open' : ''
      }`}
    >
      <div className='w-full h-[3px] bg-white transition-all transform rounded'></div>
      <div className='w-full h-[3px] bg-white transition-all transform rounded'></div>
      <div className='w-full h-[3px] bg-white transition-all transform rounded'></div>
    </div>
  );
}

export { BurgerMenu };
