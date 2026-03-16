import subprocess
import time
import os

def run_all_scripts():
    # List of scripts in logical execution order
    scripts_to_run = [
        "import_all_types.py",
        "import_all_natures.py",
        "import_all_items.py",
        "import_all_abilities.py",
        "import_all_moves.py",
        "import_all_basic_pokemon_info.py",
        "import_all_moves_abilities_of_pokemon.py"
    ]

    print("🚀 Starting full Pokémon data import...")
    start_time = time.time()

    # The folder where all scripts are stored
    scripts_folder = "Scripts"

    for script in scripts_to_run:
        # Construct the correct path: "Scripts/import_all_types.py"
        script_path = os.path.join(scripts_folder, script)
        
        print(f"\n{'='*50}")
        print(f"▶️ Executing: {script_path}")
        print(f"{'='*50}")
        
        try:
            # Run the script using the new path
            subprocess.run(["python", script_path], check=True)
            print(f"✅ {script} completed successfully.")
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error: {script} failed with exit code {e.returncode}.")
            print("🛑 Aborting the rest of the import process to prevent data corruption.")
            break
            
        except FileNotFoundError:
            print(f"❌ Error: Could not find '{script_path}'. Make sure it's in the '{scripts_folder}' directory.")
            print("🛑 Aborting.")
            break

    total_time = time.time() - start_time
    minutes, seconds = divmod(total_time, 60)
    print(f"\n🎉 All imports finished! Total execution time: {int(minutes)}m {int(seconds)}s.")

if __name__ == "__main__":
    run_all_scripts()