import type { Plugin } from "@opencode-ai/plugin"

export const VoiceInputPlugin: Plugin = async ({ client }) => {
  return {
    "tui.command.execute": async (input, output) => {
      // Активируем голосовой ввод командой /voice
      if (input.command === "/voice") {
        await client.app.log({
          body: {
            service: "voice-input",
            level: "info",
            message: "Voice input plugin loaded. Type your message instead of using voice for now.",
          },
        })
      }
    },
  }
}
