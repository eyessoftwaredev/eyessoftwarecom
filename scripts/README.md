# Image Generator Script

Bu script fal.ai nano-banana-pro API kullanarak EyesSoftware web sitesi için görseller oluşturur.

## Kurulum

1. Python paketini yükleyin:
```bash
pip install fal-client requests
```

2. API Key'inizi ayarlayın:

**Seçenek 1: Direkt script içinde (Önerilen)**

`generate_images.py` dosyasının 18. satırını düzenleyin:
```python
FAL_KEY = "buraya-api-keyinizi-yapiştirin"
```

**Seçenek 2: PowerShell Environment Variable**
```powershell
$env:FAL_KEY="your-fal-api-key-here"
```

**Seçenek 3: Linux/Mac**
```bash
export FAL_KEY="your-fal-api-key-here"
```

## Kullanım

```bash
cd scripts
python generate_images.py
```

## Oluşturulacak Görseller

1. **hero-background.png** (16:9, 4K) - Ana sayfa hero section arkaplanı
2. **hero-background-alt.png** (16:9, 4K) - Alternatif hero arkaplanı
3. **about-team.png** (4:3, 2K) - Hakkımızda bölümü için ekip görseli
4. **services-web.png** (1:1, 2K) - Web geliştirme servisi görseli
5. **services-mobile.png** (1:1, 2K) - Mobil uygulama servisi görseli
6. **platforms-coding.png** (4:3, 2K) - Platform görseli
7. **technology-abstract.png** (16:9, 2K) - Teknoloji konsept görseli

## Stil Özellikleri

Tüm görseller şu stil özelliklerine sahip:
- Modern, minimalist tasarım
- Karanlık arka plan (dark theme)
- Sarı/altın renk vurguları
- Profesyonel ve teknolojik estetik
- Yüksek kalite, sinematik aydınlatma
- 8K çözünürlük, fotorealistik

## Çıktı

Görseller `../public/images/generated/` klasörüne kaydedilir.

