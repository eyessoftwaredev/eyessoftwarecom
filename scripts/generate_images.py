"""
EyesSoftware - Image Generator Script
Bu script fal.ai nano-banana-pro API kullanarak web sitesi için görseller oluşturur.

Kullanım:
1. pip install fal-client
2. export FAL_KEY="YOUR_API_KEY" veya .env dosyasına ekleyin
3. python generate_images.py
"""

import fal_client
import os
import requests
from pathlib import Path

# API Key kontrolü
# Seçenek 1: Direkt buraya API key'ini yapıştır
FAL_KEY = "YOUR_API_KEY_HERE"  # Buraya API key'ini yapıştır

# Seçenek 2: Environment variable kullan (PowerShell: $env:FAL_KEY="key")
if FAL_KEY == "YOUR_API_KEY_HERE":
    FAL_KEY = os.getenv("FAL_KEY", "")
    if not FAL_KEY:
        print("⚠️  UYARI: FAL_KEY ayarlanmamış!")
        print("\nİki seçenek:")
        print("1. Script içinde: FAL_KEY = 'your-api-key' (satır 18)")
        print("2. PowerShell: $env:FAL_KEY='your-api-key'")
        exit(1)

# Çıktı klasörünü oluştur
output_dir = Path("../public/images")
output_dir.mkdir(parents=True, exist_ok=True)

# Ana stil prompt'u - tüm görsellerde kullanılacak
BASE_STYLE = """
Professional, modern, minimalist design. 
High-quality, cinematic lighting, soft gradients.
Dark background with accent colors (yellow, gold highlights).
Tech and software development theme.
Clean, elegant composition.
8K resolution, ultra realistic, photorealistic.
"""

# Görsel prompt'ları
IMAGES = {
    "hero_background": {
        "prompt": f"""
        Epic cinematic technology background for hero section.
        Abstract digital landscape with flowing data streams and light particles.
        Dark space with dramatic yellow and gold light rays piercing through.
        Futuristic tech environment, neural networks, circuit board patterns.
        Sense of innovation, digital transformation, and cutting-edge technology.
        Dramatic lighting, depth of field, epic scale.
        Cyberpunk aesthetic meets professional corporate design.
        Wide cinematic composition, visually stunning.
        {BASE_STYLE}
        """,
        "aspect_ratio": "16:9",
        "resolution": "4K",
        "filename": "hero-background.webp"
    },
    
    "hero_background_alt": {
        "prompt": f"""
        Futuristic digital workspace background.
        Abstract representation of software development.
        Dark ambient scene with glowing yellow/gold circuit board patterns.
        Depth of field, bokeh effect with tech elements.
        Neural network visualization, data streams.
        Professional and modern aesthetic.
        {BASE_STYLE}
        """,
        "aspect_ratio": "16:9",
        "resolution": "4K",
        "filename": "hero-background-alt.webp"
    },
    
    "about_team": {
        "prompt": f"""
        Modern dark tech office interior with illuminated wall sign.
        Large LED neon sign on the wall displaying the text "EyesSoftware" in clean, modern typography.
        The sign glows with yellow and gold LED lights against a dark wall.
        Professional corporate office setting, sleek and sophisticated.
        Computer workstations visible in the background with ambient lighting.
        The "EyesSoftware" text is clearly readable and prominently displayed.
        Dark moody atmosphere, professional tech company aesthetic.
        Focus on the glowing LED sign with the company name.
        Wide angle shot showing the branded wall as a focal point.
        {BASE_STYLE}
        """,
        "aspect_ratio": "4:3",
        "resolution": "2K",
        "filename": "about-team.webp"
    },
    
    "about_branding": {
        "prompt": f"""
        Close-up of illuminated "EyesSoftware" LED neon sign on dark office wall.
        The text "EyesSoftware" glowing in yellow and gold neon lights.
        Modern typography, clean and professional lettering.
        Dark background wall, corporate office environment.
        The company name is the main focal point, clearly visible and readable.
        Warm yellow/gold glow from the LED letters.
        Professional tech startup aesthetic.
        Detailed view of the branded signage.
        {BASE_STYLE}
        """,
        "aspect_ratio": "4:3",
        "resolution": "2K",
        "filename": "about-branding.webp"
    },
    
    "services_web": {
        "prompt": f"""
        Abstract web development concept visualization.
        Holographic website interface floating in dark space.
        Responsive design elements, mobile and desktop screens.
        Yellow and gold accent highlights on interactive elements.
        Clean code snippets visible in the background.
        Professional, modern tech aesthetic.
        {BASE_STYLE}
        """,
        "aspect_ratio": "1:1",
        "resolution": "2K",
        "filename": "services-web.webp"
    },
    
    "services_mobile": {
        "prompt": f"""
        Mobile app development visualization.
        Floating smartphone with glowing app interface.
        iOS and Android device mockups in dark space.
        Modern UI elements with yellow/gold highlights.
        Cloud connectivity, API integrations visualization.
        Professional and sleek design.
        {BASE_STYLE}
        """,
        "aspect_ratio": "1:1",
        "resolution": "2K",
        "filename": "services-mobile.webp"
    },
    
    "platforms_coding": {
        "prompt": f"""
        Multi-platform development environment.
        Multiple screens showing different platforms (Android, iOS, Web).
        Code editor with colorful syntax highlighting.
        Terminal windows, version control interface.
        Dark theme IDE with yellow/gold accent colors.
        Professional developer workspace.
        {BASE_STYLE}
        """,
        "aspect_ratio": "4:3",
        "resolution": "2K",
        "filename": "platforms-coding.webp"
    },
    
    "technology_abstract": {
        "prompt": f"""
        Abstract technology and innovation concept.
        Interconnected nodes, network visualization.
        Data flow, digital transformation representation.
        Dark background with glowing yellow/gold pathways.
        Futuristic, clean, professional aesthetic.
        Depth and dimension in the composition.
        {BASE_STYLE}
        """,
        "aspect_ratio": "16:9",
        "resolution": "2K",
        "filename": "technology-abstract.webp"
    }
}

