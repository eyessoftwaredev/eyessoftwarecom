import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert(t('contact.form.successMessage'));
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute top-10 sm:top-20 right-4 sm:right-20 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-400/15 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-yellow-400/20">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="text-yellow-400 w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">{t('contact.info.email')}</h4>
                  <p className="text-gray-300 text-sm sm:text-base">info@eyessoftware.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="text-yellow-400 w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">{t('contact.info.phone')}</h4>
                  <p className="text-gray-300 text-sm sm:text-base">+971 58 507 6870</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-yellow-400 w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">{t('contact.info.location')}</h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Building A1, Dubai Digital Park, Dubai Silicon Oasis,<br />
                    P.O. Box Number: 342001,<br />
                    Dubai, United Arab Emirates
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-yellow-400/20">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-yellow-400/20 rounded-full"></div>
                <div className="h-2 bg-yellow-400/40 rounded-full"></div>
                <div className="h-2 bg-yellow-400/20 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-yellow-400/20">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 text-sm sm:text-base"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2 text-sm sm:text-base">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 sm:py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25 flex items-center justify-center group text-sm sm:text-base"
              >
                {t('contact.form.submit')}
                <Send className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;