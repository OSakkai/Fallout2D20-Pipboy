#!/usr/bin/env python3
"""
Script para auxiliar no download dos Perks 2d20 da Fallout Wiki

NOTA: Este script NÃO consegue fazer download automático devido à proteção
anti-hotlinking da Wiki. Ele gera uma lista de comandos para você copiar
e colar no navegador usando as DevTools.

USO:
1. Abra o navegador e acesse: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images
2. Abra DevTools (F12)
3. Vá para a aba Console
4. Copie e cole o código JavaScript gerado por este script
5. Pressione Enter

O script baixará automaticamente todas as imagens para a pasta de Downloads
"""

import os

# Lista completa de perks com seus IDs de imagem na Wiki
PERKS = [
    ("0/06", "2D20_Action_Boy.png", "action_boy.png"),
    ("2/2d", "2D20_Adamantium_Skeleton.png", "adamantium_skeleton.png"),
    ("7/7a", "2D20_Adrenaline_Rush.png", "adrenaline_rush.png"),
    ("8/8a", "2D20_Animal_Friend.png", "animal_friend.png"),
    ("1/1f", "2D20_Aquaboy.png", "aquaboy.png"),
    ("4/4d", "2D20_Armorer.png", "armorer.png"),
    ("5/53", "2D20_Awareness.png", "awareness.png"),
    ("c/c4", "2D20_Barbarian.png", "barbarian.png"),
    ("8/80", "2D20_Basher.png", "basher.png"),
    ("c/c7", "2D20_Better_Criticals.png", "better_criticals.png"),
    ("5/50", "2D20_Big_Leagues.png", "big_leagues.png"),
    ("8/87", "2D20_Black_Widow.png", "black_widow.png"),
    ("1/1a", "2D20_Blacksmith.png", "blacksmith.png"),
    ("d/df", "2D20_Blitz.png", "blitz.png"),
    ("8/8f", "2D20_Bloody_Mess.png", "bloody_mess.png"),
    ("6/6a", "2D20_Can_Do.png", "can_do.png"),
    ("5/5f", "2D20_Cap_Collector.png", "cap_collector.png"),
    ("7/7f", "2d20_Cautious_Nature.png", "cautious_nature.png"),
    ("e/e0", "2d20_Center_Mass.png", "center_mass.png"),
    ("3/31", "2D20_Chem_Resistant.png", "chem_resistant.png"),
    ("0/09", "2D20_Chemist.png", "chemist.png"),
    ("5/5d", "2D20_Commando.png", "commando.png"),
    ("3/3e", "2D20_Comprehension.png", "comprehension.png"),
    ("a/a9", "2D20_Concentrated_Fire.png", "concentrated_fire.png"),
    ("b/ba", "2d20_Daring_Nature.png", "daring_nature.png"),
    ("0/09", "2D20_Demolition_Expert.png", "demolition_expert.png"),
    ("2/24", "2D20_Dodger.png", "dodger.png"),
    ("1/19", "2D20_Dogmeat.png", "dogmeat.png"),
    ("2/2f", "2d20_EMT.png", "emt.png"),
    ("5/5f", "2D20_Fast_Metabolism.png", "fast_metabolism.png"),
    ("0/06", "2D20_Faster_Healing.png", "faster_healing.png"),
    ("b/bf", "2D20_Finesse.png", "finesse.png"),
    ("e/e2", "2D20_Fortune_Finder.png", "fortune_finder.png"),
    ("5/5b", "2d20_Ghost.png", "ghost.png"),
    ("1/16", "2D20_Ghoulish.png", "ghoulish.png"),
    ("4/46", "2D20_Gun_Fu.png", "gun_fu.png"),
    ("a/a4", "2D20_Gun_Nut.png", "gun_nut.png"),
    ("2/2a", "2D20_Gunslinger.png", "gunslinger.png"),
    ("f/f2", "2D20_Hacker.png", "hacker.png"),
    ("9/90", "2d20_Healer.png", "healer.png"),
    ("f/f0", "2d20_Heave_Ho.png", "heave_ho.png"),
    ("1/1c", "2d20_Hunter.png", "hunter.png"),
    ("7/75", "2D20_Infiltrator.png", "infiltrator.png"),
    ("1/15", "2D20_Inspirational.png", "inspirational.png"),
    ("9/95", "2D20_Intense_Training.png", "intense_training.png"),
    ("d/d4", "2D20_Iron_Fist.png", "iron_fist.png"),
    ("a/ac", "2d20_Jury_Rigger.png", "jury_rigger.png"),
    ("6/67", "2d20_Laser_Commander.png", "laser_commander.png"),
    ("3/37", "2D20_Lead_Belly.png", "lead_belly.png"),
    ("6/6b", "2D20_Life_Giver.png", "life_giver.png"),
    ("9/93", "2D20_Lightstep.png", "lightstep.png"),
    ("8/8e", "2D20_Master_Thief.png", "master_thief.png"),
    ("7/72", "2D20_Medic.png", "medic.png"),
    ("3/30", "2d20_Meltdown.png", "meltdown.png"),
    ("0/09", "2d20_Mister_Sandman.png", "mister_sandman.png"),
    ("5/5a", "2D20_Moving_Target.png", "moving_target.png"),
    ("e/ea", "2D20_Mysterious_Stranger.png", "mysterious_stranger.png"),
    ("3/39", "2D20_Nerd_Rage.png", "nerd_rage.png"),
    ("6/69", "2D20_Night_Person.png", "night_person.png"),
    ("e/e7", "2D20_Ninja.png", "ninja.png"),
    ("5/56", "2D20_Nuclear_Physicist.png", "nuclear_physicist.png"),
    ("9/91", "2D20_Pain_Train.png", "pain_train.png"),
    ("4/47", "2d20_Paralyzing_Palm.png", "paralyzing_palm.png"),
    ("7/7c", "2D20_Party_Boy.png", "party_boy.png"),
    ("9/99", "2d20_Pathfinder.png", "pathfinder.png"),
    ("f/f8", "2D20_Pharma_Farma.png", "pharma_farma.png"),
    ("6/6f", "2D20_Pick_Pocket.png", "pick_pocket.png"),
    ("d/df", "2d20_Piercing_Strike.png", "piercing_strike.png"),
    ("8/8c", "2d20_Pyromaniac.png", "pyromaniac.png"),
    ("e/ee", "2d20_Quick_hands.png", "quick_hands.png"),
    ("5/50", "2D20_Quickhands.png", "quickhands.png"),
    ("9/92", "2D20_Rad_Resistance.png", "rad_resistance.png"),
    ("1/14", "2D20_Refractor.png", "refractor.png"),
    ("3/3f", "2D20_Ricochet.png", "ricochet.png"),
    ("f/ff", "2D20_Rifleman.png", "rifleman.png"),
    ("d/dd", "2D20_Robotics_Expert.png", "robotics_expert.png"),
    ("9/96", "2D20_Science.png", "science.png"),
    ("6/64", "2D20_Scoundrel.png", "scoundrel.png"),
    ("7/79", "2D20_Scrapper.png", "scrapper.png"),
    ("8/85", "2D20_Scrounger.png", "scrounger.png"),
    ("5/50", "2d20_Shotgun_Surgeon.png", "shotgun_surgeon.png"),
    ("f/f0", "2D20_Size_Matters.png", "size_matters.png"),
    ("4/41", "2d20_Skilled.png", "skilled.png"),
    ("b/b7", "2d20_Slayer_vault_boy.png", "slayer.png"),
    ("8/8a", "2d20_Smooth_talker.png", "smooth_talker.png"),
    ("7/7e", "2d20_Snakeater.png", "snakeater.png"),
    ("4/44", "2D20_Sniper.png", "sniper.png"),
    ("0/0b", "2D20_Solar_Powered.png", "solar_powered.png"),
    ("4/4f", "2D20_Strong_Back.png", "strong_back.png"),
    ("e/ed", "2D20_Tag.png", "tag.png"),
    ("a/a7", "2D20_Tales_of_Junktown_Jerky_Vendor.png", "tales_of_junktown.png"),
    ("1/14", "2d20_Terrifying_Presence.png", "terrifying_presence.png"),
    ("8/83", "2D20_Toughness.png", "toughness.png"),
]

