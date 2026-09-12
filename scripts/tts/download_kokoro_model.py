import os
import sys
import urllib.request

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models", "kokoro")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.json"

model_path = os.path.join(MODEL_DIR, "kokoro-v0_19.onnx")
voices_path = os.path.join(MODEL_DIR, "voices.json")

def download_file(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"File exists: {dest} ({os.path.getsize(dest)} bytes)")
        return True
    print(f"Downloading {url} -> {dest}...")
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"Downloaded: {dest} ({os.path.getsize(dest)} bytes)")
        return True
    except Exception as e:
        print(f"Download failed for {url}: {e}")
        return False

print("Checking Kokoro model files...")
ok_model = download_file(MODEL_URL, model_path)
ok_voices = download_file(VOICES_URL, voices_path)

if ok_model and ok_voices:
    print("Kokoro model files ready!")
else:
    print("Warning: Kokoro model download failed or incomplete.")
