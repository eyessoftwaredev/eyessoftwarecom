import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();

  const projects = [
    {
      key: 'ecommerce',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      key: 'banking',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      key: 'healthcare',
      image: 'https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      key: 'realestate',
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      key: 'learning',
      image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    },
    {
      key: 'logistics',
      image: 'https://images.pexels.com/photos/586103/pexels-photo-586103.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    }
  ];

  return (
    <section id="portfolio" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            {t('portfolio.title')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative overflow-hidden h-40 sm:h-48">
                <img
                  src={project.image}
                  alt={t(`portfolio.projects.${project.key}.title`)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex space-x-2">
                    <button className="p-1.5 sm:p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors">
                      <ExternalLink size={14} />
                    </button>
                    <button className="p-1.5 sm:p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors">
                      <Github size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="text-yellow-400 text-xs sm:text-sm font-medium mb-2">
                  {t(`portfolio.projects.${project.key}.category`)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-yellow-400 transition-colors duration-200 leading-tight">
                  {t(`portfolio.projects.${project.key}.title`)}
                </h3>
                <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
                  {t(`portfolio.projects.${project.key}.description`)}
                </p>
                <button className="text-yellow-400 hover:text-yellow-500 font-medium transition-colors duration-200 flex items-center text-sm sm:text-base">
                  {t('portfolio.viewProject')}
                  <ExternalLink className="ml-2 w-3 sm:w-4 h-3 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;