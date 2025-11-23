const API_URL = 'http://localhost:3001/api';

class AIStudyAssistant {
    constructor() {
        this.session = null;
        this.notes = [];
        this.questions = [];
        this.exercises = [];
        this.score = 0;
        this.startTime = null;
        this.sessionTime = 0;
        this.currentMCQ = null;
        this.selectedAnswer = null;
        this.answerSubmitted = false;
        this.init();
    }

    init() {
        this.renderHome();
    }

    async callAPI(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const error = await response.json();
                console.error('Server Error:', error);
                alert(`Server Error: ${error.error || 'Unknown error'}`);
                throw new Error(error.error);
            }
            
            const result = await response.json();
            console.log('API Response:', result);
            return result;
        } catch (error) {
            console.error('API Error:', error);
            alert(`Error: ${error.message || 'Cannot connect to backend'}`);
            throw error;
        }
    }

    renderHome() {
        document.getElementById('app').innerHTML = `
            <!-- Hero Section -->
            <div class="max-w-7xl mx-auto px-8 py-20 pt-32">
                <div class="grid md:grid-cols-2 gap-16 items-center">
                    <!-- Left: Text Content -->
                    <div>
                        <h1 class="text-7xl font-bold text-white mb-6 leading-tight">
                            AI Study<br>
                            <span class="gradient-text">Assistant</span>
                        </h1>
                        <p class="text-xl text-white/70 mb-8 leading-relaxed">
                            Master any topic with AI-powered learning. Get personalized study plans, instant answers, and practice exercises tailored to your needs.
                        </p>
                        <button onclick="document.getElementById('topicInput').focus()" class="btn-gradient px-10 py-5 rounded-full text-white font-bold text-lg">
                            Start Learning
                        </button>
                    </div>
                    
                    <!-- Right: 3D Illustration -->
                    <div class="relative">
                        <div class="img-placeholder rounded-3xl aspect-square flex flex-col items-center justify-center gap-4">
                            <div class="text-9xl">🤖</div>
                            <div class="text-7xl">📖</div>
                        </div>
                        <div class="absolute -top-10 -right-10 text-6xl animate-bounce">💡</div>
                        <div class="absolute -bottom-10 -left-10 text-6xl" style="animation: bounce 3s ease-in-out infinite;">✨</div>
                    </div>
                </div>

                <!-- Topic Input Section -->
                <div class="mt-20 max-w-4xl mx-auto">
                    <div class="glass-card rounded-[40px] p-12 glow">
                        <h2 class="text-3xl font-bold text-white mb-8 text-center">What would you like to learn today?</h2>
                        <div class="space-y-6">
                            <input
                                type="text"
                                id="topicInput"
                                placeholder="Enter any topic: Physics, Machine Learning, History..."
                                class="w-full px-8 py-6 rounded-3xl glass-card-light text-white text-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onclick="app.startNewTopic()"
                                class="w-full py-6 btn-gradient text-white font-bold rounded-3xl text-xl hover:scale-[1.02] transition-all"
                            >
                                🚀 Generate Study Plan
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="mt-24">
                    <h2 class="text-4xl font-bold text-white text-center mb-16">Why Choose AI Study Assistant?</h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <!-- Feature 1 -->
                        <div class="glass-card-light rounded-3xl p-8 card-hover">
                            <div class="text-6xl mb-6">💬</div>
                            <h3 class="text-2xl font-bold text-white mb-4">AI Tutor</h3>
                            <p class="text-white/70 mb-6">Ask any question and get instant, accurate answers powered by advanced AI technology.</p>
                            <button class="btn-gradient px-6 py-3 rounded-full text-white font-semibold text-sm">
                                Learn More
                            </button>
                        </div>
                        
                        <!-- Feature 2 -->
                        <div class="glass-card-light rounded-3xl p-8 card-hover">
                            <div class="text-6xl mb-6">🎯</div>
                            <h3 class="text-2xl font-bold text-white mb-4">Practice Tests</h3>
                            <p class="text-white/70 mb-6">Test your knowledge with AI-generated exercises and track your progress in real-time.</p>
                            <button class="btn-pink px-6 py-3 rounded-full text-white font-semibold text-sm">
                                Try Now
                            </button>
                        </div>
                        
                        <!-- Feature 3 -->
                        <div class="glass-card-light rounded-3xl p-8 card-hover">
                            <div class="text-6xl mb-6">📝</div>
                            <h3 class="text-2xl font-bold text-white mb-4">Smart Notes</h3>
                            <p class="text-white/70 mb-6">Organize your learning with intelligent note-taking that helps you retain information better.</p>
                            <button class="btn-cyan px-6 py-3 rounded-full text-white font-semibold text-sm">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Topic Cards Grid -->
                <div class="mt-24">
                    <h2 class="text-4xl font-bold text-white text-center mb-16">Popular Topics</h2>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        ${['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Computer Science', 'Economics'].map((topic, idx) => `
                            <div class="glass-card-light rounded-3xl p-6 card-hover cursor-pointer" onclick="document.getElementById('topicInput').value='${topic}'; app.startNewTopic()">
                                <div class="img-placeholder rounded-2xl h-40 mb-4 flex items-center justify-center">
                                    <span class="text-5xl">${['📐', '⚛️', '🧪', '🧬', '📜', '📖', '💻', '📊'][idx]}</span>
                                </div>
                                <h3 class="text-xl font-bold text-white text-center">${topic}</h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showLoading() {
        const overlay = document.createElement('div');
        overlay.id = 'loading';
        overlay.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm';
        overlay.innerHTML = '<div class="loading"></div>';
        document.body.appendChild(overlay);
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.remove();
    }

    async startNewTopic() {
        const topic = document.getElementById('topicInput').value.trim();
        if (!topic) {
            alert('Please enter a topic');
            return;
        }

        this.showLoading();
        try {
            const result = await this.callAPI('/subtopics', { topic });
            this.hideLoading();
            this.renderSubtopicSelection(topic, result.subtopics);
        } catch (error) {
            this.hideLoading();
        }
    }

    renderSubtopicSelection(topic, subtopics) {
        document.getElementById('app').innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-8">
                <div class="max-w-5xl w-full">
                    <div class="text-center mb-12">
                        <h1 class="text-6xl font-bold text-white mb-4">${topic}</h1>
                        <p class="text-2xl text-white/70">Choose your learning path</p>
                    </div>

                    <div class="glass-card rounded-[40px] p-12 glow">
                        <div class="space-y-6 mb-8">
                            ${subtopics.map((sub, idx) => `
                                <button
                                    onclick="app.startSession('${topic}', \`${sub.replace(/`/g, '\\`')}\`)"
                                    class="w-full glass-card-light rounded-3xl p-8 text-left text-white transition-all hover:scale-[1.02] card-hover group"
                                >
                                    <div class="flex items-center gap-6">
                                        <div class="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                                            ${idx + 1}
                                        </div>
                                        <div class="flex-1 text-2xl font-semibold">${sub}</div>
                                        <div class="opacity-0 group-hover:opacity-100 transition-opacity text-4xl">→</div>
                                    </div>
                                </button>
                            `).join('')}
                        </div>

                        <button
                            onclick="app.renderHome()"
                            class="px-10 py-5 glass-card-light text-white rounded-3xl transition-all hover:scale-105 font-semibold text-xl"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    startSession(topic, subtopic) {
        this.session = { topic, subtopic };
        this.startTime = Date.now();
        this.notes = [];
        this.questions = [];
        this.exercises = [];
        this.score = 0;
        this.renderDashboard();
        this.startTimer();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.session && this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const mins = Math.floor(elapsed / 60);
                const secs = elapsed % 60;
                const timeEl = document.getElementById('sessionTime');
                if (timeEl) {
                    timeEl.textContent = `${mins}m ${secs}s`;
                }
            }
        }, 1000);
    }

    renderDashboard() {
        const correctCount = this.exercises.filter(e => e.correct).length;
        const accuracy = this.exercises.length > 0 ? Math.round((correctCount / this.exercises.length) * 100) : 0;

        document.getElementById('app').innerHTML = `
            <div class="min-h-screen p-6">
                <div class="max-w-[1600px] mx-auto">
                    <!-- Header -->
                    <div class="glass-card rounded-[40px] p-10 mb-8 glow">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="text-6xl font-bold text-white mb-3">${this.session.topic}</h1>
                                <p class="text-2xl text-white/80">${this.session.subtopic}</p>
                            </div>
                            <div class="text-right">
                                <div class="stat-number mb-2">${this.score}</div>
                                <div class="text-white/80 text-xl font-bold mb-2">POINTS</div>
                                <div class="text-white/60 text-lg" id="sessionTime">0m 0s</div>
                            </div>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div class="glass-card-light rounded-3xl p-8 card-hover text-center">
                            <div class="text-6xl mb-4">💬</div>
                            <div class="text-5xl font-bold text-white mb-2">${this.questions.length}</div>
                            <div class="text-white/70 text-lg font-medium">Questions</div>
                        </div>
                        <div class="glass-card-light rounded-3xl p-8 card-hover text-center">
                            <div class="text-6xl mb-4">📝</div>
                            <div class="text-5xl font-bold text-white mb-2">${this.notes.length}</div>
                            <div class="text-white/70 text-lg font-medium">Notes</div>
                        </div>
                        <div class="glass-card-light rounded-3xl p-8 card-hover text-center">
                            <div class="text-6xl mb-4">🎯</div>
                            <div class="text-5xl font-bold text-white mb-2">${this.exercises.length}</div>
                            <div class="text-white/70 text-lg font-medium">Exercises</div>
                        </div>
                        <div class="glass-card-light rounded-3xl p-8 card-hover text-center">
                            <div class="text-6xl mb-4">📊</div>
                            <div class="text-5xl font-bold text-white mb-2">${accuracy}%</div>
                            <div class="text-white/70 text-lg font-medium">Accuracy</div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="glass-card rounded-[40px] p-10">
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-16 h-16 rounded-2xl btn-cyan flex items-center justify-center text-4xl">💬</div>
                                <h3 class="text-3xl font-bold text-white">Ask AI Tutor</h3>
                            </div>
                            <textarea
                                id="questionInput"
                                placeholder="What would you like to know?"
                                class="w-full px-6 py-5 rounded-3xl glass-card-light text-white text-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 h-36 resize-none"
                            ></textarea>
                            <button
                                onclick="app.askQuestion()"
                                class="w-full py-5 btn-cyan text-white font-bold rounded-3xl text-xl hover:scale-[1.02] transition-all"
                            >
                                Get Answer
                            </button>
                        </div>

                        <div class="glass-card rounded-[40px] p-10">
                            <div class="flex items-center gap-4 mb-6">
                                <div class="w-16 h-16 rounded-2xl btn-pink flex items-center justify-center text-4xl">📝</div>
                                <h3 class="text-3xl font-bold text-white">Add Note</h3>
                            </div>
                            <textarea
                                id="noteInput"
                                placeholder="Write your study notes..."
                                class="w-full px-6 py-5 rounded-3xl glass-card-light text-white text-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6 h-36 resize-none"
                            ></textarea>
                            <button
                                onclick="app.addNote()"
                                class="w-full py-5 btn-pink text-white font-bold rounded-3xl text-xl hover:scale-[1.02] transition-all"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>

                    <!-- Exercise Button -->
                    <button
                        onclick="app.generateExercise()"
                        class="w-full py-8 btn-gradient text-white font-bold rounded-[40px] text-2xl hover:scale-[1.01] transition-all mb-8 glow"
                    >
                        <span class="text-4xl mr-3">🎯</span> Generate Practice Exercise
                    </button>

                    <!-- History -->
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="glass-card rounded-[40px] p-10 h-[600px] overflow-y-auto">
                            <h3 class="text-3xl font-bold text-white mb-8 sticky top-0 glass-card pb-4">💬 Q&A History</h3>
                            ${this.questions.length === 0 ? 
                                '<div class="text-center py-20"><p class="text-white/60 text-xl">No questions yet. Ask your first question!</p></div>' :
                                this.questions.map((qa, idx) => `
                                    <div class="glass-card-light rounded-3xl p-8 mb-6">
                                        <p class="text-white font-bold mb-4 text-xl">Q: ${qa.q}</p>
                                        <p class="text-white/80 leading-relaxed text-lg">A: ${qa.a}</p>
                                    </div>
                                `).join('')
                            }
                        </div>

                        <div class="glass-card rounded-[40px] p-10 h-[600px] overflow-y-auto">
                            <h3 class="text-3xl font-bold text-white mb-8 sticky top-0 glass-card pb-4">📝 Your Notes</h3>
                            ${this.notes.length === 0 ?
                                '<div class="text-center py-20"><p class="text-white/60 text-xl">No notes yet. Start taking notes!</p></div>' :
                                this.notes.map((n, idx) => `
                                    <div class="glass-card-light rounded-3xl p-8 mb-6">
                                        <p class="text-white text-lg"><span class="font-bold gradient-text text-2xl">${idx + 1}.</span> ${n}</p>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>

                    <!-- End Session -->
                    <button
                        onclick="app.endSession()"
                        class="w-full py-6 glass-card-light hover:bg-red-500/20 text-white hover:text-red-300 rounded-3xl transition-all border-2 border-transparent hover:border-red-500/50 font-semibold text-xl"
                    >
                        End Study Session
                    </button>
                </div>
            </div>
        `;
    }

    async askQuestion() {
        const question = document.getElementById('questionInput').value.trim();
        if (!question) {
            alert('Please enter a question');
            return;
        }

        this.showLoading();
        try {
            const result = await this.callAPI('/ask', {
                question,
                subtopic: this.session.subtopic
            });
            this.hideLoading();

            this.questions.push({ q: question, a: result.answer });
            document.getElementById('questionInput').value = '';
            this.renderDashboard();
        } catch (error) {
            this.hideLoading();
        }
    }

    addNote() {
        const note = document.getElementById('noteInput').value.trim();
        if (!note) {
            alert('Please enter a note');
            return;
        }

        this.notes.push(note);
        document.getElementById('noteInput').value = '';
        this.renderDashboard();
    }

    async generateExercise() {
        this.showLoading();
        try {
            const result = await this.callAPI('/generate-mcq', {
                subtopic: this.session.subtopic
            });
            this.hideLoading();
            this.renderExercise(result.mcq);
        } catch (error) {
            this.hideLoading();
        }
    }

    renderExercise(mcq) {
        document.getElementById('app').innerHTML = `
            <div class="min-h-screen flex items-center justify-center p-8">
                <div class="max-w-5xl w-full">
                    <div class="glass-card rounded-[40px] p-12 glow">
                        <div class="flex items-center justify-between mb-12">
                            <h2 class="text-5xl font-bold text-white">Practice Exercise</h2>
                            <div>
                                <div class="stat-number" id="scoreDisplay">${this.score}</div>
                                <div class="text-white/60 text-center text-lg">POINTS</div>
                            </div>
                        </div>
                        
                        <div class="glass-card-light p-12 rounded-[30px] mb-12">
                            <p class="text-3xl text-white mb-12 leading-relaxed font-medium">${mcq.question}</p>
                            
                            <div class="space-y-6" id="options">
                                ${mcq.options.map(opt => `
                                    <button
                                        onclick="app.selectAnswer('${opt.charAt(0)}')"
                                        data-option="${opt.charAt(0)}"
                                        class="option-btn w-full p-8 rounded-3xl text-left transition-all glass-card-light text-white hover:scale-[1.02] text-xl border-2 border-transparent hover:border-white/30"
                                    >
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                            
                            <div id="resultMessage" class="hidden mt-12"></div>
                        </div>

                        <div class="flex gap-6" id="actionButtons">
                            <button
                                onclick="app.submitAnswer('${mcq.correct}')"
                                id="submitBtn"
                                disabled
                                class="flex-1 py-6 btn-gradient hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-3xl font-bold transition-all text-xl"
                            >
                                Submit Answer
                            </button>
                            <button
                                onclick="app.renderDashboard()"
                                class="px-12 py-6 glass-card-light hover:scale-105 text-white rounded-3xl transition-all font-semibold text-xl"
                            >
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.currentMCQ = mcq;
        this.selectedAnswer = null;
        this.answerSubmitted = false;
    }

    selectAnswer(option) {
        if (this.answerSubmitted) return;
        
        this.selectedAnswer = option;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.dataset.option === option) {
                btn.className = 'option-btn w-full p-8 rounded-3xl text-left transition-all text-white text-xl border-2 border-white/50 bg-white/20 scale-[1.02]';
            } else {
                btn.className = 'option-btn w-full p-8 rounded-3xl text-left transition-all glass-card-light text-white hover:scale-[1.02] text-xl border-2 border-transparent hover:border-white/30';
            }
        });

        document.getElementById('submitBtn').disabled = false;
    }

    submitAnswer(correctAnswer) {
        if (!this.selectedAnswer || this.answerSubmitted) return;

        this.answerSubmitted = true;
        const isCorrect = this.selectedAnswer === correctAnswer;
        
        if (isCorrect) {
            this.score += 10;
        } else {
            this.score = Math.max(0, this.score - 2);
        }

        this.exercises.push({
            question: this.currentMCQ.question,
            correct: isCorrect
        });

        const resultDiv = document.getElementById('resultMessage');
        resultDiv.className = `mt-12 p-10 rounded-3xl ${isCorrect ? 'bg-green-500/20 border-2 border-green-400' : 'bg-red-500/20 border-2 border-red-400'}`;
        resultDiv.innerHTML = `
            <div class="flex items-center gap-8">
                <div class="w-24 h-24 rounded-full ${isCorrect ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'} flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
                    ${isCorrect ? '✓' : '✗'}
                </div>
                <div class="flex-1">
                    <div class="text-white font-bold text-4xl mb-3">
                        ${isCorrect ? 'Correct!' : 'Incorrect!'}
                    </div>
                    <div class="text-${isCorrect ? 'green' : 'red'}-200 text-2xl font-medium">
                        ${isCorrect ? '+10 points' : `-2 points`}
                    </div>
                    ${!isCorrect ? `<div class="text-red-200 mt-4 text-xl">Correct answer: <span class="font-bold text-2xl">${correctAnswer}</span></div>` : ''}
                </div>
            </div>
        `;
        resultDiv.classList.remove('hidden');

        document.querySelectorAll('.option-btn').forEach(btn => {
            const option = btn.dataset.option;
            btn.onclick = null;
            
            if (option === correctAnswer) {
                btn.className = 'option-btn w-full p-8 rounded-3xl text-left bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-300 text-xl font-bold';
            } else if (option === this.selectedAnswer && !isCorrect) {
                btn.className = 'option-btn w-full p-8 rounded-3xl text-left bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-300 text-xl';
            } else {
                btn.className = 'option-btn w-full p-8 rounded-3xl text-left glass-card-light text-white/40 text-xl';
            }
        });

        document.getElementById('scoreDisplay').textContent = this.score;

        document.getElementById('actionButtons').innerHTML = `
            <button
                onclick="app.generateExercise()"
                class="flex-1 py-6 btn-gradient hover:opacity-90 text-white rounded-3xl font-bold transition-all text-xl"
            >
                Next Question →
            </button>
            <button
                onclick="app.renderDashboard()"
                class="px-12 py-6 glass-card-light hover:scale-105 text-white rounded-3xl transition-all font-semibold text-xl"
            >
                Dashboard
            </button>
        `;
    }

    endSession() {
        if (confirm('End this study session?')) {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            this.session = null;
            this.renderHome();
        }
    }
}

// Initialize app
const app = new AIStudyAssistant();