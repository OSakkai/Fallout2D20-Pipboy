#!/usr/bin/env python3
"""
Script para baixar imagens dos Perks do Fallout 2d20 RPG
Fonte: Fallout Wiki (Fandom)
"""

import os
import requests
import time
from pathlib import Path
from urllib.parse import urljoin

# Configurações
OUTPUT_DIR = Path("public/assets/images/perks-2d20")
BASE_URL = "https://fallout.fandom.com"
WIKI_API = f"{BASE_URL}/api.php"

# Headers para simular navegador e evitar bloqueio
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://fallout.fandom.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

# Lista completa de perks do Fallout 2d20
PERKS_2D20 = [
    # A
    "Action Boy", "Adamantium Skeleton", "Adrenaline Rush", "Animal Friend",
    "Aquaboy", "Armorer", "Awareness",
    # B
    "Barbarian", "Better Criticals", "Big Leagues", "Blacksmith", "Blitz",
    "Bloody Mess", "Bodyguard",
    # C
    "Cannibal", "Cap Collector", "Chem Resistant", "Chemist", "Commando",
    "Concentrated Fire", "Critical Banker",
    # D
    "Demolition Expert", "Dogmeat's Friend", "Durable",
    # E
    "Educated", "Entomologist",
    # F
    "Fast Metabolism", "Finesse", "Fortune Finder", "Four Leaf Clover",
    # G
    "Ghoulish", "Globe Trotter", "Gun Fu", "Gun Nut", "Gunslinger",
    # H
    "Hacker", "Heavy Gunner", "Here and Now", "Healer",
    # I
    "Idiot Savant", "Infiltrator", "Inspirational", "Intense Training",
    "Intimidation", "Iron Fist",
    # L
    "Lady Killer", "Black Widow", "Lead Belly", "Life Giver", "Light Step",
    "Local Leader", "Locksmith", "Lone Wanderer",
    # M
    "Medic", "Mister Sandman", "Moving Target", "Mysterious Stranger",
    # N
    "Nerd Rage", "Night Person", "Ninja", "Nuclear Physicist",
    # P
    "Pain Train", "Party Boy", "Party Girl", "Penetrator", "Pickpocket", "Pyromaniac",
    # Q
    "Quick Hands", "Quick Draw",
    # R
    "Rad Resistant", "Refractor", "Ricochet", "Rifleman", "Robotics Expert", "Rooted",
    # S
    "Science!", "Scrapper", "Scrounger", "Sensory Deprivation", "Sharpshooter",
    "Sneak", "Sniper", "Solar Powered", "Spray n' Pray", "Steady Aim",
    "Stealth", "Strong Back",
    # T
    "Tag!", "Toughness", "Tracker",
    # V-W
    "V.A.N.S", "Wasteland Whisperer"
]


def sanitize_filename(name):
    """Converte nome do perk para snake_case e remove caracteres especiais"""
    # Remove caracteres especiais
    name = name.replace("'", "").replace("!", "").replace(".", "")
    # Substitui espaços e barras por underline
    name = name.replace(" ", "_").replace("/", "_")
    # Converte para minúsculas
    return name.lower() + ".png"


def get_perk_image_url_from_category():
    """
    Busca URLs das imagens através da categoria da Wiki
    """
    print("🔍 Buscando lista de imagens da categoria Fallout 2d20 Perks...")

    params = {
        'action': 'query',
        'format': 'json',
        'list': 'categorymembers',
        'cmtitle': 'Category:Fallout:_The_Roleplaying_Game_perk_images',
        'cmlimit': '500',
        'cmtype': 'file'
    }

    try:
        response = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
        response.raise_for_status()
        data = response.json()

        if 'query' in data and 'categorymembers' in data['query']:
            files = data['query']['categorymembers']
            print(f"✅ Encontradas {len(files)} imagens na categoria")
            return files
        else:
            print("❌ Nenhuma imagem encontrada na categoria")
            return []

    except Exception as e:
        print(f"❌ Erro ao buscar categoria: {e}")
        return []


