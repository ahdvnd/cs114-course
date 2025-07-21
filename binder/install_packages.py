#!/usr/bin/env python3
"""
Helper script to install Python packages at runtime in Binder.
This allows you to install packages that aren't in your requirements.txt
"""

import subprocess
import sys
import importlib

def install_package(package_name):
    """Install a Python package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
        print(f"✅ Successfully installed {package_name}")
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Failed to install {package_name}")
        return False

def check_package(package_name):
    """Check if a package is already installed"""
    try:
        importlib.import_module(package_name)
        print(f"✅ {package_name} is already installed")
        return True
    except ImportError:
        print(f"❌ {package_name} is not installed")
        return False

def install_if_needed(package_name):
    """Install a package only if it's not already installed"""
    if not check_package(package_name):
        return install_package(package_name)
    return True

# Example usage:
if __name__ == "__main__":
    # List of packages you might want to install
    packages = [
        "pandas",
        "matplotlib", 
        "seaborn",
        "scikit-learn",
        "requests",
        "beautifulsoup4",
        "nltk",
        "transformers",
        "torch",
        "tensorflow"
    ]
    
    print("Installing packages...")
    for package in packages:
        install_if_needed(package)
    
    print("Done!") 