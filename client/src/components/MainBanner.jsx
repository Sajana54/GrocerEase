import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <div className='relative min-h-[60vh] mt-13'>
      {/* Background Images */}
      <img src={assets.main_banner_bg} alt="banner" className='w-full h-100 hidden md:block' />
      <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden' />

      {/* Banner Text and Buttons */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end md:justify-center items-start px-6 md:px-16 pb-8 text-left">
        {/* English Text */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
          From Haat to Home!
        </h1>

        {/* Nepali Text */}
        <h2 className="text-lg sm:text-2xl font-medium text-gray-800 mb-6">
          सजिलो छिटो भरपर्दो
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/products" className='group flex items-center gap-2 px-7 py-3 bg-[#4fbf8b] hover:bg-[#44ae7c] transition rounded text-white'>
            Shop Now
            <img className='transition group-hover:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
          </Link>

          <Link to="/products" className='group flex items-center gap-2 px-7 py-3 bg-white text-[#4fbf8b] hover:bg-gray-100 transition rounded font-medium'>
            Explore Deals
            <img className='transition group-hover:translate-x-1' src={assets.black_arrow_icon} alt="arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