def get_image_url(filename):
    """Obtém URL de download da imagem através da API"""
    params = {
        'action': 'query',
        'format': 'json',
        'titles': f'File:{filename}',
        'prop': 'imageinfo',
        'iiprop': 'url'
    }

    try:
        response = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
        response.raise_for_status()
        data = response.json()

        pages = data['query']['pages']
        for page_id, page_data in pages.items():
            if 'imageinfo' in page_data:
                return page_data['imageinfo'][0]['url']

    except Exception as e:
        print(f"   ⚠️  Erro ao obter URL: {e}")

    return None


def download_image(url, output_path):
    """Baixa a imagem e salva no caminho especificado"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=30, stream=True)
        response.raise_for_status()

        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        file_size = output_path.stat().st_size / 1024  # KB
        return True, file_size

    except Exception as e:
        return False, str(e)


def main():
    """Função principal"""
    print("=" * 70)
    print("  FALLOUT 2D20 - PERK IMAGES DOWNLOADER")
    print("=" * 70)
    print()

    # Criar diretório de saída
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"📁 Diretório de saída: {OUTPUT_DIR.absolute()}")
    print()

    # Buscar lista de imagens da categoria
    category_files = get_perk_image_url_from_category()

    if not category_files:
        print("\n⚠️  Método de categoria falhou. Tentando download direto por nome...")
        # Fallback: tentar baixar por nome direto
        category_files = [{'title': f'File:2D20_{perk}.png'} for perk in PERKS_2D20]

    print(f"\n📥 Iniciando download de {len(category_files)} perks...\n")

    downloaded = 0
    skipped = 0
    failed = 0

    for idx, file_info in enumerate(category_files, 1):
        filename = file_info['title'].replace('File:', '')

        # Extrair nome do perk (remover prefixo 2D20_ se existir)
        perk_name = filename.replace('2D20_', '').replace('.png', '')
        output_filename = sanitize_filename(perk_name)
        output_path = OUTPUT_DIR / output_filename

        print(f"[{idx}/{len(category_files)}] {perk_name}")

        # Verificar se já existe
        if output_path.exists():
            file_size = output_path.stat().st_size / 1024
            print(f"   ⏭️  Já existe ({file_size:.1f} KB)")
            skipped += 1
            continue

        # Obter URL de download
        image_url = get_image_url(filename)

        if not image_url:
            print(f"   ❌ URL não encontrada")
            failed += 1
            continue

        # Baixar imagem
        success, result = download_image(image_url, output_path)

        if success:
            print(f"   ✅ Baixado ({result:.1f} KB)")
            downloaded += 1
        else:
            print(f"   ❌ Falha: {result}")
            failed += 1

        # Delay entre downloads para não sobrecarregar o servidor
        if idx < len(category_files):
            time.sleep(1)

    # Resumo
    print()
    print("=" * 70)
    print("📊 RESUMO DO DOWNLOAD")
    print("=" * 70)
    print(f"✅ Baixados:    {downloaded}")
    print(f"⏭️  Já existiam: {skipped}")
    print(f"❌ Falhas:      {failed}")
    print(f"📁 Total:       {downloaded + skipped} / {len(category_files)}")
    print()
    print(f"📂 Localização: {OUTPUT_DIR.absolute()}")
    print("=" * 70)

    if failed > 0:
        print("\n⚠️  NOTA: Algumas imagens falharam. Possíveis soluções:")
        print("   1. Execute o script novamente (pode ter sido erro temporário)")
        print("   2. Baixe manualmente de: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images")
        print("   3. Use extensão de navegador para download em massa")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Download cancelado pelo usuário")
    except Exception as e:
        print(f"\n\n❌ Erro fatal: {e}")
        import traceback
        traceback.print_exc()
