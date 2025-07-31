/*

import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
    const { navigate } = useAppContext();

    return (
        <div className='mt-16'>
            <p className='text-2xl md:text-3xl font-medium'>Categories</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center'
                        style={{ backgroundColor: category.bgColor }}
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`);
                            scrollTo(0, 0);
                        }}
                    >
                        <img
                            src={category.image}
                            alt={category.text}
                            className='group-hover:scale-105 transition w-28 h-28 object-contain'
                        />
                        <p className='text-sm font-medium text-center'>{category.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
*/


import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
    const { navigate } = useAppContext();

    return (
<div className='mt-16'>
    <p className='text-2xl md:text-3xl font-semibold text-gray-800'>Categories</p>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
        {categories.map((category, index) => (
            <div
                key={index}
                className='group cursor-pointer py-6 px-4 rounded-2xl flex flex-col justify-center items-center transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 relative overflow-hidden'
                style={{ backgroundColor: category.bgColor }}
                onClick={() => {
                    navigate(`/products/${category.path.toLowerCase()}`);
                    scrollTo(0, 0);
                }}
            >
                {/* Optional Gradient Overlay for uniqueness */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-2xl' />

                <img
                    src={category.image}
                    alt={category.text}
                    className='group-hover:scale-110 transition-transform duration-300 w-30 h-30 object-contain z-8'
                />
                <p className='text-sm font-medium text-center text-gray-700 mt-3 z-10'>{category.text}</p>
            </div>
        ))}
    </div>
</div>
);
};

export default Categories;