import sys
import json
import sounddevice as sd
import numpy as np
from vosk import Model, KaldiRecognizer

# Путь к модели
MODEL_PATH = ".opencode/vosk-model/vosk-model-small-en-us-0.15"

# Параметры аудио
RATE = 16000

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
        
        # Распознаём речь
        audio_bytes = audio.tobytes()
        if recognizer.AcceptWaveform(audio_bytes):
            result = json.loads(recognizer.Result())
            if result.get("text"):
                print(result["text"])
        
        # Финальный результат
        final_result = json.loads(recognizer.FinalResult())
        if final_result.get("text"):
            print(final_result["text"])
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    duration = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    record_and_recognize(duration)
