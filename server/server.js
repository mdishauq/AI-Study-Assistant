const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Path to compiled C++ executable
const CPP_EXECUTABLE = path.join(__dirname, '../cpp/ai_assistant');

let cppProcess = null;
let isReady = false;

// Start C++ backend on server start
function startCppBackend() {
    return new Promise((resolve, reject) => {
        console.log('Starting C++ backend...');
        cppProcess = spawn(CPP_EXECUTABLE);

        cppProcess.stdout.on('data', (data) => {
            const lines = data.toString().split('\n').filter(line => line.trim());
            
            lines.forEach(line => {
                try {
                    const response = JSON.parse(line);
                    if (response.status === 'ready') {
                        isReady = true;
                        console.log('✓ C++ backend is ready');
                        resolve();
                    }
                } catch (e) {
                    // Not JSON, regular output
                    console.log(`C++ Output: ${line}`);
                }
            });
        });

        cppProcess.stderr.on('data', (data) => {
            console.error(`C++ Error: ${data}`);
        });

        cppProcess.on('close', (code) => {
            console.log(`C++ process exited with code ${code}`);
            cppProcess = null;
            isReady = false;
        });

        // Timeout if not ready in 5 seconds
        setTimeout(() => {
            if (!isReady) {
                reject(new Error('C++ backend failed to start'));
            }
        }, 5000);
    });
}

// Send command to C++ and wait for response
function sendCommand(command) {
    return new Promise((resolve, reject) => {
        if (!cppProcess || !isReady) {
            reject(new Error('C++ backend not ready'));
            return;
        }

        const timeout = setTimeout(() => {
            reject(new Error('Command timeout - AI taking too long to respond'));
        }, 60000); // 60 second timeout (increased for slow API)

        const dataHandler = (data) => {
            clearTimeout(timeout);
            const lines = data.toString().split('\n').filter(line => line.trim());
            
            try {
                const response = JSON.parse(lines[0]);
                cppProcess.stdout.removeListener('data', dataHandler);
                resolve(response);
            } catch (e) {
                reject(new Error('Invalid response from C++ backend'));
            }
        };

        cppProcess.stdout.on('data', dataHandler);
        cppProcess.stdin.write(JSON.stringify(command) + '\n');
    });
}

// API Routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/subtopics', async (req, res) => {
    const { topic } = req.body;
    
    try {
        const response = await sendCommand({
            action: 'generate_subtopics',
            topic: topic
        });

        if (response.status === 'success') {
            // More robust parsing - handle multiple formats
            const text = response.subtopics;
            console.log('Raw subtopics text:', text);
            
            // Split by newlines and filter for lines with content
            let subtopics = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => {
                    // Handle different formats: •, -, *, 1., etc.
                    if (line.startsWith('•')) return line;
                    if (line.startsWith('-')) return '• ' + line.substring(1).trim();
                    if (line.startsWith('*')) return '• ' + line.substring(1).trim();
                    if (line.match(/^\d+\./)) return '• ' + line.substring(line.indexOf('.') + 1).trim();
                    // If no bullet, add one
                    return '• ' + line;
                });

            // Remove duplicates and empty entries
            subtopics = [...new Set(subtopics)].filter(s => s.length > 2);

            console.log('Parsed subtopics:', subtopics);

            // If we got fewer than 3 subtopics, something went wrong
            if (subtopics.length < 3) {
                console.error('Too few subtopics generated:', subtopics.length);
                // Generate fallback subtopics
                subtopics = [
                    `• Introduction to ${topic}`,
                    `• Core Concepts in ${topic}`,
                    `• Advanced ${topic} Topics`,
                    `• Practical Applications`,
                    `• ${topic} Summary and Review`
                ];
            }

            res.json({ subtopics });
        } else {
            res.status(500).json({ error: response.message });
        }
    } catch (error) {
        console.error('Subtopics error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ask', async (req, res) => {
    const { question, subtopic } = req.body;
    
    try {
        const response = await sendCommand({
            action: 'ask_question',
            question: question,
            subtopic: subtopic
        });

        if (response.status === 'success') {
            res.json({ answer: response.answer });
        } else {
            res.status(500).json({ error: response.message });
        }
    } catch (error) {
        console.error('Ask error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/generate-mcq', async (req, res) => {
    const { subtopic } = req.body;
    
    try {
        const response = await sendCommand({
            action: 'generate_mcq',
            subtopic: subtopic
        });

        if (response.status === 'success') {
            // Parse MCQ from text
            const mcqText = response.mcq;
            const lines = mcqText.split('\n').map(l => l.trim()).filter(l => l);
            
            let question = '';
            const options = [];
            let correct = 'A';

            for (const line of lines) {
                if (line.startsWith('Q:')) {
                    question = line.substring(2).trim();
                } else if (line.match(/^[A-D]\)/)) {
                    options.push(line);
                } else if (line.startsWith('Correct:')) {
                    const match = line.match(/Correct:\s*([A-D])/i);
                    if (match) correct = match[1].toUpperCase();
                }
            }

            res.json({
                mcq: {
                    question,
                    options: options.length === 4 ? options : ['A) Option A', 'B) Option B', 'C) Option C', 'D) Option D'],
                    correct
                }
            });
        } else {
            res.status(500).json({ error: response.message });
        }
    } catch (error) {
        console.error('MCQ error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/status', (req, res) => {
    res.json({ 
        running: cppProcess !== null,
        ready: isReady
    });
});

// Start server and C++ backend
async function startServer() {
    try {
        await startCppBackend();
        
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 AI Study Assistant is ready!`);
            console.log(`\n🌐 Open http://localhost:${PORT} in your browser\n`);
        });
    } catch (error) {
        console.error('Failed to start:', error);
        process.exit(1);
    }
}

// Cleanup on exit
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    if (cppProcess) {
        cppProcess.stdin.write('EXIT\n');
        cppProcess.kill();
    }
    process.exit(0);
});

startServer();