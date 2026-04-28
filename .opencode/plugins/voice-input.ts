import type { Plugin } from "@opencode-ai/plugin"
import * as fs from "fs"
import * as path from "path"

export const VoiceInputPlugin: Plugin = async ({ client, $, directory }) => {
  let isRecording = false
  const audioFile = path.join(directory, ".opencode", "temp_audio.wav")

  const recordAudio = async (duration = 5000) => {
    try {
      client.app.log({
        body: {
          service: "voice-input",
          level: "info",
          message: "Starting audio recording...",
        },
      })

      // Используем ffmpeg для записи с микрофона
      const recordCommand = `ffmpeg -f dshow -i audio="Microphone" -t ${duration / 1000} -q:a 9 -acodec libmp3lame -b:a 192k "${audioFile}" -y 2>&1`

      await $`${recordCommand}`

      return audioFile
    } catch (error) {
      client.app.log({
        body: {
          service: "voice-input",
          level: "error",
          message: "Recording failed",
          extra: { error: String(error) },
        },
      })
      throw error
    }
  }

  const recognizeSpeech = async (audioPath: string) => {
    try {
      client.app.log({
        body: {
          service: "voice-input",
          level: "info",
          message: "Processing audio...",
        },
      })

      // Используем Google Speech-to-Text через curl (бесплатный вариант через SpeechRecognition)
      // Или используем локальный pocketsphinx
      const result = await $`pocketsphinx_continuous -infile "${audioPath}" 2>/dev/null`

      const text = result.stdout.toString().trim()
      return text
    } catch (error) {
      client.app.log({
        body: {
          service: "voice-input",
          level: "error",
          message: "Speech recognition failed",
          extra: { error: String(error) },
        },
      })
      throw error
    }
  }

  const cleanupAudio = async () => {
    try {
      if (fs.existsSync(audioFile)) {
        fs.unlinkSync(audioFile)
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  return {
    "tui.command.execute": async (input, output) => {
      // Активируем голосовой ввод командой /voice
      if (input.command === "/voice") {
        try {
          isRecording = true

          // Показываем уведомление
          await client.app.log({
            body: {
              service: "voice-input",
              level: "info",
              message: "Recording for 5 seconds... Speak now!",
            },
          })

          // Записываем аудио
          const audioPath = await recordAudio(5000)

          // Распознаем речь
          const recognizedText = await recognizeSpeech(audioPath)

          // Очищаем временный файл
          await cleanupAudio()

          if (recognizedText) {
            // Добавляем распознанный текст в чат
            output.text = recognizedText
            isRecording = false

            await client.app.log({
              body: {
                service: "voice-input",
                level: "info",
                message: "Speech recognized",
                extra: { text: recognizedText },
              },
            })
          } else {
            await client.app.log({
              body: {
                service: "voice-input",
                level: "warn",
                message: "No speech detected",
              },
            })
          }
        } catch (error) {
          isRecording = false
          await cleanupAudio()

          await client.app.log({
            body: {
              service: "voice-input",
              level: "error",
              message: "Voice input failed",
              extra: { error: String(error) },
            },
          })
        }
      }
    },
  }
}
