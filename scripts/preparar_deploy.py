import os
import shutil
import subprocess
import sys

def run_build():
    print("1. Compiling TypeScript code (npm run build)...")
    try:
        subprocess.run("npm run build", shell=True, check=True)
    except subprocess.CalledProcessError:
        print("Error compiling the project. Check the output above.")
        sys.exit(1)

def prepare_dist():
    print("2. Preparing the 'dist/' directory...")
    dist_dir = "dist"
    
    # Clean directory if it already exists
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir)

    # Allowed files list
    files_to_copy = [
        "index.html",
        "manifest.json",
        "service-worker.js",
        "CNAME",
        "README.md",
        "README_pt.md",
        "LICENSE-GNU",
        ".nojekyll"
    ]

    # Allowed directories list
    dirs_to_copy = [
        "css",
        "js",
        "img",
        "data",
        "fonts"
    ]

    print("3. Copying production assets...")
    
    # Copy files
    for f in files_to_copy:
        if os.path.exists(f):
            shutil.copy2(f, os.path.join(dist_dir, f))
            print(f"  - Copied: {f}")
        else:
            print(f"  ! Warning: File {f} not found.")

    # Copy directories
    for d in dirs_to_copy:
        if os.path.exists(d):
            shutil.copytree(d, os.path.join(dist_dir, d))
            print(f"  - Copied directory: {d}/")
        else:
            print(f"  ! Warning: Directory {d}/ not found.")

    
    # Create .nojekyll file for GitHub Pages
    open(os.path.join(dist_dir, ".nojekyll"), "w").close()
    print("  - Created: .nojekyll (GitHub Pages optimization)")

    print(f"\n✅ Done! The production site is packaged in '{dist_dir}/'.")
    print("⚠️  When publishing, upload ONLY the contents inside the 'dist/' folder.")
    print("   API keys in .env and internal source files are excluded.\n")

if __name__ == "__main__":
    run_build()
    prepare_dist()
