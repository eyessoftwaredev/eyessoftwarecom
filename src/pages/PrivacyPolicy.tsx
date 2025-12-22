import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="min-h-screen py-20 sm:py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-yellow-400/20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '1. Toplanan Bilgiler' : '1. Information Collection'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr' 
                  ? 'EyesSoftware olarak, web sitemizi ziyaret ettiğinizde belirli kişisel bilgilerinizi toplayabiliriz. Bu bilgiler arasında adınız, e-posta adresiniz ve iletişim bilgileriniz yer alabilir.'
                  : 'As EyesSoftware, we may collect certain personal information when you visit our website. This information may include your name, email address, and contact information.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '2. Bilgilerin Kullanımı' : '2. Use of Information'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Topladığımız bilgileri, sizinle iletişim kurmak, hizmetlerimizi geliştirmek ve size özelleştirilmiş deneyimler sunmak için kullanırız.'
                  : 'We use the information we collect to communicate with you, improve our services, and provide you with personalized experiences.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '3. Bilgi Güvenliği' : '3. Information Security'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Kişisel bilgilerinizin güvenliğini ciddiye alıyoruz ve endüstri standartlarında güvenlik önlemleri kullanıyoruz.'
                  : 'We take the security of your personal information seriously and use industry-standard security measures.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '4. Çerezler' : '4. Cookies'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.'
                  : 'Our website uses cookies to enhance user experience. You can manage cookies through your browser settings.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3">
                {language === 'tr' ? '5. İletişim' : '5. Contact'}
              </h2>
              <p className="leading-relaxed">
                {language === 'tr'
                  ? 'Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin: info@eyessoftware.com'
                  : 'If you have questions about our privacy policy, please contact us: info@eyessoftware.com'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;