def download_image(url, filepath):
    """Görseli indir ve kaydet"""
    try:
        print(f"   📥 İndiriliyor: {url}")
        print(f"   💾 Kaydedilecek yer: {filepath}")
        
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        file_size = filepath.stat().st_size / 1024  # KB
        print(f"   ✅ Kaydedildi: {filepath} ({file_size:.1f} KB)")
        return True
    except Exception as e:
        print(f"   ❌ İndirme hatası: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_image(name, config):
    """Tek bir görsel oluştur"""
    print(f"\n{'='*60}")
    print(f"🎨 Oluşturuluyor: {name}")
    print(f"📝 Aspect Ratio: {config.get('aspect_ratio')}")
    print(f"📐 Resolution: {config.get('resolution')}")
    print(f"📄 Dosya adı: {config['filename']}")
    print(f"{'='*60}")
    
    try:
        def on_queue_update(update):
            if isinstance(update, fal_client.InProgress):
                for log in update.logs:
                    print(f"   ⏳ {log['message']}")
        
        print("   🚀 API'ye istek gönderiliyor...")
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": config["prompt"].strip(),
                "num_images": 1,
                "aspect_ratio": config.get("aspect_ratio", "16:9"),
                "output_format": "webp",
                "resolution": config.get("resolution", "2K"),
                "sync_mode": False
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        print(f"   📦 Response alındı: {type(result)}")
        
        if result and "images" in result and len(result["images"]) > 0:
            image_url = result["images"][0]["url"]
            print(f"   🌐 Görsel URL'si: {image_url}")
            
            # Görseli indir
            filepath = output_dir / config["filename"]
            if download_image(image_url, filepath):
                print(f"   ✨ {name} başarıyla oluşturuldu!\n")
                return True
        else:
            print(f"   ❌ Response'ta görsel bulunamadı")
            print(f"   📋 Response: {result}")
            return False
            
    except Exception as e:
        print(f"   ❌ Hata ({name}): {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("🎨 EyesSoftware - Görsel Oluşturucu")
    print("=" * 60)
    print(f"📁 Çıktı klasörü: {output_dir}")
    print(f"🖼️  Toplam {len(IMAGES)} görsel oluşturulacak\n")
    
    # Kullanıcıdan onay al
    response = input("Devam etmek istiyor musunuz? (e/h): ").lower()
    if response != 'e':
        print("❌ İşlem iptal edildi.")
        return
    
    success_count = 0
    fail_count = 0
    
    for name, config in IMAGES.items():
        if generate_image(name, config):
            success_count += 1
        else:
            fail_count += 1
        
        # Rate limiting için kısa bekleme
        import time
        time.sleep(2)
    
    print("\n" + "=" * 60)
    print("📊 ÖZET")
    print("=" * 60)
    print(f"✅ Başarılı: {success_count}")
    print(f"❌ Başarısız: {fail_count}")
    print(f"📁 Görseller: {output_dir}")
    print("=" * 60)

if __name__ == "__main__":
    main()

