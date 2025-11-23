#ifndef AI_ASSISTANT_HPP
#define AI_ASSISTANT_HPP

#include <string>

class AiAssistant {
private:
    std::string apiKey;

public:
    // Constructor loads key from env variable
    AiAssistant();

    // Send a prompt and return the Gemini response
    std::string AiGivePrompt(const std::string& text);

private:
    // Internal helper to call Gemini API
    std::string askGemini(const std::string& userInput);

    // Curl callback
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp);
};

#endif
