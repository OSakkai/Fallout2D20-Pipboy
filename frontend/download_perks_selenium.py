#!/usr/bin/env python3
"""
Script alternativo usando Selenium para baixar perks do Fallout 2d20
Usa navegador automatizado para contornar proteções anti-bot
"""

import os
import time
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import requests

# Configurações
OUTPUT_DIR = Path("public/assets/images/perks-2d20")
CATEGORY_URL = "https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images"


def sanitize_filename(name):
    """Converte nome do perk para snake_case"""
    name = name.replace("'", "").replace("!", "").replace(".", "")
    name = name.replace(" ", "_").replace("/", "_")
    # Remove prefixo 2D20_ se existir
    if name.startswith("2D20_"):
        name = name[5:]
    return name.lower()


def setup_driver():
    """Configura o Chrome driver"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Roda sem abrir janela
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"❌ Erro ao iniciar Chrome driver: {e}")
        print("\n💡 SOLUÇÃO:")
        print("   1. Instale o ChromeDriver: https://chromedriver.chromium.org/")
        print("   2. Ou use: pip install webdriver-manager")
        print("   3. Depois rode: python download_perks_selenium.py")
        return None


def get_image_links(driver):
    """Extrai todos os links de imagens da categoria"""
    print("🌐 Acessando página da categoria...")

    driver.get(CATEGORY_URL)
    time.sleep(3)  # Aguarda carregamento

    # Encontra todas as imagens da galeria
    images = []

    try:
        # Aguarda a galeria carregar
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "category-page__member-thumbnail"))
        )

        # Extrai links das thumbnails
        thumbnails = driver.find_elements(By.CLASS_NAME, "category-page__member-link")

        for thumb in thumbnails:
            img_element = thumb.find_element(By.TAG_NAME, "img")
            img_url = img_element.get_attribute("src")

            # Pega versão em alta resolução (remove /scale-to-width-down/)
            if "scale-to-width-down" in img_url:
                # Extrai URL original
                parts = img_url.split("/revision/")
                if len(parts) > 1:
                    base_url = parts[0].replace("/scale-to-width-down/185", "")
                    img_url = f"{base_url}/revision/latest"

            # Nome do arquivo
            img_name = img_element.get_attribute("alt") or thumb.get_attribute("title")

            if img_name and img_url:
                images.append({
                    'name': img_name.replace("File:", "").replace(".png", ""),
                    'url': img_url
                })

        print(f"✅ Encontradas {len(images)} imagens")
        return images

    except Exception as e:
        print(f"❌ Erro ao extrair links: {e}")
        return []


def download_image(url, output_path):
    """Baixa a imagem"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://fallout.fandom.com/'
    }

    try:
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        file_size = output_path.stat().st_size / 1024
        return True, file_size

    except Exception as e:
        return False, str(e)


def main():
    """Função principal"""
    print("=" * 70)
    print("  FALLOUT 2D20 - PERK IMAGES DOWNLOADER (SELENIUM)")
    print("=" * 70)
    print()

    # Criar diretório
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Diretório: {OUTPUT_DIR.absolute()}\n")

    # Setup Selenium
    driver = setup_driver()
    if not driver:
        return

    try:
        # Extrair links
        image_links = get_image_links(driver)

        if not image_links:
            print("❌ Nenhuma imagem encontrada")
            return

        # Download
        print(f"\n📥 Iniciando download de {len(image_links)} perks...\n")

        downloaded = 0
        skipped = 0
        failed = 0

        for idx, img_info in enumerate(image_links, 1):
            name = sanitize_filename(img_info['name'])
            output_path = OUTPUT_DIR / f"{name}.png"

            print(f"[{idx}/{len(image_links)}] {img_info['name']}")

            # Verificar se existe
            if output_path.exists():
                file_size = output_path.stat().st_size / 1024
                print(f"   ⏭️  Já existe ({file_size:.1f} KB)")
                skipped += 1
                continue

            # Download
            success, result = download_image(img_info['url'], output_path)

            if success:
                print(f"   ✅ Baixado ({result:.1f} KB)")
                downloaded += 1
            else:
                print(f"   ❌ Falha: {result}")
                failed += 1

            time.sleep(0.5)  # Delay entre downloads

        # Resumo
        print()
        print("=" * 70)
        print("📊 RESUMO")
        print("=" * 70)
        print(f"✅ Baixados:    {downloaded}")
        print(f"⏭️  Já existiam: {skipped}")
        print(f"❌ Falhas:      {failed}")
        print(f"📁 Total:       {downloaded + skipped} / {len(image_links)}")
        print(f"\n📂 {OUTPUT_DIR.absolute()}")
        print("=" * 70)

    finally:
        driver.quit()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Cancelado pelo usuário")
    except Exception as e:
        print(f"\n\n❌ Erro: {e}")
        import traceback
        traceback.print_exc()
