import React from 'react';
import { Award, Target, Users, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute bottom-10 sm:bottom-20 left-4 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-yellow-400/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              {t('about.title')}
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {t('about.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="text-yellow-400 w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">{t('about.features.quality')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="text-yellow-400 w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">{t('about.features.goal')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="text-yellow-400 w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">{t('about.features.client')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-yellow-400 w-4 sm:w-5 h-4 sm:h-5" />
                </div>
                <span className="text-white font-medium text-sm sm:text-base">{t('about.features.fast')}</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-yellow-400/20">
              <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src="/images/about-eyessoftware.webp"
                  alt="EyesSoftware Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/60"></div>
                
                {/* Floating elements */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 sm:w-12 h-8 sm:h-12 bg-yellow-400/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 sm:bottom-8 left-3 sm:left-6 w-10 sm:w-16 h-10 sm:h-16 bg-white/20 rounded-full backdrop-blur-sm"></div>
                
                {/* Brand Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-400/30">
                  <div className="text-white font-bold text-sm sm:text-base">
                    <span className="text-yellow-400">Eyes</span>Software
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;