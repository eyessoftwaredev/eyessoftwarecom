import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const socialLinks = [
    { icon: Github, href: '#', labelKey: 'github' },
    { icon: Linkedin, href: '#', labelKey: 'linkedin' },
    { icon: Twitter, href: '#', labelKey: 'twitter' },
    { icon: Mail, href: 'mailto:info@eyessoftware.com', labelKey: 'email' }
  ];

  const quickLinks = [
    { key: 'services', href: '/#services', isHash: true },
    { key: 'platforms', href: '/#platforms', isHash: true },
    { key: 'about', href: '/#about', isHash: true },
    { key: 'contact', href: '/#contact', isHash: true }
  ];

  const legalLinks = [
    { key: 'privacyPolicy', href: '/privacy-policy' },
    { key: 'termsOfService', href: '/terms-of-service' },
    { key: 'cookiePolicy', href: '/cookie-policy' }
  ];

  return (
    <footer className="py-8 sm:py-12 relative border-t border-yellow-400/20">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900 to-black">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 sm:w-96 h-24 sm:h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="inline-block">
              <div className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                <span className="text-yellow-400">Eyes</span>Software
              </div>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              {t('footer.description')}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 sm:w-10 h-8 sm:h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/20 transition-all duration-200"
                    aria-label={t(`footer.social.${social.labelKey}`)}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  {link.isHash ? (
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm sm:text-base"
                    >
                      {t(`nav.${link.key}`)}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm sm:text-base"
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.legalLinks')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {t(`footer.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Language & Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.language')}</h4>
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1 mb-4 sm:mb-6 w-fit">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center space-x-1 ${
                  language === 'en'
                    ? 'bg-yellow-400 text-black'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                <ReactCountryFlag countryCode="GB" svg style={{ width: '14px', height: '10px' }} />
                <span>EN</span>
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center space-x-1 ${
                  language === 'tr'
                    ? 'bg-yellow-400 text-black'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                <ReactCountryFlag countryCode="TR" svg style={{ width: '14px', height: '10px' }} />
                <span>TR</span>
              </button>
            </div>

            <div className="text-gray-300 text-sm sm:text-base">
              <p className="mb-1 sm:mb-2">info@eyessoftware.com</p>
              <p className="mb-1 sm:mb-2">+971 58 507 6870</p>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                Building A1, Dubai Digital Park,<br />
                Dubai Silicon Oasis, Dubai, UAE
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-yellow-400/20 text-center">
          <p className="text-gray-300 text-sm sm:text-base">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;