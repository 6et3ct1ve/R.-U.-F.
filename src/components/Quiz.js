import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = ({ facts, onClose, user }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  // Generate fake facts for wrong answers - common myths
  const generateFakeFacts = () => {
    return [
      "Goldfish have a memory span of only 3 seconds",
      "The Great Wall of China is visible from the Moon with the naked eye", 
      "We only use 10% of our brain",
      "Lightning never strikes the same place twice",
      "Bulls hate the color red",
      "You must wait 24 hours before filing a missing person report",
      "Cracking knuckles causes arthritis",
      "Hair and nails continue growing after death",
      "Bats are blind",
      "Napoleon was unusually short",
      "Vikings wore horned helmets",
      "Einstein failed math in school",
      "You swallow 8 spiders per year while sleeping",
      "The five second rule protects food from germs",
      "Shaving makes hair grow back thicker"
    ];
  };

  // Generate quiz questions from facts
  const generateQuestions = () => {
    if (!facts || facts.length < 3) return [];
    
    const fakeFacts = generateFakeFacts();
    
    return facts.slice(0, 3).map((fact, index) => {
      // Create different question types
      const questionTypes = [
        {
          // Type 1: Which statement is authentic
          type: 'verify',
          question: `FILE #${String(index + 1).padStart(3, '0')}: IDENTIFY AUTHENTIC DATA`,
          description: 'FOUR STATEMENTS DETECTED. ONLY ONE CONTAINS VERIFIED INFORMATION.',
          instruction: 'SELECT THE AUTHENTIC STATEMENT',
          options: [
            { 
              text: `${fact.text.length > 100 ? fact.text.substring(0, 100) + '...' : fact.text}`, 
              correct: true 
            },
            { 
              text: `${fakeFacts[(index * 3) % fakeFacts.length]}`, 
              correct: false 
            },
            { 
              text: `${fakeFacts[(index * 3 + 1) % fakeFacts.length]}`, 
              correct: false 
            },
            { 
              text: `${fakeFacts[(index * 3 + 2) % fakeFacts.length]}`, 
              correct: false 
            }
          ].map((opt, i) => ({
            ...opt,
            text: `[STATEMENT ${String.fromCharCode(65 + i)}] - ${opt.text}`
          }))
        },
        {
          // Type 2: Which fact is real
          type: 'identify',
          question: `SECURITY CHECK #${String(index + 1).padStart(3, '0')}: IDENTIFY AUTHENTIC FILE`,
          description: 'ONE FILE CONTAINS VERIFIED DATA. OTHERS ARE CONTAMINATED.',
          instruction: 'SELECT AUTHENTIC RECORD',
          options: [
            { text: `[FILE A] - ${fact.text.substring(0, 100)}...`, correct: true },
            { text: `[FILE B] - ${fakeFacts[index % fakeFacts.length]}`, correct: false },
            { text: `[FILE C] - ${fakeFacts[(index + 1) % fakeFacts.length]}`, correct: false },
            { text: `[FILE D] - ${fakeFacts[(index + 2) % fakeFacts.length]}`, correct: false }
          ]
        },
        {
          // Type 3: Complete the fact
          type: 'decrypt',
          question: `DECRYPTION TASK #${String(index + 1).padStart(3, '0')}: RECOVER LOST DATA`,
          description: `FILE START: "${fact.text.split(' ').slice(0, Math.min(10, Math.floor(fact.text.split(' ').length / 2))).join(' ')}..."`,
          instruction: 'DECRYPT REMAINING DATA',
          options: generateDecryptOptions(fact.text)
        }
      ];
      
      // Select question type based on index
      const selectedType = questionTypes[index % questionTypes.length];
      
      // Return complete question object with shuffled options
      return {
        question: selectedType.question,
        description: selectedType.description,
        instruction: selectedType.instruction,
        type: selectedType.type,
        fullFact: fact.text,
        options: selectedType.options.sort(() => Math.random() - 0.5)
      };
    });
  };

  // Generate decryption options for a fact
  const generateDecryptOptions = (fullText) => {
    const words = fullText.split(' ');
    const startLength = Math.min(10, Math.floor(words.length / 2));
    const remainingText = words.slice(startLength).join(' ');
    
    return [
      { text: `[DECRYPTED] - ...${remainingText}`, correct: true },
      { text: '[CORRUPTED] - ...signal lost in anomalous field interference', correct: false },
      { text: '[REDACTED] - ...content classified above current clearance level', correct: false },
      { text: '[DAMAGED] - ...file termination due to radiation exposure', correct: false }
    ];
  };

  const questions = generateQuestions();

  // Handle answer selection
  const handleAnswer = (optionIndex, isCorrect) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers, { correct: isCorrect }];
    setAnswers(newAnswers);
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        // Add visual feedback
        const card = document.querySelector('.quiz-container .card');
        if (card) {
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = 'terminalBoot 0.3s ease-in';
          }, 10);
        }
      } else {
        submitQuiz(newAnswers);
      }
    }, 2000); // Increased delay to read the answer
  };

  // Submit quiz results
  const submitQuiz = async (finalAnswers) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/quiz/submit', { 
        answers: finalAnswers 
      });
      setQuizScore(response.data);
      setTimeout(() => {
        setIsLoading(false);
        setShowResult(true);
      }, 1000);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsLoading(false);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuizScore(null);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="card" style={{ 
          background: 'rgba(10, 10, 10, 0.95)', 
          border: '2px solid #00ff00',
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
        }}>
          <div className="card-body text-center py-5">
            <div className="terminal-glow">
              <pre style={{ color: '#00ff00', fontSize: '1.1em' }}>
{`PROCESSING RESULTS...
[████████████████████] 100%

CALCULATING EFFICIENCY...
ANALYZING PERFORMANCE...
GENERATING REPORT...`}
              </pre>
              <div className="spinner-border text-success mt-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
          
          <div className="card-footer" style={{ 
            background: 'rgba(0,0,0,0.8)', 
            borderTop: '1px solid #00ff00',
            color: '#666',
            fontSize: '0.8em'
          }}>
            <div className="text-center">
              <span className="me-3">◆ SESSION ID: #{Math.floor(Math.random() * 99999).toString().padStart(5, '0')}</span>
              <span className="me-3">◆ DATE: {new Date().toLocaleDateString()}</span>
              <span>◆ TIME: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center text-white">
        <pre className="terminal-glow" style={{ fontSize: '1.2em' }}>
{`INSUFFICIENT DATA FOR TRAINING MODE
MINIMUM 3 FILES REQUIRED
[LOAD MORE DATA TO CONTINUE]`}
        </pre>
        <button className="btn btn-gradient mt-3" onClick={onClose}>
          <span className="me-2">◄</span> RETURN
        </button>
      </div>
    );
  }

  if (showResult && quizScore) {
    return (
      <div className="quiz-container">
        <div className="card" style={{ 
          background: 'rgba(10, 10, 10, 0.95)', 
          border: '2px solid #00ff00',
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)'
        }}>
          <div className="card-body text-center py-5">
            <h2 className="mb-4 terminal-glow">
              <span style={{ color: '#ff6600' }}>[</span>
              TRAINING COMPLETE
              <span style={{ color: '#ff6600' }}>]</span>
            </h2>
            
            <div className="mb-4">
              <div className="display-1" style={{ color: '#00ff00', textShadow: '0 0 20px #00ff00' }}>
                {quizScore.score}/{quizScore.total}
              </div>
              <p className="lead" style={{ color: '#00ff00' }}>EFFICIENCY: {quizScore.percentage}%</p>
              <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
                <span style={{ color: '#ff6600' }}>▶ RANK: </span>
                <span style={{ color: '#00ff00', textTransform: 'uppercase' }}>
                  {quizScore.percentage >= 80 ? 'MASTER STALKER' : 
                   quizScore.percentage >= 60 ? 'EXPERIENCED' : 
                   quizScore.percentage >= 40 ? 'ROOKIE' : 'RECRUIT'}
                </span>
              </div>
              
              <div className="mt-3" style={{ fontSize: '0.8em', color: '#666' }}>
                <pre style={{ margin: 0 }}>
{`━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERFORMANCE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORRECT ANSWERS......${quizScore.score}
INCORRECT ANSWERS....${quizScore.total - quizScore.score}
ACCURACY RATING......${quizScore.percentage}%
CLEARANCE LEVEL......${quizScore.percentage >= 80 ? 'ALPHA' : 
                       quizScore.percentage >= 60 ? 'BETA' : 
                       quizScore.percentage >= 40 ? 'GAMMA' : 'DELTA'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}
                </pre>
                
                <div className="mt-3" style={{ color: quizScore.percentage >= 60 ? '#00ff00' : '#ff6600' }}>
                  {quizScore.percentage >= 80 && "◆ EXCEPTIONAL PERFORMANCE. ACCESS TO CLASSIFIED FILES GRANTED."}
                  {quizScore.percentage >= 60 && quizScore.percentage < 80 && "◆ SATISFACTORY RESULTS. STANDARD ACCESS MAINTAINED."}
                  {quizScore.percentage >= 40 && quizScore.percentage < 60 && "◆ BELOW AVERAGE. ADDITIONAL TRAINING RECOMMENDED."}
                  {quizScore.percentage < 40 && "◆ INSUFFICIENT PERFORMANCE. REPORT TO TRAINING FACILITY."}
                </div>
              </div>
            </div>
            
            {user && (
              <p className="text-muted mb-4" style={{ color: '#ff6600' }}>
                STALKER {user.username.toUpperCase()} - SESSION RECORDED
              </p>
            )}
            
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-gradient" onClick={resetQuiz}>
                <span className="me-2">↻</span>
                RETRY TRAINING
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                <span className="me-2">◄</span>
                EXIT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="card">
        <div className="card-header bg-gradient text-white" style={{ background: 'rgba(0,0,0,0.9)', borderBottom: '2px solid #00ff00' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 terminal-glow">
              <span style={{ color: '#ff6600' }}>[</span>
              TRAINING MODE ACTIVE
              <span style={{ color: '#ff6600' }}>]</span>
            </h5>
            <button 
              className="btn btn-sm btn-light" 
              onClick={onClose}
              style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00' }}
            >
              <span>✗</span>
            </button>
          </div>
        </div>
        
        <div className="card-body">
          {/* Difficulty selector */}
          <div className="mb-3">
            <label className="form-label" style={{ color: '#00ff00' }}>DIFFICULTY LEVEL:</label>
            <select 
              className="form-select form-select-sm w-auto"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={currentQuestion > 0}
              style={{ background: 'rgba(0,0,0,0.8)', color: '#00ff00', border: '1px solid #00ff00' }}
            >
              <option value="easy">RECRUIT - BASIC TRAINING</option>
              <option value="medium">STALKER - STANDARD MODE</option>
              <option value="hard">MASTER - EXPERT ONLY</option>
            </select>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div style={{ fontSize: '0.8em', color: '#ff6600', marginBottom: '5px' }}>
              TRAINING PROGRESS: {Math.round(progress)}%
            </div>
            <div className="quiz-progress">
              <div 
                className="quiz-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-4">
            <h6 className="text-muted mb-2" style={{ color: '#ff6600', textTransform: 'uppercase' }}>
              QUESTION {currentQuestion + 1} OF {questions.length}
            </h6>
            <h5 className="terminal-glow" style={{ color: '#00ff00', marginBottom: '10px' }}>
              {question.question}
            </h5>
            {question.description && (
              <p className="lead" style={{ color: '#00ff00', fontSize: '0.95em', marginBottom: '10px' }}>
                {question.description}
              </p>
            )}
            <small className="text-muted" style={{ color: '#00ff00', opacity: 0.7 }}>
              <span className="me-1">▶</span>{question.instruction || 'SELECT CORRECT OPTION'}
            </small>
          </div>
          
          <div className="list-group">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`list-group-item list-group-item-action quiz-option ${
                  selectedAnswer === index
                    ? option.correct
                      ? 'correct-answer'
                      : 'wrong-answer'
                    : ''
                }`}
                onClick={() => handleAnswer(index, option.correct)}
                disabled={selectedAnswer !== null}
                style={{ 
                  fontFamily: 'Share Tech Mono, monospace',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  padding: '15px',
                  marginBottom: '10px',
                  minHeight: '60px'
                }}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3" style={{ minWidth: '30px' }}>
                    <span style={{ color: selectedAnswer === index ? '#00ff00' : '#666' }}>
                      [{selectedAnswer === index ? '■' : '□'}]
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <span className="me-2" style={{ color: '#ff6600' }}>{String.fromCharCode(65 + index)}.</span>
                    <span style={{ fontSize: '0.9em' }}>{option.text}</span>
                  </div>
                  {selectedAnswer === index && (
                    <div className="ms-2" style={{ minWidth: '120px', textAlign: 'right' }}>
                      {option.correct ? (
                        <span style={{ color: '#00ff00' }}>✓ CORRECT</span>
                      ) : (
                        <span style={{ color: '#ff0000' }}>✗ INCORRECT</span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {selectedAnswer !== null && (
            <div className="mt-3 p-3 bg-light rounded" style={{ 
              background: 'rgba(0, 255, 0, 0.05)', 
              border: '1px solid #00ff00',
              color: '#00ff00'
            }}>
              <small style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                <strong>◆ DECLASSIFIED DATA:</strong><br />
                {question.fullFact}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;