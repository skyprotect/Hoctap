import os
import sys
import json
import time
import argparse
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

parser = argparse.ArgumentParser(description="Kokoro Offline Audio Synthesis for Passive Listening (v15.12)")
parser.add_argument("--force", action="store_true", help="Synthesize all items, overwriting existing mp3s")
parser.add_argument("--limit", type=int, default=0, help="Limit number of items to process (0 = all)")
args = parser.parse_args()

print("====================================================================")
print("PIPELINE TỔNG HỢP ÂM THANH KOKORO PASSIVE LISTENING (v15.12)")
print("====================================================================")

if not os.path.exists(MANIFEST_PATH):
    print(f"LỖI: Không tìm thấy manifest tại {MANIFEST_PATH}")
    sys.exit(1)

with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print(f"Khởi tạo mô hình Kokoro ONNX từ: {MODEL_PATH}")
t_init = time.time()
kokoro = Kokoro(MODEL_PATH, VOICES_PATH)
available_voices = set(kokoro.get_voices())
print(f"✓ Kokoro sẵn sàng trong {time.time() - t_init:.2f}s! Voices: {len(available_voices)}")

def apply_gentle_fade(audio_segment, sample_rate, fade_ms=15):
    """Khử tiếng click/pop ở đầu và cuối phân đoạn thoại"""
    fade_samples = int(sample_rate * (fade_ms / 1000.0))
    if len(audio_segment) < fade_samples * 2:
        return audio_segment
    fade_in = np.linspace(0.0, 1.0, fade_samples, dtype=np.float32)
    fade_out = np.linspace(1.0, 0.0, fade_samples, dtype=np.float32)
    audio_segment[:fade_samples] *= fade_in
    audio_segment[-fade_samples:] *= fade_out
    return audio_segment

def normalize_peak(audio, target_peak=0.91):
    """Đảm bảo biên độ âm thanh đồng nhất, không bị méo tiếng (clipping)"""
    max_val = np.max(np.abs(audio))
    if max_val > 1e-5:
        return audio * (target_peak / max_val)
    return audio

total_lessons = len(manifest)
print(f"\nPhân tích {total_lessons} bài nghe trong manifest...")

processed_count = 0
skipped_count = 0

for idx, (lesson_id, lesson) in enumerate(manifest.items()):
    if args.limit > 0 and processed_count >= args.limit:
        print(f"Đã đạt giới hạn {args.limit} bài nghe. Dừng tiến trình.")
        break

    mp3_filename = f"{lesson_id.lower()}.mp3"
    mp3_path = os.path.join(OUT_DIR, mp3_filename)

    # Nếu đã tồn tại file và không có cờ force và durationSec > 0 thì bỏ qua
    if not args.force and os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 10000 and lesson.get('durationSec', 0) > 0:
        skipped_count += 1
        continue

    t0 = time.time()
    level = lesson.get('level', 'A1')
    profile = lesson.get('speechProfile', {})
    base_speed = float(profile.get('speed', 0.85))
    pause_scale = float(profile.get('pauseScale', 1.20))

    speaker_map = {s['id']: s for s in lesson['speakers']}
    dialogue_segments = []
    sample_rate = 24000

    print(f"[{idx+1}/{total_lessons}] Đang tổng hợp: {lesson_id} - '{lesson['title']}' ({level} | Speed={base_speed})")

    is_story = 'story' in lesson.get('contentType', '').lower()

    # Khoảng nghỉ tự nhiên theo cấp độ
    if level == 'Pre-A1':
        gap_sec = 0.70 * pause_scale
    elif level == 'A1':
        gap_sec = 0.60 * pause_scale
    else: # A2
        gap_sec = 0.50 * pause_scale

    if is_story:
        gap_sec += 0.10

    for seg_idx, seg in enumerate(lesson['transcript']):
        sp_id = seg['speakerId']
        text = seg['text'].strip()
        sp_info = speaker_map.get(sp_id)
        if not sp_info:
            print(f"  Cảnh báo: Không tìm thấy speaker info cho {sp_id}")
            continue

        voice = sp_info['voice']
        # Dùng tốc độ cấu hình của bài học
        speed = base_speed
        lang = 'en-gb' if voice.startswith('b') else 'en-us'

        if voice not in available_voices:
            raise ValueError(f"Giọng {voice} không tồn tại trong Kokoro voices!")

        samples, sr = kokoro.create(text, voice=voice, speed=speed, lang=lang)
        sample_rate = sr

        # Áp dụng fade nhẹ khử tiếng click
        samples = apply_gentle_fade(samples, sample_rate, fade_ms=15)
        # Chuẩn hóa âm lượng từng câu
        samples = normalize_peak(samples, target_peak=0.90)

        dialogue_segments.append(samples)

        # Chèn khoảng nghỉ tự nhiên giữa các lượt thoại/câu (trừ câu cuối)
        if seg_idx < len(lesson['transcript']) - 1:
            silence_samples = np.zeros(int(sample_rate * gap_sec), dtype=np.float32)
            dialogue_segments.append(silence_samples)

    if not dialogue_segments:
        print(f"  Lỗi: Không có dữ liệu âm thanh cho {lesson_id}")
        continue

    # Nối các đoạn thoại lại thành chuỗi hoàn chỉnh
    full_audio = np.concatenate(dialogue_segments)
    # Chuẩn hóa âm lượng toàn bài
    full_audio = normalize_peak(full_audio, target_peak=0.92)

    # Xuất ra tệp MP3
    sf.write(mp3_path, full_audio, sample_rate, format='MP3')
    duration = len(full_audio) / sample_rate
    size_bytes = os.path.getsize(mp3_path)

    lesson['durationSec'] = round(duration, 1)
    lesson['sizeBytes'] = size_bytes
    lesson['sampleRate'] = sample_rate

    processed_count += 1
    print(f"  -> Xong: {duration:.1f}s | {size_bytes / 1024:.1f} KB | Thời gian tạo: {time.time() - t0:.2f}s")

# Cập nhật lại manifest với durationSec và sizeBytes chính xác
with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print("\n====================================================================")
print(f"Hoàn thành! Đã tổng hợp: {processed_count} bài mới, Bỏ qua: {skipped_count} bài.")
print(f"Tất cả {total_lessons} tệp audio hiện diện tại: {OUT_DIR}")
print(f"Manifest cập nhật đầy đủ metadata tại: {MANIFEST_PATH}")
print("====================================================================")
