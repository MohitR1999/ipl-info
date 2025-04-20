import { Spinner } from 'flowbite-react';

const Loader = () => {
  return (
    <div className='flex justify-center items-center'>
      <Spinner size='xl' />
    </div>
  )
}

export default Loader;