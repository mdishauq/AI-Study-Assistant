# 🤖 AI Study Assistant

> A C++ console application transformed into a modern web app using AI-assisted development

## 📖 About

I built this project in two phases:

**Phase 1 (My Work):** Created a C++ console application with:
- Topic & subtopic management
- Google Gemini AI integration for Q&A
- MCQ exercise generation
- Note-taking system
- Progress tracking with scoring

**Phase 2 (AI-Assisted):** Used Claude AI to build a modern web wrapper that connects my C++ backend to a beautiful frontend, making the console app accessible through a browser with a stunning purple gradient UI.

## ✨ Features

- 🎯 **AI-Powered Learning** - Get personalized study plans for any topic
- 💬 **Interactive Q&A** - Ask questions, get instant AI answers
- 📝 **Smart Notes** - Take and organize study notes
- 🎓 **Practice Exercises** - AI-generated multiple choice questions
- 📊 **Progress Tracking** - Real-time scores and accuracy metrics
- 🎨 **Modern UI** - Beautiful glassmorphic design with animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- C++ compiler (g++)
- libcurl library
- Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-study-assistant.git
cd ai-study-assistant

# Set API key (Windows)
set GEMINI_API_KEY=your_api_key_here

# Set API key (Mac/Linux)
export GEMINI_API_KEY="your_api_key_here"

# Compile C++ backend
cd cpp
make

# Install Node.js dependencies
cd ../server
npm install

# Run the app
npm start
```

Open `http://localhost:3001` in your browser!

## 📁 Project Structure

```
ai-study-assistant/
├── cpp/                    # C++ Backend (I wrote this)
│   ├── AiAssistant.cpp    # Gemini API integration
│   ├── TopicSession.cpp   # Session management
│   ├── TopicClass.hpp     # Data structures
│   └── main_bridge.cpp    # Node.js bridge
├── server/                 # Node.js Wrapper (AI-generated)
│   └── server.js          # Express API server
└── public/                 # Frontend (AI-generated)
    ├── index.html         # UI structure
    └── app.js             # Client logic
```

## 🛠️ Tech Stack

**My C++ Backend:**
- C++11, libcurl, nlohmann/json
- Google Gemini 2.5 Flash API

**AI-Generated Web Layer:**
- Node.js, Express
- HTML5, CSS3, JavaScript
- Tailwind CSS

## 🎮 How to Use

1. **Enter a topic** (e.g., "Machine Learning")
2. **Select a subtopic** from AI-generated list
3. **Study dashboard** opens with:
   - Ask questions → Get AI answers
   - Take notes → Save important info
   - Generate exercises → Test your knowledge
4. **Track progress** with real-time scores


## 💡 What I Learned

- **C++ Development:** Building complex backend systems
- **API Integration:** Working with Google Gemini AI
- **AI-Assisted Dev:** Using AI to accelerate web development
- **Full-Stack:** Connecting C++ backend to modern frontend
- **Hybrid Approach:** Combining manual coding with AI assistance

## 🎯 Why This Approach?

**C++ for backend:**
- Full control over AI integration
- Strong foundation in systems programming
- Performance and reliability

**AI for web wrapper:**
- Rapid frontend development
- Modern UI/UX best practices
- Focus on core logic, not styling

**Result:** Best of both worlds - solid backend + beautiful interface!

## 🐛 Troubleshooting

**API key error:**
```bash
# Make sure environment variable is set
echo $GEMINI_API_KEY  # Mac/Linux
echo %GEMINI_API_KEY% # Windows
```

**Compilation fails:**
```bash
# Install libcurl
# Windows: pacman -S mingw-w64-x86_64-curl
# Mac: brew install curl
# Linux: sudo apt-get install libcurl4-openssl-dev
```

**Port in use:**
```javascript
// Change port in server/server.js
const PORT = process.env.PORT || 3001;
```

## 🤝 Contributing

Contributions welcome! Feel free to:
1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - See [LICENSE](LICENSE) file

## 👨‍💻 Author

**Your Name**
- GitHub: [@mdishauq](https://github.com/mdishauq)
- Email: mdishauq619@gmail.com

## 🙏 Acknowledgments

- Google Gemini AI - For AI capabilities
- Claude AI - For web wrapper assistance
- nlohmann/json - For C++ JSON parsing

## ⭐ Support

Give a ⭐ if this project helped you learn about hybrid development!

---

<div align="center">

**Built with 🧠 C++ + 🤖 AI Assistance**

[⬆ back to top](#-ai-study-assistant)

</div>
