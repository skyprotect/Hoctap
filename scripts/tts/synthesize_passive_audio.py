import os
import sys
import json
import time
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))

MODEL_PATH = os.path.join(ROOT_DIR, 'models', 'kokoro', 'kokoro-v0_19.onnx')
VOICES_PATH = os.path.join(ROOT_DIR, 'models', 'kokoro', 'voices.bin')
MANIFEST_PATH = os.path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json')
OUT_DIR = os.path.join(ROOT_DIR, 'sounds', 'english', 'passive')
os.makedirs(OUT_DIR, exist_ok=True)

print("====================================================")
print("PIPELINE TONG HOP AM THANH PASSIVE LISTENING (v15.9)")
print("====================================================")

if not os.path.exists(MANIFEST_PATH):
    print(f"LOI: Khong tim thay manifest tai {MANIFEST_PATH}")
    sys.exit(1)

with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print(f"Khoi tao mo hinh Kokoro ONNX tu: {MODEL_PATH}")
t_init = time.time()
kokoro = Kokoro(MODEL_PATH, VOICES_PATH)
available_voices = set(kokoro.get_voices())
print(f"Kokoro san sang trong {time.time() - t_init:.2f}s! Voices: {len(available_voices)}")

def apply_gentle_fade(audio_segment, sample_rate, fade_ms=20):
    fade_samples = int(sample_rate * (fade_ms / 1000.0))
    if len(audio_segment) < fade_samples * 2:
        return audio_segment
    fade_in = np.linspace(0.0, 1.0, fade_samples)
    fade_out = np.linspace(1.0, 0.0, fade_samples)
    audio_segment[:fade_samples] *= fade_in
    audio_segment[-fade_samples:] *= fade_out
    return audio_segment

def normalize_peak(audio, target_peak=0.92):
    max_val = np.max(np.abs(audio))
    if max_val > 1e-5:
        return audio * (target_peak / max_val)
    return audio

total_lessons = len(manifest)
print(f"\nBat dau xu ly {total_lessons} bai nghe...")

for idx, (lesson_id, lesson) in enumerate(manifest.items()):
    t0 = time.time()
    mp3_filename = f"{lesson_id.lower()}.mp3"
    mp3_path = os.path.join(OUT_DIR, mp3_filename)

    speaker_map = {s['id']: s for s in lesson['speakers']}
    dialogue_segments = []
    sample_rate = 24000

    print(f"[{idx+1}/{total_lessons}] Dang tong hop: {lesson_id} - '{lesson['title']}' ({lesson['level']})")

    for seg_idx, seg in enumerate(lesson['transcript']):
        sp_id = seg['speakerId']
        text = seg['text'].strip()
        sp_info = speaker_map.get(sp_id)
        if not sp_info:
            print(f"  Canh bao: Khong tim thay speaker info cho {sp_id}")
            continue

        voice = sp_info['voice']
        speed = float(sp_info.get('speed', 0.9))
        lang = 'en-gb' if voice.startswith('b') else 'en-us'

        if voice not in available_voices:
            raise ValueError(f"Giong {voice} khong ton tai trong Kokoro voices!")

        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)
        sample_rate = sr

        # Ap dung fade nhe de tranh tieng pop o dau/duoi cau
        samples = apply_gentle_fade(samples, sample_rate, fade_ms=15)
        # Chuan hoa am luong tung cau
        samples = normalize_peak(samples, target_peak=0.90)

        dialogue_segments.append(samples)

        # Khoang lang tu nhien giua cac cau thoai (450ms cho hoi thoai, 600ms giua cac cau truyen)
        is_story = 'story' in lesson.get('contentType', '')
        gap_sec = 0.6 if is_story else 0.45
        silence_samples = np.zeros(int(sample_rate * gap_sec), dtype=np.float32)
        dialogue_segments.append(silence_samples)

    if not dialogue_segments:
        print(f"  Loi: Khong co du lieu am thanh cho {lesson_id}")
        continue

    # Noi cac doan thoai lai thanh chuoi hoan chinh
    full_audio = np.concatenate(dialogue_segments)
    # Chuan hoa am luong toan bai
    full_audio = normalize_peak(full_audio, target_peak=0.92)

    # Xuat ra tep MP3
    sf.write(mp3_path, full_audio, sample_rate, format='MP3')
    duration = len(full_audio) / sample_rate
    size_bytes = os.path.getsize(mp3_path)

    lesson['durationSec'] = round(duration, 1)
    lesson['sizeBytes'] = size_bytes
    lesson['sampleRate'] = sample_rate

    print(f"  -> Hoan thanh: {duration:.1f}s | {size_bytes / 1024:.1f} KB | Thoi gian tao: {time.time() - t0:.2f}s")

with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("\n====================================================")
print(f"Tat ca {total_lessons} tep audio da duoc tong hop thanh cong tai: {OUT_DIR}")
print(f"Manifest da duoc cap nhat metadata day du tai: {MANIFEST_PATH}")
print("====================================================")
