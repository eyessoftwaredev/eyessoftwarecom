import React from 'react';
import { Smartphone, Monitor, Database, Shield, Cloud, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Platforms: React.FC = () => {
  const { t } = useLanguage();

  const platforms = [
    {
      icon: Smartphone,
      key: 'android',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Smartphone,
      key: 'ios',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Globe,
      key: 'web',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Database,
      key: 'database',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Shield,
      key: 'security',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      icon: Cloud,
      key: 'cloud',
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <section id="platforms" className="py-12 sm:py-16 lg:py-20 relative">
      {/* Background with Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/images/platforms-coding.webp')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            {t('platforms.title')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {platforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/10"
              >
                <div className={`h-2 bg-gradient-to-r ${platform.gradient}`}></div>
                
                <div className="p-6 sm:p-8">
                  <div className="mb-4 sm:mb-6">
                    <div className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r ${platform.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white w-8 sm:w-10 h-8 sm:h-10" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-yellow-400 transition-colors duration-200 leading-tight">
                    {t(`platforms.items.${platform.key}.title`)}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {t(`platforms.items.${platform.key}.description`)}
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

export default Platforms;

