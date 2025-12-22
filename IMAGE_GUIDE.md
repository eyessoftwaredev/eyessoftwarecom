# 🎨 Görsel Kullanım Rehberi

## ✅ Kullanılan Görseller

Tüm görseller AI ile oluşturuldu ve aşağıdaki bileşenlerde kullanılıyor:

### 1. **Hero Section** (`src/components/Hero.tsx`)
- **Görsel:** `/images/hero-background.webp`
- **Kullanım:** Arka plan görseli (opacity: 0.4)
- **Format:** WebP, 16:9, 4K

### 2. **About Section** (`src/components/About.tsx`)
- **Görsel:** `/images/about-team.webp`
- **Kullanım:** Ekip çalışma görseli
- **Format:** WebP, 4:3, 2K

### 3. **Services Section** (`src/components/Services.tsx`)
Her servis kartında farklı görsel:
- **Web Development:** `/images/services-web.webp` (1:1, 2K)
- **Mobile Development:** `/images/services-mobile.webp` (1:1, 2K)
- **Custom Software:** `/images/technology-abstract.webp` (16:9, 2K)
- **UI/UX Design:** `/images/platforms-coding.webp` (4:3, 2K)

### 4. **Platforms Section** (`src/components/Platforms.tsx`)
- **Görsel:** `/images/platforms-coding.webp`
- **Kullanım:** Arka plan görseli (opacity: 0.2)
- **Format:** WebP, 4:3, 2K

## 📂 Dosya Yapısı

```
public/
└── images/
    ├── hero-background.webp
    ├── hero-background-alt.webp
    ├── about-team.webp
    ├── services-web.webp
    ├── services-mobile.webp
    ├── platforms-coding.webp
    └── technology-abstract.webp
```

## 🎯 Görsel Özellikleri

Tüm görseller:
- ✅ WebP formatında (optimize edilmiş)
- ✅ Dark tema (karanlık arka plan)
- ✅ Sarı/altın renk vurguları
- ✅ Profesyonel ve modern estetik
- ✅ Teknoloji temalı

## 🔄 Yeni Görsel Oluşturma

Yeni görseller oluşturmak için:

```bash
cd scripts
python generate_images.py
```

Script otomatik olarak `public/images/` klasörüne kaydeder.

## 🚀 Optimizasyon

WebP formatı kullanıldığı için:
- ✅ PNG'ye göre %30-50 daha küçük dosya boyutu
- ✅ Hızlı yükleme süreleri
- ✅ Tüm modern tarayıcılarda destekleniyor

## 📝 Notlar

- Görseller direkt `/images/` path'i ile yükleniyor
- Hero ve Platforms'ta opacity kullanılarak background effect oluşturuluyor
- Services'ta her kart kendi görseline sahip
- Tüm görseller responsive ve optimize edilmiş

