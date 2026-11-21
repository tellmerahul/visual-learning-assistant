# Visual Learning Assistant  
Visual Learning Assistant is an AI-powered application that enables users to solve problems and learn interactively. Simply point your camera at a problem or object, and the app provides narrated solutions in real-time.  
Built on the advanced Gemini API, this tool combines cutting-edge AI capabilities with a user-friendly interface, making it ideal for learners, professionals, and curious minds.  
Live Demo: [Visual Learning Assistant](https://visual-learning-assistant.vercel.app/)  
---
## ✨ Features  
- **Camera or upload** — capture preview, confirm, then analyze (or pick an image file).  
- **Subject modes** — Auto, Math, Science, Language, Objects (tailored prompts).  
- **Gemini vision** — categorized `Type` + detailed explanation with TTS.  
- **Step navigator** — detect numbered steps; prev/next on screen or via voice.  
- **Voice commands** — optional listener: explain, repeat, steps, next, previous (Chrome/Edge).  
- **Follow-up chat** — ask more about the same image without recapturing.  
- **Copy / share** — export the explanation from the description panel.  
- **Production proxy** — optional `/api/analyze` and `/api/chat` on Vercel (`GEMINI_API_KEY` server-side).  
---
## 🎯 Use Cases  
1. Education  
   - Solve math problems, understand scientific concepts, and decode diagrams effortlessly.  
2. Professional Support  
   - Analyze technical issues and simplify workflows with guided explanations.  
3. Everyday Tasks  
   - Identify objects, translate signs, or explore unfamiliar topics with ease.  
---
## 🚀 How It Works  
1. Launch the App: Open the [Visual Learning Assistant](https://visual-learning-assistant.vercel.app/) on your device.  
2. Point Your Camera: Focus on the problem, object, or text.  
3. AI-Powered Processing: The Gemini API analyzes the input in real-time.  
4. Receive Solutions: Get narrated answers or step-by-step solutions on-screen.  
---
## 🛠️ Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/tellmerahul/visual-learning-assistant.git  
   cd visual-learning-assistant
   ```
2. Install dependencies and configure Gemini:
   ```bash
   npm install
   cp .env.example .env
   # Set REACT_APP_GEMINI_API_KEY in .env
   npm start
   ```

## Project structure

```
src/
  components/     # UI (camera, description, avatar, typewriter)
  hooks/          # Camera, speech, voice commands
  services/       # Gemini API, capture pipeline, TTS
  constants/      # Prompts and shared copy
  config/         # Environment validation
  App.js          # Layout and state wiring
```

## Scripts

| Command        | Description        |
|----------------|--------------------|
| `npm start`    | Dev server         |
| `npm run build`| Production build   |
| `npm test`     | Jest + RTL tests   |

## Security note

For production on Vercel, set `REACT_APP_USE_GEMINI_PROXY=true` and `GEMINI_API_KEY` in the Vercel dashboard (not `REACT_APP_*`). Local `npm start` still uses the client key unless you run `vercel dev`.
