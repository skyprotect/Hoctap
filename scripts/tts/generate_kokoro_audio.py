import os
import sys
import time
import json
import hashlib
import soundfile as sf
from kokoro_onnx import Kokoro

SCRIPT_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(SCRIPT_DIR, "..", "..", "models", "kokoro")
model_path = os.path.join(MODEL_DIR, "kokoro-v0_19.onnx")
voices_path = os.path.join(MODEL_DIR, "voices.bin")

phrases_file = os.path.join(SCRIPT_DIR, "phrases_to_synthesize.json")
out_dir = os.path.join(SCRIPT_DIR, "..", "..", "sounds", "english")
os.makedirs(out_dir, exist_ok=True)
manifest_path = os.path.join(out_dir, "audio-manifest.json")

print("1. Loading phrases list...")
with open(phrases_file, "r", encoding="utf-8") as f:
    phrases = json.load(f)
print(f"Total phrases to synthesize: {len(phrases)}")

print("2. Loading existing manifest if present...")
manifest = {}
if os.path.exists(manifest_path):
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        print(f"Loaded existing manifest with {len(manifest)} items")
    except Exception as e:
        print("Manifest parse error, starting fresh:", e)

print("3. Initializing Kokoro TTS engine...")
t0 = time.time()
kokoro = Kokoro(model_path, voices_path)
print(f"Kokoro initialized in {time.time() - t0:.2f}s")

voice = "af_bella"
speed = 0.95
generated_count = 0
skipped_count = 0

for i, item in enumerate(phrases):
    key = item["key"]
    text = item["text"]
    mp3_filename = f"{key}.mp3"
    mp3_path = os.path.join(out_dir, mp3_filename)

    if os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 1000 and key in manifest:
        skipped_count += 1
        continue

    try:
        samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
        duration = len(samples) / sample_rate

        # Write MP3 directly
        sf.write(mp3_path, samples, sample_rate, format="MP3")
        size_bytes = os.path.getsize(mp3_path)

        # Hash
        h = hashlib.md5(text.encode("utf-8")).hexdigest()[:8]

        manifest[key] = {
            "text": text,
            "filename": mp3_filename,
            "duration": round(duration, 2),
            "sizeBytes": size_bytes,
            "voice": voice,
            "sampleRate": sample_rate,
            "hash": h,
            "engine": "kokoro-v0.19"
        }
        generated_count += 1

        if generated_count % 20 == 0:
            print(f"[{i+1}/{len(phrases)}] Generated {generated_count} phrases... Current: '{text[:25]}'")
            # Save interim manifest
            with open(manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest, f, ensure_ascii=False, indent=2)

    except Exception as e:
        print(f"Error synthesizing key '{key}' ('{text}'): {e}")

# Save final manifest
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("\n==========================================")
print(f"Synthesis Complete!")
print(f"Generated: {generated_count}")
print(f"Skipped (already cached): {skipped_count}")
print(f"Total in manifest: {len(manifest)}")
print(f"Manifest saved at: {manifest_path}")
print("==========================================")
