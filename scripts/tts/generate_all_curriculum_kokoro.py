import os
import sys
import time
import json
import hashlib
import soundfile as sf
from kokoro_onnx import Kokoro

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))

MODEL_DIR = os.path.join(ROOT_DIR, "models", "kokoro")
model_path = os.path.join(MODEL_DIR, "kokoro-v0_19.onnx")
voices_path = os.path.join(MODEL_DIR, "voices.bin")

inventory_file = os.path.join(SCRIPT_DIR, "curriculum_inventory.json")
out_dir = os.path.join(ROOT_DIR, "sounds", "english")
os.makedirs(out_dir, exist_ok=True)
manifest_path = os.path.join(out_dir, "audio-manifest.json")

print("1. Loading curriculum inventory...")
with open(inventory_file, "r", encoding="utf-8") as f:
    inventory = json.load(f)
print(f"Total curriculum items in inventory: {len(inventory)}")

print("2. Initializing Kokoro TTS engine...")
t0 = time.time()
kokoro = Kokoro(model_path, voices_path)
print(f"Kokoro initialized in {time.time() - t0:.2f}s")

voice = "af_bella"
speed = 0.95
generated_count = 0
skipped_count = 0

# Tải hoặc khởi tạo manifest cấu trúc mới
canonical_items = {}
aliases_map = {}

# Nếu đã có manifest cũ, nạp vào để giữ lại thông tin
old_manifest = {}
if os.path.exists(manifest_path):
    try:
        with open(manifest_path, "r", encoding="utf-8") as f:
            old_manifest = json.load(f)
    except Exception as e:
        print("Warning loading old manifest:", e)

for i, item in enumerate(inventory):
    cid = item["id"]
    text = item["text"]
    filename = item["filename"]
    category = item["category"]
    feature = item["feature"]
    grade = item["grade"]
    unit = item["unit"]
    aliases = item.get("aliases", [])

    mp3_path = os.path.join(out_dir, filename)

    # Kiểm tra xem file đã tồn tại và hợp lệ chưa
    file_exists = os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 100

    if not file_exists:
        try:
            samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
            duration = round(len(samples) / sample_rate, 2)
            sf.write(mp3_path, samples, sample_rate, format="MP3")
            size_bytes = os.path.getsize(mp3_path)
            generated_count += 1

            if generated_count % 25 == 0 or generated_count <= 5:
                print(f"[{i+1}/{len(inventory)}] Generated {generated_count} ({cid}): '{text[:30]}...' -> {duration}s")
        except Exception as e:
            print(f"ERROR synthesizing {cid} ('{text}'): {e}")
            continue
    else:
        skipped_count += 1
        # Tính duration từ file đã có nếu có thể
        try:
            info = sf.info(mp3_path)
            duration = round(info.duration, 2)
            sample_rate = info.samplerate
            size_bytes = os.path.getsize(mp3_path)
        except Exception:
            duration = 1.0
            sample_rate = 24000
            size_bytes = os.path.getsize(mp3_path)

    h = hashlib.md5(text.encode("utf-8")).hexdigest()[:8]

    canonical_entry = {
        "id": cid,
        "text": text,
        "filename": filename,
        "file": filename,
        "category": category,
        "feature": feature,
        "grade": grade,
        "unit": unit,
        "duration": duration,
        "sizeBytes": size_bytes,
        "voice": voice,
        "speed": speed,
        "sampleRate": sample_rate,
        "hash": h,
        "engine": "kokoro-v0.19"
    }
    canonical_items[cid] = canonical_entry

    # Đăng ký aliases
    for al in aliases:
        aliases_map[al] = cid

# Xây dựng manifest tổng hợp hỗ trợ cả direct lookup và structured lookup
manifest_output = {
    "_meta": {
        "version": "15.7",
        "totalCanonicalItems": len(canonical_items),
        "totalAliases": len(aliases_map),
        "voice": voice,
        "speed": speed,
        "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S")
    },
    "_items": canonical_items,
    "_aliases": aliases_map
}

# Điền vào root level để backward-compatible 100% với manifest cũ
for cid, entry in canonical_items.items():
    manifest_output[cid] = entry

for al, cid in aliases_map.items():
    if al not in manifest_output:
        manifest_output[al] = canonical_items[cid]

with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest_output, f, ensure_ascii=False, indent=2)

print("\n======================================================")
print("KOKORO CURRICULUM AUDIO SYNTHESIS COMPLETE")
print(f"Generated new MP3s: {generated_count}")
print(f"Skipped existing: {skipped_count}")
print(f"Total canonical items: {len(canonical_items)}")
print(f"Total aliases registered: {len(aliases_map)}")
print(f"Manifest written to: {manifest_path}")
print("======================================================")
