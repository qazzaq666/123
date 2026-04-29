import sys
import json
import sounddevice as sd
import numpy as np
from vosk import Model, KaldiRecognizer

# Путь к модели
MODEL_PATH = ".opencode/vosk-model/vosk-model-small-en-us-0.15"

# Параметры аудио
RATE = 16000
CHUNK = 4000

def record_and_recognize(duration=5):
    try:
        # Загружаем модель
        model = Model(MODEL_PATH)
        recognizer = KaldiRecognizer(model, RATE)
        
        print("Recording...", file=sys.stderr)
        
        # Записываем аудио
        audio = sd.rec(int(duration * RATE), samplerate=RATE, channels=1, dtype='int16')
        sd.wait()
        
        print("Processing...", file=sys.stderr)
        
        # Обрабатываем аудио по частям
        audio_data = audio.flatten()
        for i in range(0, len(audio_data), CHUNK):
            chunk = audio_data[i:i+CHUNK]
            chunk_bytes = chunk.tobytes()
            recognizer.AcceptWaveform(chunk_bytes)
        
        # Финальный результат
        final_result = json.loads(recognizer.FinalResult())
        if final_result.get("text"):
            print(final_result["text"])
        else:
            print("", file=sys.stderr)
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    duration = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    record_and_recognize(duration)
