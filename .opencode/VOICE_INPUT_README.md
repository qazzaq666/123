# OpenCode Voice Input Plugin

Плагин для голосового ввода запросов в OpenCode. Работает полностью локально без API ключей.

## Требования

- **ffmpeg** — для записи аудио с микрофона
- **pocketsphinx** — для распознавания речи (offline)

## Установка зависимостей

### macOS
```bash
brew install ffmpeg pocketsphinx
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install ffmpeg pocketsphinx
```

### Windows
1. Установи [ffmpeg](https://ffmpeg.org/download.html)
2. Установи [pocketsphinx](https://github.com/cmusphinx/pocketsphinx)

Или через Chocolatey:
```bash
choco install ffmpeg pocketsphinx
```

## Использование

1. Убедись, что плагин загружен в OpenCode (файл `.opencode/plugins/voice-input.ts`)
2. В чате OpenCode введи команду:
   ```
   /voice
   ```
3. Говори в микрофон в течение 5 секунд
4. Распознанный текст автоматически добавится в чат

## Как это работает

1. **Запись** — ffmpeg записывает аудио с микрофона (5 секунд)
2. **Распознавание** — pocketsphinx преобразует аудио в текст (offline)
3. **Вставка** — текст добавляется в чат OpenCode

## Логирование

Все события логируются в OpenCode. Проверь логи если что-то не работает:
- Запись аудио
- Распознавание речи
- Ошибки

## Ограничения

- Работает только на английском языке (по умолчанию в pocketsphinx)
- Максимум 5 секунд записи
- Требует установленные ffmpeg и pocketsphinx

## Улучшения

Можно добавить:
- Поддержку других языков
- Настраиваемую длительность записи
- Визуальный индикатор записи
- Отмену записи (Ctrl+C)
