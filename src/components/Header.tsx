import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'services', href: '/#services' },
    { key: 'platforms', href: '/#platforms' },
    { key: 'about', href: '/#about' },
    { key: 'contact', href: '/#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/20 backdrop-blur-md border-b border-yellow-400/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-white">
              <span className="text-yellow-400">Eyes</span>Software
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.key === 'home') {
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="text-white hover:text-yellow-400 transition-colors duration-200"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                );
              }
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className="text-white hover:text-yellow-400 transition-colors duration-200"
                >
                  {t(`nav.${item.key}`)}
                </a>
              );
            })}
          </nav>

          {/* Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center space-x-1 ${
                  language === 'en'
                    ? 'bg-yellow-400 text-black'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                <ReactCountryFlag countryCode="GB" svg style={{ width: '16px', height: '12px' }} />
                <span className="hidden sm:inline">EN</span>
              </button>
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center space-x-1 ${
                  language === 'tr'
                    ? 'bg-yellow-400 text-black'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                <ReactCountryFlag countryCode="TR" svg style={{ width: '16px', height: '12px' }} />
                <span className="hidden sm:inline">TR</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-yellow-400 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 pb-4">
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-yellow-400/20 mx-2">
              {navItems.map((item) => {
                if (item.key === 'home') {
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-white hover:text-yellow-400 transition-colors duration-200 py-3 text-lg font-medium border-b border-white/10 last:border-b-0"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-yellow-400 transition-colors duration-200 py-3 text-lg font-medium border-b border-white/10 last:border-b-0"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;