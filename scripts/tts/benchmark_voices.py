import os
import time
import json
import soundfile as sf
from kokoro_onnx import Kokoro

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "models", "kokoro")
model_path = os.path.join(MODEL_DIR, "kokoro-v0_19.onnx")
voices_path = os.path.join(MODEL_DIR, "voices.bin")
out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "sounds", "english")
os.makedirs(out_dir, exist_ok=True)

print("Initializing Kokoro TTS...")
t0 = time.time()
kokoro = Kokoro(model_path, voices_path)
print(f"Kokoro initialized in {time.time() - t0:.2f}s")

test_phrases = [
    ("hello", "Hello! Welcome to English class."),
    ("good_morning", "Good morning teacher."),
    ("my_new_school", "My new school is very big and modern.")
]

voice = "af_bella" # Giọng nữ Mỹ chuẩn, rõ ràng cho học sinh lớp 6
speed = 1.0

print(f"\nBenchmarking voice: {voice}")
for key, text in test_phrases:
    t1 = time.time()
    samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang="en-us")
    gen_time = time.time() - t1
    duration = len(samples) / sample_rate
    rtf = gen_time / duration if duration > 0 else 0
    
    out_file = os.path.join(out_dir, f"{key}.wav")
    sf.write(out_file, samples, sample_rate)
    size_bytes = os.path.getsize(out_file)
    print(f"[{key}] Duration: {duration:.2f}s | Gen time: {gen_time:.2f}s | RTF: {rtf:.2f} | Size: {size_bytes} bytes")

print("\nBenchmark completed successfully!")
