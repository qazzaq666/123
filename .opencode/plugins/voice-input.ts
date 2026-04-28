import type { Plugin } from "@opencode-ai/plugin"
import * as path from "path"

export const VoiceInputPlugin: Plugin = async ({ client, $, directory }) => {
  const scriptPath = path.join(directory, ".opencode", "voice_recognition.py")

  return {
    "tui.command.execute": async (input, output) => {
      if (input.command === "/voice") {
        try {
          await client.app.log({
            body: {
              service: "voice-input",
              level: "info",
              message: "Recording for 5 seconds... Speak now!",
            },
          })

          // Запускаем Python скрипт для записи и распознавания
          const result = await $`python "${scriptPath}" 5`
          const recognizedText = result.stdout.toString().trim()

          if (recognizedText) {
            // Добавляем распознанный текст в промпт
            output.text = recognizedText

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
