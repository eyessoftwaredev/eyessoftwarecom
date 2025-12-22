import React from 'react';
import { Monitor, Smartphone, Cog, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Services: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Monitor,
      titleKey: 'website.title',
      descriptionKey: 'website.description',
      image: '/images/services-web.webp'
    },
    {
      icon: Smartphone,
      titleKey: 'mobile.title',
      descriptionKey: 'mobile.description',
      image: '/images/services-mobile.webp'
    },
    {
      icon: Cog,
      titleKey: 'software.title',
      descriptionKey: 'software.description',
      image: '/images/technology-abstract.webp'
    },
    {
      icon: Palette,
      titleKey: 'uiux.title',
      descriptionKey: 'uiux.description',
      image: '/images/platforms-coding.webp'
    }
  ];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute top-20 sm:top-40 right-4 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                {/* Background Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={t(`services.items.${service.titleKey}`)}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                  <div className="absolute bottom-2 left-4">
                    <div className="w-12 sm:w-14 h-12 sm:h-14 bg-yellow-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300">
                      <IconComponent className="text-yellow-400 w-6 sm:w-7 h-6 sm:h-7" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-400 transition-colors duration-200 leading-tight">
                    {t(`services.items.${service.titleKey}`)}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {t(`services.items.${service.descriptionKey}`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;