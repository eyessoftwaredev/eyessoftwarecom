import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CookiePolicy: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="min-h-screen py-20 sm:py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-yellow-400/20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '1. Çerez Nedir?' : '1. What are Cookies?'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Çerezler, web sitelerinin kullanıcı cihazlarında sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin düzgün çalışması ve kullanıcı deneyiminin iyileştirilmesi için kullanılır.'
                  : 'Cookies are small text files that websites store on user devices. These files are used to ensure proper website functionality and improve user experience.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '2. Çerez Türleri' : '2. Types of Cookies'}
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {language === 'tr' ? 'Zorunlu Çerezler' : 'Essential Cookies'}
                  </h3>
                  <p className="leading-relaxed">
                    {language === 'tr'
                      ? 'Web sitesinin temel işlevleri için gerekli çerezlerdir.'
                      : 'These cookies are necessary for the basic functions of the website.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {language === 'tr' ? 'Performans Çerezleri' : 'Performance Cookies'}
                  </h3>
                  <p className="leading-relaxed">
                    {language === 'tr'
                      ? 'Web sitesinin performansını analiz etmek için kullanılır.'
                      : 'Used to analyze website performance.'}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '3. Çerez Kontrolü' : '3. Cookie Control'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Tarayıcınızın ayarlarından çerezleri yönetebilir, kabul edebilir veya reddedebilirsiniz.'
                  : 'You can manage, accept, or reject cookies through your browser settings.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '4. İletişim' : '4. Contact'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Çerez politikamız hakkında sorularınız için: info@eyessoftware.com'
                  : 'For questions about our cookie policy: info@eyessoftware.com'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicy;

