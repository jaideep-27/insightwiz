#!/usr/bin/env python3
"""
Setup script for InsightWhiz ML Backend
"""

import subprocess
import sys
import os

def install_python_deps():
    """Install Python dependencies for ML backend"""
    print("🐍 Installing Python dependencies...")
    
    try:
        # Change to ml-backend directory
        os.chdir('ml-backend')
        
        # Install requirements
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        
        print("✅ Python dependencies installed successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing Python dependencies: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    install_python_deps()