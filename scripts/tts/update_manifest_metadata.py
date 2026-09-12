import os
import sys
import json
import soundfile as sf

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MANIFEST_PATH = os.path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json')
AUDIO_DIR = os.path.join(ROOT_DIR, 'sounds', 'english', 'passive')

if not os.path.exists(MANIFEST_PATH):
    print("Manifest not found")
    sys.exit(1)

with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print(f"Kiểm tra và cập nhật metadata cho {len(manifest)} bài nghe...")
updated = 0
missing = 0

for lesson_id, lesson in manifest.items():
    mp3_filename = f"{lesson_id.lower()}.mp3"
    mp3_path = os.path.join(AUDIO_DIR, mp3_filename)
    if os.path.exists(mp3_path):
        size_bytes = os.path.getsize(mp3_path)
        try:
            info = sf.info(mp3_path)
            duration = round(info.duration, 1)
            samplerate = info.samplerate
        except Exception:
            duration = lesson.get('durationSec', 20.0)
            samplerate = 24000
        lesson['durationSec'] = duration
        lesson['sizeBytes'] = size_bytes
        lesson['sampleRate'] = samplerate
        updated += 1
    else:
        missing += 1

with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(f"Hoàn tất: Đã cập nhật metadata cho {updated}/{len(manifest)} tệp MP3. Còn thiếu: {missing}.")
