# EyesSoftware - Proje Değişiklikleri

## 🎉 Yapılan Güncellemeler

### 1. **İçerik Değişiklikleri**
- ✅ "AI Destekli" ifadeleri "Özel Yazılım" olarak güncellendi
- ✅ Hero section içeriği yenilendi
- ✅ Hizmetler bölümü güncellendi
- ✅ Hakkımızda bölümü revize edildi

### 2. **Portfolio → Platforms Dönüşümü**
- ✅ Portfolio bölümü kaldırıldı
- ✅ Yeni "Platformlar" bölümü eklendi
- ✅ Çalıştığımız platformlar gösteriliyor:
  - Android Geliştirme
  - iOS Geliştirme
  - Web Geliştirme
  - Veritabanı Yönetimi
  - Sistem Güvenliği
  - Cloud Çözümleri

### 3. **Dinamik Sayfa Sistemi**
- ✅ React Router eklendi
- ✅ Yeni yasal sayfalar oluşturuldu:
  - `/privacy-policy` - Gizlilik Politikası
  - `/terms-of-service` - Hizmet Şartları
  - `/cookie-policy` - Çerez Politikası
- ✅ Footer'a yasal linkler eklendi
- ✅ Çoklu dil desteği (TR/EN) ile sayfalar

### 4. **Görsel Oluşturma Sistemi**
- ✅ AI görsel oluşturma script'i hazırlandı (`scripts/generate_images.py`)
- ✅ fal.ai nano-banana-pro entegrasyonu
- ✅ 7 farklı görsel için prompt'lar hazırlandı
- ✅ Tutarlı stil için base prompt oluşturuldu

## 🚀 Kurulum ve Çalıştırma

### Web Sitesini Çalıştırma
```bash
npm install
npm run dev
```

### Görselleri Oluşturma

1. **Gerekli paketleri yükleyin:**
```bash
cd scripts
pip install -r requirements.txt
```

2. **API Key'inizi ayarlayın:**
```bash
export FAL_KEY="your-fal-api-key-here"
```

3. **Script'i çalıştırın:**
```bash
python generate_images.py
```

Görseller `public/images/generated/` klasörüne kaydedilecek.

## 📁 Proje Yapısı

```
eyessoftware.com/
├── src/
│   ├── components/
│   │   ├── Header.tsx (✨ Router entegrasyonu)
│   │   ├── Footer.tsx (✨ Yasal linkler eklendi)
│   │   ├── Hero.tsx (✨ AI background image desteği)
│   │   ├── Services.tsx
│   │   ├── Platforms.tsx (🆕 YENİ)
│   │   ├── About.tsx (✨ Güncellendi)
│   │   ├── Stats.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── ScrollToTop.tsx
│   ├── pages/ (🆕 YENİ)
│   │   ├── Home.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   └── CookiePolicy.tsx
│   ├── locales/
│   │   ├── tr.json (✨ Güncellendi)
│   │   └── en.json (✨ Güncellendi)
│   └── App.tsx (✨ Router eklendi)
├── scripts/ (🆕 YENİ)
│   ├── generate_images.py
│   ├── requirements.txt
│   └── README.md
└── public/
    └── images/
        └── generated/ (görseller buraya kaydedilecek)
```

## 🎨 Oluşturulacak Görseller

1. **hero-background.png** (16:9, 4K)
   - Abstract technology background
   - Dark blue/black gradient
   - Holographic code snippets
   - Yellow/gold accent lights

2. **hero-background-alt.png** (16:9, 4K)
   - Futuristic digital workspace
   - Circuit board patterns
   - Neural network visualization

3. **about-team.png** (4:3, 2K)
   - Modern software development team
   - Contemporary tech office
   - Collaboration scene

4. **services-web.png** (1:1, 2K)
   - Web development visualization
   - Holographic website interface
   - Responsive design elements

5. **services-mobile.png** (1:1, 2K)
   - Mobile app development
   - iOS and Android mockups
   - Cloud connectivity

6. **platforms-coding.png** (4:3, 2K)
   - Multi-platform development
   - Code editor with syntax highlighting
   - Terminal windows

7. **technology-abstract.png** (16:9, 2K)
   - Abstract tech concept
   - Network visualization
   - Digital transformation

## 🎯 Stil Özellikleri

Tüm görseller için ortak stil:
- ✨ Modern, minimalist tasarım
- 🌑 Karanlık tema (dark background)
- ⭐ Sarı/altın renk vurguları (#fbbf24)
- 💼 Profesyonel ve teknolojik estetik
- 🎬 Sinematik aydınlatma
- 📐 8K çözünürlük, fotorealistik

## 🔗 Yeni Sayfalar

- **Ana Sayfa:** `/`
- **Gizlilik Politikası:** `/privacy-policy`
- **Hizmet Şartları:** `/terms-of-service`
- **Çerez Politikası:** `/cookie-policy`

## 📝 Notlar

- Hero section arka plan görseli AI ile oluşturulduktan sonra otomatik yüklenecek
- Görseller placeholder'ları değiştirecek
- Tüm sayfalar TR/EN çoklu dil destekli
- Responsive tasarım tüm cihazlarda çalışıyor

## 🛠️ Teknolojiler

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Lucide Icons
- fal.ai (görsel oluşturma)

---

**Son Güncelleme:** 22 Aralık 2025

