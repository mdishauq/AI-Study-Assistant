#include "AiAssistant.hpp"
#include <iostream>
#include <cstdlib>
#include <curl/curl.h>
#include "json.hpp"

using json = nlohmann::json;

// ---- Curl write callback ----
size_t AiAssistant::WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

// ---- Constructor loads API key ----
AiAssistant::AiAssistant() {
    const char* apiKeyEnv = std::getenv("GEMINI_API_KEY");
    if (!apiKeyEnv) {
        std::cerr << "Error: GEMINI_API_KEY environment variable not set\n";
        std::cerr << "Set it with: export GEMINI_API_KEY=\"your_api_key_here\"\n";
        exit(1);
    }
    apiKey = apiKeyEnv;
}

// ---- Public Function for User ----
std::string AiAssistant::AiGivePrompt(const std::string& text) {
    return askGemini(text);
}

// ---- Internal Gemini API Call ----
std::string AiAssistant::askGemini(const std::string& userInput) {
    CURL* curl = curl_easy_init();
    std::string response;

    if(curl) {
        std::string url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
            + apiKey;

        // Request body JSON
        json requestJson = {
            {"contents", { {
                {"parts", { {
                    {"text", userInput}
                }} }
            } }}
        };

        std::string requestBody = requestJson.dump();

        struct curl_slist* headers = nullptr;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, requestBody.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        CURLcode res = curl_easy_perform(curl);

        if(res != CURLE_OK) {
            std::cerr << "curl error: " << curl_easy_strerror(res) << std::endl;
        }

        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    // Parse JSON response
    try {
        auto j = json::parse(response);
        return j["candidates"][0]["content"]["parts"][0]["text"];
    } catch (...) {
        return "Error parsing API response.\nRaw: " + response;
    }
}
