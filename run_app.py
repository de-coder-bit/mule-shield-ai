"""
MuleShield AI - One-Click Application Runner
Launches both the FastAPI Python Backend and Vite Frontend concurrently.
"""
import subprocess
import sys
import os
import time
import webbrowser

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("=" * 70)
    print("🚀 Starting MuleShield AI (Google AML AI Spec + FIU-IND Gateway)")
    print("=" * 70)

    # 1. Start Backend
    print("[1/2] Launching FastAPI Backend on http://localhost:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
    backend_process = subprocess.Popen(backend_cmd, cwd=backend_dir)

    # Allow backend to initialize
    time.sleep(2)

    # 2. Start Frontend
    print("[2/2] Launching Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = ["npm.cmd", "run", "dev"] if os.name == 'nt' else ["npm", "run", "dev"]
    frontend_process = subprocess.Popen(frontend_cmd, cwd=root_dir)

    print("\n" + "=" * 70)
    print("✨ MuleShield AI is LIVE!")
    print("📊 Frontend UI: http://localhost:5173")
    print("⚡ Backend API: http://localhost:8000/docs")
    print("=" * 70 + "\n")

    time.sleep(2)
    try:
        webbrowser.open("http://localhost:5173")
    except Exception:
        pass

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping MuleShield AI services...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    main()
