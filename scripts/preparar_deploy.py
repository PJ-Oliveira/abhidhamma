import os
import shutil
import subprocess
import sys

def run_build():
    print("1. Compilando o código TypeScript (npm run build)...")
    try:
        # Usa shell=True no Windows, mas como é Mac, subprocess.run com shell=False costuma funcionar se o npm estiver no PATH
        # Para ser mais seguro no Python, passamos a string inteira e shell=True
        subprocess.run("npm run build", shell=True, check=True)
    except subprocess.CalledProcessError:
        print("Erro ao compilar o projeto. Verifique os erros acima.")
        sys.exit(1)

def prepare_dist():
    print("2. Preparando a pasta 'dist/'...")
    dist_dir = "dist"
    
    # Limpa a pasta se já existir
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir)

    # Lista de arquivos permitidos
    files_to_copy = [
        "index.html",
        "manifest.json",
        "service-worker.js",
        "README.md",
        "README_pt.md",
        "LICENSE-GNU",
        ".nojekyll"
    ]

    # Lista de pastas permitidas
    dirs_to_copy = [
        "css",
        "js",
        "img",
        "data",
        "fonts"
    ]

    print("3. Copiando apenas arquivos seguros...")
    
    # Copiar arquivos
    for f in files_to_copy:
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(dist_dir, f))
            print(f"  - Copiado: {f}")
        else:
            print(f"  ! Aviso: Arquivo {f} não encontrado.")

    # Copiar pastas
    for d in dirs_to_copy:
        if os.path.exists(d):
            shutil.copytree(d, os.path.join(dist_dir, d))
            print(f"  - Copiada pasta: {d}/")
        else:
            print(f"  ! Aviso: Pasta {d}/ não encontrada.")

    
    # Cria o arquivo .nojekyll para o GitHub Pages
    open(os.path.join(dist_dir, ".nojekyll"), "w").close()
    print("  - Criado: .nojekyll (otimização para GitHub Pages)")

    print(f"\n✅ Pronto! O seu site está empacotado na pasta '{dist_dir}/'.")
    print("⚠️  Quando for publicar (fazer upload), ARRASTE APENAS O CONTEÚDO DENTRO DA PASTA 'dist/'.")
    print("   Sua chave de API no .env e os códigos internos estão protegidos e não foram incluídos.\n")

if __name__ == "__main__":
    run_build()
    prepare_dist()
