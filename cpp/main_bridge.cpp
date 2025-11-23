#include <iostream>
#include <string>
#include <sstream>
#include "AiAssistant.hpp"
#include "TopicClass.hpp"
#include "TopicSession.hpp"
#include "json.hpp"

using json = nlohmann::json;

// Helper to parse JSON commands from Node.js
void handleCommand(const std::string& input, AiAssistant& ai) {
    try {
        json cmd = json::parse(input);
        std::string action = cmd["action"];
        json response;

        if (action == "generate_subtopics") {
            std::string topic = cmd["topic"];
            std::string prompt = "List exactly 5 subtopics in " + topic + 
                               ". Format each line as: • Subtopic Name" +
                               "\nExample format:\n• First Subtopic\n• Second Subtopic\n" +
                               "Do not add any extra text, explanations, or numbering. Only bullet points.";
            
            std::string result = ai.AiGivePrompt(prompt);
            
            // Debug: log the raw result
            std::cerr << "DEBUG: Raw AI response: " << result << std::endl;
            
            response["status"] = "success";
            response["subtopics"] = result;
        }
        else if (action == "ask_question") {
            std::string question = cmd["question"];
            std::string subtopic = cmd["subtopic"];
            
            std::string prompt = "Answer this question about " + subtopic + ": " + question;
            std::string result = ai.AiGivePrompt(prompt);
            
            response["status"] = "success";
            response["answer"] = result;
        }
        else if (action == "generate_mcq") {
            std::string subtopic = cmd["subtopic"];
            
            std::string prompt =
                "Generate ONE multiple-choice question (MCQ) for the topic '" +
                subtopic +
                "' with exactly:\n"
                "- 1 correct answer\n"
                "- 3 incorrect answers\n"
                "Format strictly as:\n"
                "Q: <question text>\n"
                "A) <option>\n"
                "B) <option>\n"
                "C) <option>\n"
                "D) <option>\n"
                "Correct: <A/B/C/D>\n";
            
            std::string result = ai.AiGivePrompt(prompt);
            
            response["status"] = "success";
            response["mcq"] = result;
        }
        else {
            response["status"] = "error";
            response["message"] = "Unknown action: " + action;
        }

        // Send response back to Node.js
        std::cout << response.dump() << std::endl;
        std::cout.flush();

    } catch (const std::exception& e) {
        json error;
        error["status"] = "error";
        error["message"] = std::string(e.what());
        std::cout << error.dump() << std::endl;
        std::cout.flush();
    }
}

int main() {
    AiAssistant ai;
    std::string line;

    // Signal ready to Node.js
    json ready;
    ready["status"] = "ready";
    std::cout << ready.dump() << std::endl;
    std::cout.flush();

    // Listen for commands from Node.js
    while (std::getline(std::cin, line)) {
        if (line.empty()) continue;
        if (line == "EXIT") break;
        
        handleCommand(line, ai);
    }

    return 0;
}