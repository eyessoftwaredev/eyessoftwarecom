import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfService: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="min-h-screen py-20 sm:py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-yellow-400/20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'tr' ? 'Hizmet Şartları' : 'Terms of Service'}
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '1. Hizmet Kullanımı' : '1. Service Usage'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'EyesSoftware hizmetlerini kullanarak, bu şartları kabul etmiş sayılırsınız. Hizmetlerimizi yasalara uygun ve etik kurallara uygun şekilde kullanmanız gerekmektedir.'
                  : 'By using EyesSoftware services, you agree to these terms. You must use our services in compliance with laws and ethical guidelines.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '2. Fikri Mülkiyet' : '2. Intellectual Property'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Web sitemizdeki tüm içerik, tasarım ve kod EyesSoftware\'in mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.'
                  : 'All content, design, and code on our website is the property of EyesSoftware and protected by copyright laws.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '3. Sorumluluk Reddi' : '3. Disclaimer'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Hizmetlerimiz "olduğu gibi" sunulmaktadır. Belirli bir amaca uygunluk konusunda herhangi bir garanti vermemekteyiz.'
                  : 'Our services are provided "as is". We make no warranties regarding fitness for a particular purpose.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '4. Değişiklikler' : '4. Modifications'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Bu şartları herhangi bir zamanda değiştirme hakkını saklı tutarız. Değişiklikler web sitemizde yayınlandığında yürürlüğe girer.'
                  : 'We reserve the right to modify these terms at any time. Changes take effect when published on our website.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '5. İletişim' : '5. Contact'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Hizmet şartları hakkında sorularınız için: info@eyessoftware.com'
                  : 'For questions about our terms of service: info@eyessoftware.com'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;

