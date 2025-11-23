#ifndef TOPICCLASS_H
#define TOPICCLASS_H

#include <iostream>
#include <string>
#include <vector>

class Topic {

private:
    std::string name;                       // Topic name (e.g. Physics)
    std::vector<std::string> subtopics;     // Subtopic list (e.g. Thermodynamics, Optics...)
    std::string subtopic_list_text;         // Raw text from AI listing all subtopics
    std::string current_subtopic;           // What user selected to study now

public:

    // --- Constructors ---
    Topic() {}

    Topic(const std::string& topicname)
        : name(topicname) {}



    // --- Topic Name ---
    void setTopicName(const std::string& topicname) {
        name = topicname;
    }

    std::string getTopicName() const {
        return name;
    }



    // --- Subtopic List Raw Text (AI Response) ---
    void setSubtopicList(const std::string& text) {
        subtopic_list_text = text;
    }

    std::string getSubtopicList() const {
        return subtopic_list_text;
    }



    // --- Subtopic Vector Handling ---
    void addSubtopic(const std::string& subtopic) {
        subtopics.push_back(subtopic);
    }

    const std::vector<std::string>& getSubtopics() const {
        return subtopics;
    }



    // --- Select a subtopic to study ---
    bool selectSubtopic(const std::string& subtopic) {
        for (const auto& s : subtopics) {
            if (s == subtopic) {
                current_subtopic = subtopic;
                return true;  // Selection successful
            }
        }
        return false; // Selected subtopic is not in the list
    }

    std::string getCurrentSubtopic() const {
        return current_subtopic;
    }

};

#endif
