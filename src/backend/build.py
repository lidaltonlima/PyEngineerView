"""Build script to compile a Python script into an executable using PyInstaller."""
import PyInstaller.__main__ as pyi_main


# Define the arguments for PyInstaller
build_args = [
    'main.py',          # The main Python script to be converted
    '--onefile',        # Create a single executable file
    '--noconsole',      # Do not show a console window (synonym for --noconsole)
    '--name=engineer',  # Optional: Set the final executable name
    '--clean'           # Optional: Remove temporary files before building
]

print('Starting the build process...')

# Call the run function from PyInstaller with the arguments
pyi_main.run(build_args)

print('Build completed!')
