"""
Sadece eksik görselleri oluşturan script
"""

import fal_client
import os
import requests
from pathlib import Path

# API Key
FAL_KEY = "YOUR_API_KEY_HERE"

if FAL_KEY == "YOUR_API_KEY_HERE":
    FAL_KEY = os.getenv("FAL_KEY", "")
    if not FAL_KEY:
        print("⚠️  API KEY gerekli!")
        exit(1)

output_dir = Path("../public/images")
output_dir.mkdir(parents=True, exist_ok=True)

BASE_STYLE = """
Professional, modern, minimalist design. 
High-quality, cinematic lighting, soft gradients.
Dark background with accent colors (yellow, gold highlights).
Tech and software development theme.
Clean, elegant composition.
8K resolution, ultra realistic, photorealistic.
"""

IMAGES = {
    "hero_background_new": {
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
        "filename": "hero-background-new.webp"
    },
    
    "about_branding": {
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
        "filename": "about-eyessoftware.webp"
    }
}

def download_image(url, filepath):
    try:
        print(f"   📥 İndiriliyor...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        size = filepath.stat().st_size / 1024
        print(f"   ✅ Kaydedildi: {filepath.name} ({size:.1f} KB)")
        return True
    except Exception as e:
        print(f"   ❌ Hata: {e}")
        return False

def generate_image(name, config):
    print(f"\n{'='*60}")
    print(f"🎨 Oluşturuluyor: {name}")
    print(f"📄 {config['filename']}")
    print(f"{'='*60}")
    
    try:
        def on_queue_update(update):
            if isinstance(update, fal_client.InProgress):
                for log in update.logs:
                    print(f"   ⏳ {log['message']}")
        
        result = fal_client.subscribe(
            "fal-ai/nano-banana-pro",
            arguments={
                "prompt": config["prompt"].strip(),
                "num_images": 1,
                "aspect_ratio": config["aspect_ratio"],
                "output_format": "webp",
                "resolution": config["resolution"],
                "sync_mode": False
            },
            with_logs=True,
            on_queue_update=on_queue_update,
        )
        
        if result and "images" in result and len(result["images"]) > 0:
            url = result["images"][0]["url"]
            filepath = output_dir / config["filename"]
            if download_image(url, filepath):
                print(f"   ✨ Başarılı!\n")
                return True
        return False
    except Exception as e:
        print(f"   ❌ Hata: {e}")
        return False

print("=" * 60)
print("🎨 Eksik Görseller Oluşturuluyor")
print("=" * 60)
print(f"📁 Klasör: {output_dir}\n")

success = 0
for name, config in IMAGES.items():
    if generate_image(name, config):
        success += 1
    import time
    time.sleep(2)

print("\n" + "=" * 60)
print(f"✅ {success}/{len(IMAGES)} görsel oluşturuldu")
print("=" * 60)
print("\n📝 Sonraki Adımlar:")
print("1. hero-background-new.webp -> hero-background.webp olarak yeniden adlandır")
print("2. About.tsx'i about-eyessoftware.webp kullanacak şekilde güncelle")

