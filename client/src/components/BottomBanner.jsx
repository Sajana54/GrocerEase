import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <div className="relative mt-20">
      {/* Desktop Image */}
      <img src={assets.bottom_banner_image} alt="banner" className="w-full h-90 hidden md:block" />

      {/* Mobile Image */}
      <img src={assets.bottom_banner_image_sm} alt="banner" className="w-full block md:hidden" />

      <div className="absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6">
            Why to choose GrocerEase?
          </h1>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 mt-2">
              <img src={feature.icon} alt={feature.title} className="md:w-11 w-9" />
              <div>
                <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-500/70 text-xs md:text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
