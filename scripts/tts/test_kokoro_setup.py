import sys
print("Python version:", sys.version)
try:
    import kokoro_onnx
    print("kokoro_onnx version:", kokoro_onnx.__file__)
    import soundfile
    print("soundfile version:", soundfile.__version__)
    import onnxruntime
    print("onnxruntime version:", onnxruntime.__version__)
except Exception as e:
    print("Import error:", e)
