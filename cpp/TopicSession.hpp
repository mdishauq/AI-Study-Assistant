#ifndef TOPICSESSION_H
#define TOPICSESSION_H

#include <string>
#include <vector>
#include <chrono>
#include "TopicClass.hpp"

class TopicSession {
private:
    // Core session data
    Topic* topic;
    std::string currentSubtopic;
    int progressScore = 0;

    std::chrono::system_clock::time_point startTime;
    std::chrono::system_clock::time_point endTime;

    // Tracking learning
    std::vector<std::string> questionsAsked;
    std::vector<std::string> aiAnswers;
    std::vector<std::string> userNotes;

public:
    // Exercise result record
    struct ExerciseEntry {
        std::string question;
        std::string correctAnswer;
        std::string userAnswer;
        int score;  // 1 = correct, 0 = wrong
    };

    // MCQ structure returned by generator
    struct MCQ {
        std::string question;
        std::vector<std::string> options;   // A, B, C, D
        char correctOption;                 // 'A' 'B' 'C' 'D'
    };

private:
    std::vector<ExerciseEntry> exercises;

public:
    // Constructor
    TopicSession(Topic* topic);

    // Session control
    void startSession();
    void endSession();
    long long getSessionDurationSeconds();

    // Question-Answer tracking
    void addQuestion(const std::string& userQ, const std::string& aiAns);

    // Notes
    void addNote(const std::string& note);
    void displayNotes() const;

    // Exercise / MCQ
    MCQ generateMCQExercise();
    bool checkUserAnswer(const MCQ& mcq, char userAns);
    void submitExerciseAnswer(const MCQ& mcq, char userAns);

    // Getters
    std::string getCurrentSubtopic() const;
    Topic* getTopic() const;

    // Progress
    void displayProgress() const;
};

#endif