def generate_javascript_downloader():
    """Gera código JavaScript para download via navegador"""

    js_code = """
// PERK DOWNLOADER - Cole este código no Console do navegador
// Execute na página: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images

const perks = [
"""

    for path, orig_name, new_name in PERKS:
        url = f"https://static.wikia.nocookie.net/fallout/images/{path}/{orig_name}"
        js_code += f'    {{url: "{url}", name: "{new_name}"}},\n'

    js_code += """];

async function downloadPerks() {
    console.log(`Iniciando download de ${perks.length} perks...`);

    for (let i = 0; i < perks.length; i++) {
        const perk = perks[i];
        console.log(`[${i+1}/${perks.length}] Baixando ${perk.name}...`);

        try {
            const response = await fetch(perk.url);
            const blob = await response.blob();

            // Criar link de download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = perk.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Delay para não sobrecarregar
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Erro ao baixar ${perk.name}:`, error);
        }
    }

    console.log('Download concluído!');
}

// Executar
downloadPerks();
"""

    return js_code

def generate_curl_script():
    """Gera script bash com todos os downloads"""

    script = """#!/bin/bash
# Script de download de perks (pode não funcionar devido à proteção da Wiki)

cd "public/assets/images/perks"

"""

    for path, orig_name, new_name in PERKS:
        url = f"https://static.wikia.nocookie.net/fallout/images/{path}/{orig_name}"
        script += f'curl -L "{url}" -o "{new_name}"\n'
        script += "sleep 1\n"

    script += '\necho "Download concluído!"\n'
    return script

if __name__ == "__main__":
    print("=" * 80)
    print("FALLOUT 2D20 PERKS DOWNLOADER")
    print("=" * 80)
    print()
    print(f"Total de perks: {len(PERKS)}")
    print()
    print("OPÇÃO 1 - JavaScript (RECOMENDADO)")
    print("-" * 80)
    print("1. Abra: https://fallout.fandom.com/wiki/Category:Fallout:_The_Roleplaying_Game_perk_images")
    print("2. Pressione F12 (DevTools)")
    print("3. Vá para a aba 'Console'")
    print("4. Copie e cole o código abaixo:")
    print()

    js_code = generate_javascript_downloader()

    # Salvar JavaScript em arquivo
    with open("download-perks.js", "w", encoding="utf-8") as f:
        f.write(js_code)

    print(f"[Código salvo em: download-perks.js]")
    print()
    print(js_code[:500] + "...")
    print()
    print("=" * 80)
    print()
    print("OPÇÃO 2 - Bash Script (pode falhar)")
    print("-" * 80)

    bash_script = generate_curl_script()

    with open("download-perks.sh", "w", encoding="utf-8") as f:
        f.write(bash_script)

    print(f"[Script salvo em: download-perks.sh]")
    print()
    print("Para executar:")
    print("  chmod +x download-perks.sh")
    print("  ./download-perks.sh")
    print()
    print("=" * 80)
    print()
    print(f"✅ Arquivos gerados com sucesso!")
    print(f"   - download-perks.js ({len(PERKS)} downloads)")
    print(f"   - download-perks.sh ({len(PERKS)} downloads)")
