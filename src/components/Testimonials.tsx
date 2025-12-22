import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      key: 'sarah',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      key: 'michael',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      key: 'elena',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-black/60">
        <div className="absolute top-5 sm:top-10 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            {t('testimonials.title')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105 relative group"
            >
              <Quote className="text-yellow-400/60 w-6 sm:w-8 h-6 sm:h-8 mb-3 sm:mb-4" />
              
              {/* Stars */}
              <div className="flex space-x-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base">
                "{t(`testimonials.items.${testimonial.key}.comment`)}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={t(`testimonials.items.${testimonial.key}.name`)}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 border-2 border-yellow-400/30 flex-shrink-0"
                />
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-tight">{t(`testimonials.items.${testimonial.key}.name`)}</h4>
                  <p className="text-yellow-400 text-xs sm:text-sm">{t(`testimonials.items.${testimonial.key}.role`)}</p>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-yellow-400/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;