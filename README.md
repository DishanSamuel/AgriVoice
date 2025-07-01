# AgriVoice 🌾📞
**Bridging AI and Rural Communities via a Simple Phone Call**

AgriVoice is an AI-powered voice assistant designed for rural and remote communities—especially farmers—who lack access to smartphones or internet connectivity. Using only a basic phone, users can call, ask a question, and receive an AI-generated answer—all through voice.

---

## 🚜 Why AgriVoice?

In many rural regions, smartphones, internet access, and digital literacy are limited—but basic mobile phones are common. AgriVoice helps bridge this digital divide by allowing users to get intelligent answers from AI using just a regular phone call.

---

## 🎙️ How It Works

1. The user calls a designated phone number.
2. They ask their question verbally (e.g., "When should I plant rice this season?").
3. They hang up after speaking.
4. AgriVoice processes the voice message using AI.
5. The AI calls back with a spoken response.

✅ **No smartphone. No internet. Just voice.**

---

## 🚀 Features

- 📞 **Phone-based access**  
  Works with any basic mobile phone—no data or apps required.

- 🧠 **AI-powered answers**  
  Leveraging state-of-the-art language models to generate accurate and contextual answers.

- 🌍 **Designed for rural use**  
  Requires minimal infrastructure. Optimized for low-connectivity environments.

- 🔄 **Two-way voice flow**  
  Speak your question. Get a callback with the answer.

- 👨‍🌾 **Farmer-first focus**  
  Handles agriculture-specific queries like crop care, pest control, weather updates, irrigation, etc.

- 🔧 **Easily extensible**  
  Modular design makes it easy to expand into healthcare, education, local governance, and more.

---
## 🧰 Technologies Used

  - ☁️ Twilio / Vonage / Exotel
    Used for managing phone call flows — incoming calls, voice recording, and outbound responses.

  - 🎙️ Whisper / Google Speech-to-Text
    Converts users’ spoken questions into text. These ASR (Automatic Speech Recognition) tools support multiple languages and accents.

  - 🧠 OpenAI GPT / Custom LLMs
    Powers the brain of the system. These large language models generate relevant, natural-language answers based on user queries.

  - 🔊 Text-to-Speech (TTS)
    Converts the AI's text response back into speech for the voice callback. Options include:
    ElevenLabs (high quality, multilingual)

---

## 📦 Installation

> **Note:** This is a simplified setup. Your actual implementation require you to setup your .env file with all the relevent API Keys in it

```bash
https://github.com/DishanSamuel/AgriVoice.git
cd AgriVoice
npm run dev
