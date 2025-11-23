#include "TopicSession.hpp"
#include "AiAssistant.hpp"
#include <iostream>
#include <sstream>
#include <cctype>
#include <algorithm>

static std::string trim(const std::string &s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    size_t end   = s.find_last_not_of(" \t\r\n");
    if (start == std::string::npos) return "";
    return s.substr(start, end - start + 1);
}

TopicSession::TopicSession(Topic* topicPtr)
    : topic(topicPtr), progressScore(0) {}

void TopicSession::startSession() {
    currentSubtopic = topic->getCurrentSubtopic();
    startTime = std::chrono::system_clock::now();
}

void TopicSession::endSession() {
    endTime = std::chrono::system_clock::now();
}

long long TopicSession::getSessionDurationSeconds() {
    return std::chrono::duration_cast<std::chrono::seconds>(endTime - startTime).count();
}

void TopicSession::addQuestion(const std::string& q, const std::string& aiAns) {
    questionsAsked.push_back(q);
    aiAnswers.push_back(aiAns);
}

void TopicSession::addNote(const std::string& note) {
    userNotes.push_back(note);
}

void TopicSession::displayNotes() const {
    if (userNotes.empty()) {
        std::cout << "\nNo notes added yet.\n";
        return;
    }

    std::cout << "\n------ YOUR NOTES ------\n";
    for (size_t i = 0; i < userNotes.size(); i++) {
        std::cout << i + 1 << ". " << userNotes[i] << "\n";
    }
}

TopicSession::MCQ TopicSession::generateMCQExercise() {
    MCQ mcq;

    std::string prompt =
        "Generate ONE multiple-choice question (MCQ) for the topic '" +
        currentSubtopic +
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

    AiAssistant ai;
    std::string result = ai.AiGivePrompt(prompt);

    std::istringstream iss(result);
    std::string line;

    // ---- Parse Q: line safely ----
    while (std::getline(iss, line)) {
        line = trim(line);
        if (line.rfind("Q:", 0) == 0) {  // starts with "Q:"
            mcq.question = trim(line.substr(2));
            break;
        }
    }

    // ---- Parse A/B/C/D options ----
    int optionCount = 0;
    while (std::getline(iss, line) && optionCount < 4) {
        line = trim(line);
        if (line.rfind("A)", 0) == 0 ||
            line.rfind("B)", 0) == 0 ||
            line.rfind("C)", 0) == 0 ||
            line.rfind("D)", 0) == 0) 
        {
            mcq.options.push_back(line);
            optionCount++;
        }
    }

    // If missing options, fill dummy ones
    while (mcq.options.size() < 4) {
        mcq.options.push_back("X) (invalid AI option)");
    }

    // ---- Parse Correct: ----
    while (std::getline(iss, line)) {
        line = trim(line);
        if (line.rfind("Correct", 0) == 0) {
            char last = line.back();
            if (std::isalpha(last))
                mcq.correctOption = toupper(last);
            else
                mcq.correctOption = 'A'; // fallback
            break;
        }
    }

    if (!std::isalpha(mcq.correctOption))
        mcq.correctOption = 'A';

    return mcq;
}

bool TopicSession::checkUserAnswer(const MCQ& mcq, char userAns) {
    return (toupper(userAns) == mcq.correctOption);
}

void TopicSession::submitExerciseAnswer(const MCQ& mcq, char userAns) {
    ExerciseEntry e;

    e.question = mcq.question;
    e.correctAnswer = std::string(1, mcq.correctOption);
    e.userAnswer = std::string(1, toupper(userAns));
    e.score = (toupper(userAns) == mcq.correctOption) ? 1 : 0;

    exercises.push_back(e);

    // update scores
    if (e.score == 1)
        progressScore += 10;
    else
        progressScore -= 2;

    if (progressScore < 0)
        progressScore = 0;
}

std::string TopicSession::getCurrentSubtopic() const {
    return currentSubtopic;
}

Topic* TopicSession::getTopic() const {
    return topic;
}

void TopicSession::displayProgress() const {
    std::cout << "\n----- SESSION PROGRESS -----\n";
    std::cout << "Topic       : " << topic->getTopicName() << "\n";
    std::cout << "Subtopic    : " << currentSubtopic << "\n";

    auto now = std::chrono::system_clock::now();
    long long duration =
        std::chrono::duration_cast<std::chrono::seconds>(now - startTime).count();

    std::cout << "Time spent  : " << duration << " seconds\n";

    std::cout << "\nQuestions asked : " << questionsAsked.size();
    std::cout << "\nNotes written   : " << userNotes.size();
    std::cout << "\nExercises taken : " << exercises.size();

    int correct = 0;
    for (const auto& e : exercises) {
        if (e.score == 1) correct++;
    }

    std::cout << "\nCorrect answers : " << correct;
    std::cout << "\nWrong answers   : " << exercises.size() - correct;

    std::cout << "\n\nProgress Score  : " << progressScore;
    std::cout << "\n------------------------------\n";
}
