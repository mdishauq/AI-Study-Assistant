# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++11 -Wall -I.
LDFLAGS = -lcurl

# Source files
SOURCES = main_bridge.cpp AiAssistant.cpp TopicSession.cpp
OBJECTS = $(SOURCES:.cpp=.o)
EXECUTABLE = ai_assistant

# Default target
all: $(EXECUTABLE)

# Link
$(EXECUTABLE): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(EXECUTABLE) $(LDFLAGS)

# Compile
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean
clean:
	rm -f $(OBJECTS) $(EXECUTABLE)

# Rebuild
rebuild: clean all

.PHONY: all clean rebuild