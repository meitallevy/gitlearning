import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Book, Terminal, ChevronRight, Home, RefreshCw, GitBranch, Cloud, Zap, Trophy, FileText, LogOut, User, LogIn } from 'lucide-react';
import { stages } from '../constants/stages';
import { executeGitCommand } from '../utils/gitCommands';
import DocumentationContent from './DocumentationContent';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import githubLogo from '../assets/github-logo.svg';
import './GitLearningPlatform.css';

const GitLearningPlatform = () => {
  const navigate = useNavigate();
  const { currentUser, logout, loading: authLoading } = useAuth();
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [userInput, setUserInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' or 'docs'
  const [showTest, setShowTest] = useState(false);
  const [testAnswers, setTestAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [rebaseTodoList, setRebaseTodoList] = useState(null);
  const [rebaseTodoText, setRebaseTodoText] = useState('');
  const [conflictEditor, setConflictEditor] = useState(null); // { file, ours, theirs, resolved }
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(true); // Start as true so UI renders immediately
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [accountType, setAccountType] = useState('regular'); // 'regular' or 'GIL'
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const konamiTimeoutRef = useRef(null);
  const isLoadingProgressRef = useRef(false); // Track if we're currently loading progress

  const initialGitState = {
    initialized: false,
    currentBranch: 'main',
    branches: ['main'],
    files: {},
    stagedFiles: {},
    commits: [],
    workingDirectory: {},
    stash: [],
    conflictState: null,
    remotes: {},
    remoteCommits: {},
    remoteBranches: {},
    head: null,
    detachedHead: false,
    rebaseInProgress: false,
    rebaseSource: null,
    rebaseTarget: null,
    rebaseCommits: [],
    rebaseBaseCommit: null,
    cherryPickInProgress: false,
    tags: {},
    config: {
      'user.name': 'Developer',
      'user.email': 'dev@example.com'
    }
  };

  const [gitState, setGitState] = useState({ ...initialGitState });

  // Load user progress from Firestore
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      // Set progressLoaded to true even while auth is loading so UI can render
      if (!progressLoaded) {
        setProgressLoaded(true);
      }
      return;
    }

    const loadUserProgress = async () => {
      isLoadingProgressRef.current = true;
      setLoadingProgress(true);
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.completedStages && Array.isArray(data.completedStages)) {
              setCompletedStages(new Set(data.completedStages));
            } else {
              // If completedStages is missing or invalid, initialize as empty
              setCompletedStages(new Set());
            }
            // Load account type (default to 'regular' if not set)
            if (data.accountType) {
              setAccountType(data.accountType);
            } else {
              setAccountType('regular');
            }
          } else {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
              email: currentUser.email,
              completedStages: [],
              accountType: 'regular', // Default account type
              createdAt: new Date().toISOString()
            });
            setCompletedStages(new Set());
            setAccountType('regular');
          }
        } catch (error) {
          console.error('Error loading user progress:', error);
        } finally {
          setLoadingProgress(false);
          setProgressLoaded(true);
          // Wait a bit before allowing saves to prevent race conditions
          setTimeout(() => {
            isLoadingProgressRef.current = false;
          }, 1000);
        }
      } else {
        // No user logged in - reset progress
        setCompletedStages(new Set());
        setAccountType('regular');
        setLoadingProgress(false);
        setProgressLoaded(true);
        isLoadingProgressRef.current = false;
      }
    };

    loadUserProgress();
  }, [currentUser, authLoading]);

  // Save user progress to Firestore when completedStages changes
  useEffect(() => {
    // Don't save if still loading, if we're loading progress, or if no user is logged in
    if (authLoading || !progressLoaded || !currentUser || isLoadingProgressRef.current) {
      return;
    }

    const saveUserProgress = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        // Use setDoc with merge: true instead of updateDoc
        // This will create the document if it doesn't exist, or update it if it does
        // This prevents errors if the document was deleted or doesn't exist
        await setDoc(userDocRef, {
          email: currentUser.email,
          completedStages: Array.from(completedStages),
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error('Error saving user progress:', error);
        // If save fails, log it but don't throw - we don't want to break the UI
      }
    };

    // Debounce saves to avoid too many writes
    const timeoutId = setTimeout(saveUserProgress, 500);
    return () => clearTimeout(timeoutId);
  }, [completedStages, currentUser, authLoading, progressLoaded]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Konami Code detection
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA', 'Space'
    ];

    const handleKonamiKeyDown = (e) => {
      // Allow Konami Code keys even when input is focused (arrow keys, B, A, Space)
      const isKonamiKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyB', 'KeyA'].includes(e.code);
      
      // Only ignore if user is actively typing text AND it's not a Konami Code key
      const isTypingText = (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') && 
                           e.target === document.activeElement &&
                           !isKonamiKey;
      
      if (isTypingText) {
        // Reset sequence if user is typing text (but not Konami keys)
        setKonamiSequence([]);
        if (konamiTimeoutRef.current) {
          clearTimeout(konamiTimeoutRef.current);
          konamiTimeoutRef.current = null;
        }
        return;
      }

      const key = e.code;
      
      // Clear existing timeout
      if (konamiTimeoutRef.current) {
        clearTimeout(konamiTimeoutRef.current);
        konamiTimeoutRef.current = null;
      }
      
      setKonamiSequence(prev => {
        const newSequence = [...prev, key];
        
        // Keep only the last 11 keys (sequence is now 11 keys long)
        const trimmedSequence = newSequence.slice(-11);
        
        // Debug: log the sequence (remove in production)
        if (trimmedSequence.length > 0) {
          console.log('Konami sequence:', trimmedSequence);
        }
        
        // Check if the sequence matches Konami Code
        if (trimmedSequence.length === konamiCode.length) {
          const matches = trimmedSequence.every((k, i) => k === konamiCode[i]);
          
          if (matches && !konamiActivated) {
            console.log('Konami Code matched! Unlocking all stages...');
            
            // Unlock all stages
            const allStages = [
              ...stages.beginner,
              ...stages.intermediate,
              ...stages.advanced,
              ...stages.remote,
              ...stages.expert
            ];
            const allStageIds = allStages.map(s => s.id);
            setCompletedStages(new Set(allStageIds));
            setKonamiActivated(true);
            
            // Clear timeout
            if (konamiTimeoutRef.current) {
              clearTimeout(konamiTimeoutRef.current);
              konamiTimeoutRef.current = null;
            }
            
            // Show notification
            setTimeout(() => {
              alert('🎮 Konami Code Activated! All stages unlocked! 🎉');
            }, 100);
            
            // Reset sequence after activation
            return [];
          }
        }
        
        // Set timeout to reset sequence if no key pressed for 5 seconds (increased from 3)
        konamiTimeoutRef.current = setTimeout(() => {
          setKonamiSequence([]);
          konamiTimeoutRef.current = null;
        }, 5000);
        
        return trimmedSequence;
      });
    };

    // Use capture phase to catch events before they're handled by other handlers
    window.addEventListener('keydown', handleKonamiKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKonamiKeyDown, true);
      if (konamiTimeoutRef.current) {
        clearTimeout(konamiTimeoutRef.current);
        konamiTimeoutRef.current = null;
      }
    };
  }, [konamiActivated]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setUserInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setUserInput('');
        } else {
          setHistoryIndex(newIndex);
          setUserInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleCommandSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    // Add command to history
    setCommandHistory(prev => {
      const newHistory = [...prev];
      // Don't add duplicate consecutive commands
      if (newHistory[newHistory.length - 1] !== userInput.trim()) {
        newHistory.push(userInput.trim());
      }
      return newHistory;
    });
    setHistoryIndex(-1); // Reset history index

    const output = [...terminalOutput, { type: 'input', text: `$ ${userInput}` }];
    const rebaseTodoState = rebaseTodoList ? { commits: rebaseTodoList, text: rebaseTodoText } : null;
    const conflictResolvedText = conflictEditor ? conflictEditor.resolved : null;
    const { newState, output: cmdOutput, clear, rebaseTodo, conflictEditor: newConflictEditor } = executeGitCommand(userInput, gitState, rebaseTodoState, conflictResolvedText);
    
    if (clear) {
      setTerminalOutput([]);
    } else {
      output.push(...cmdOutput);
      setTerminalOutput(output);
    }
    
    // Handle rebase todo
    if (rebaseTodo) {
      if (rebaseTodo.action === 'open') {
        setRebaseTodoList(rebaseTodo.commits);
        setRebaseTodoText(rebaseTodo.text);
      } else if (rebaseTodo.action === 'clear') {
        setRebaseTodoList(null);
        setRebaseTodoText('');
      }
    }
    
    // Handle conflict editor
    if (newConflictEditor) {
      setConflictEditor(newConflictEditor);
    } else if (conflictEditor && userInput.trim().startsWith('git add ') && userInput.includes(conflictEditor.file)) {
      // Conflict resolved and file added - use resolved text
      const resolvedText = conflictEditor.resolved;
      newState.workingDirectory = {
        ...newState.workingDirectory,
        [conflictEditor.file]: resolvedText
      };
      setConflictEditor(null);
    }
    
    setGitState(newState);

    // Validate step
    const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced, ...stages.remote, ...stages.expert];
    const stageData = allStages.find(s => s.id === currentStage);
    
    // Validate step - call validator with all params (validators can ignore extra params)
    let isValid = false;
    if (stageData && stageData.steps && stageData.steps[currentStep]) {
      const validator = stageData.steps[currentStep].validator;
      if (validator) {
        try {
          const result = validator(userInput, newState, gitState);
          // Accept any truthy value (true, or any non-false/non-undefined value)
          isValid = !!result;
        } catch (e) {
          console.error('Validator error:', e, { userInput, currentStage, currentStep, stageData: stageData?.id });
          isValid = false;
        }
      }
    }
    
    if (isValid) {
      setShowHint(false);
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, { type: 'success', text: '✓ Correct!' }]);
        
        if (currentStep < stageData.steps.length - 1) {
          setTimeout(() => {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            // Apply next step's setup if exists
            if (stageData.steps[nextStep]?.setup) {
              setGitState(prev => stageData.steps[nextStep].setup(prev));
            }
          }, 800);
        } else {
          // All steps completed - show test if available
          if (stageData.test && stageData.test.questions) {
            setTimeout(() => {
              setShowTest(true);
              setTestAnswers({});
              setTestSubmitted(false);
              setTerminalOutput(prev => [...prev, { type: 'system', text: '\n✅ All steps completed! Now take the test to proceed.' }]);
            }, 800);
          } else {
            // No test - complete immediately
            setTimeout(() => {
              const newCompletedStages = new Set([...completedStages, currentStage]);
              setCompletedStages(newCompletedStages);
              setTerminalOutput(prev => [...prev, { type: 'success', text: '\n🎉 Stage completed!' }]);
            }, 800);
          }
        }
      }, 200);
    }

    setUserInput('');
  };

  const startStage = (stageId) => {
    const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced, ...stages.remote, ...stages.expert];
    const stageData = allStages.find(s => s.id === stageId);
    
    let initialState = { ...initialGitState, initialized: stageId !== 'init' };
    
    if (stageData?.setup) {
      initialState = stageData.setup(initialState);
    }

    setCurrentStage(stageId);
    setCurrentStep(0);
    setGitState(initialState);
    setShowHint(false);
    setRebaseTodoList(null);
    setRebaseTodoText('');
    setActiveTab('terminal');
    setShowTest(false);
    setTestAnswers({});
    setTestSubmitted(false);
    setTerminalOutput([
      { type: 'system', text: '═══════════════════════════════════════════════' },
      { type: 'system', text: '  Git Terminal Simulator' },
      { type: 'system', text: '═══════════════════════════════════════════════' },
      { type: 'output', text: 'Type commands to complete each step.' },
      { type: 'output', text: 'Use "help" or "git --help" for command list.\n' }
    ]);
  };

  const returnToMenu = () => {
    setCurrentStage(null);
    setTerminalOutput([]);
    setCurrentStep(0);
    setUserInput('');
    setShowHint(false);
  };

  const levelConfig = {
    beginner: { icon: Book, color: 'emerald', label: 'Beginner' },
    intermediate: { icon: GitBranch, color: 'blue', label: 'Intermediate' },
    advanced: { icon: Zap, color: 'purple', label: 'Advanced' },
    remote: { icon: Cloud, color: 'orange', label: 'Remote Operations' },
    expert: { icon: Trophy, color: 'rose', label: 'Expert' }
  };

  // Check if a stage is unlocked based on prerequisites
  const isStageUnlocked = (stageId, level) => {
    // GIL account type: all stages are always unlocked
    if (accountType === 'GIL') {
      return true;
    }
    
    // Beginner level: all stages unlocked
    if (level === 'beginner') {
      return true;
    }
    
    // For other levels, check if all previous level stages are completed
    const levelOrder = ['beginner', 'intermediate', 'advanced', 'remote', 'expert'];
    const currentLevelIndex = levelOrder.indexOf(level);
    
    // Check all previous levels
    for (let i = 0; i < currentLevelIndex; i++) {
      const previousLevel = levelOrder[i];
      const previousLevelStages = stages[previousLevel];
      const allPreviousCompleted = previousLevelStages.every(s => completedStages.has(s.id));
      
      if (!allPreviousCompleted) {
        return false;
      }
    }
    
    return true;
  };

  // Main menu
  if (!currentStage) {
    return (
      <div className="git-platform-menu">
        <div className="git-platform-menu-content">
          <div className="git-platform-menu-header">
            <div className="git-platform-menu-title-row">
            <div className="git-platform-menu-title">
              <img src={githubLogo} alt="GitHub Logo" className="git-platform-menu-title-icon" />
              <h1 className="git-platform-menu-title-text">
                Git Mastery Academy
              </h1>
              </div>
              {currentUser ? (
                <div className="git-platform-user-menu">
                  <div className="git-platform-user-info">
                    <User className="git-platform-icon-small" />
                    <span className="git-platform-user-email">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="git-platform-logout-button"
                    title="Logout"
                  >
                    <LogOut className="git-platform-icon-small" />
                    <span className="git-platform-header-text-mobile">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="git-platform-login-button"
                  title="Login"
                >
                  <LogIn className="git-platform-icon-small" />
                  <span className="git-platform-header-text-mobile">Login</span>
                </button>
              )}
            </div>
            <p className="git-platform-menu-description">
              Master Git through hands-on practice. From basics to advanced workflows with remote operations.
            </p>
            <div className="git-platform-menu-stats">
              <span className="git-platform-menu-stats-item"><CheckCircle className="git-platform-icon-small" /> {completedStages.size} completed</span>
              <span>•</span>
              <span>{stages ? Object.values(stages).flat().length : 0} total stages</span>
            </div>
          </div>

          <div className="git-platform-levels-container">
            {stages && Object.entries(stages).map(([level, stageList]) => {
              const config = levelConfig[level];
              const Icon = config.icon;
              const completedInLevel = stageList.filter(s => completedStages.has(s.id)).length;
              
              return (
                <div key={level} className="git-platform-level-section">
                  <div className="git-platform-level-header">
                    <div className={`git-platform-level-icon-wrapper level-icon-bg-${config.color}`}>
                      <Icon className={`git-platform-level-icon level-icon-${config.color}`} />
                    </div>
                    <h2 className="git-platform-level-title">{config.label}</h2>
                    <span className="git-platform-level-stats">
                      {completedInLevel}/{stageList.length} completed
                    </span>
                  </div>
                  
                  <div className="git-platform-stages-grid">
                    {stageList.map((stage) => {
                      const isUnlocked = isStageUnlocked(stage.id, level);
                      const isCompleted = completedStages.has(stage.id);
                      
                      return (
                      <button
                        key={stage.id}
                        onClick={() => {
                          if (isUnlocked) {
                            startStage(stage.id);
                          }
                        }}
                        disabled={!isUnlocked}
                        className={`git-platform-stage-card ${
                          isCompleted
                            ? 'git-platform-stage-card-completed'
                            : isUnlocked
                            ? 'git-platform-stage-card-pending'
                            : 'git-platform-stage-card-locked'
                        }`}
                        style={{
                          opacity: isUnlocked ? 1 : 0.5,
                          cursor: isUnlocked ? 'pointer' : 'not-allowed'
                        }}
                        title={!isUnlocked ? 'Complete all previous level stages to unlock' : ''}
                      >
                        <div className="git-platform-stage-card-content">
                          <div className="git-platform-stage-card-info">
                            <h3 className="git-platform-stage-card-title">{stage.title}</h3>
                            <p className="git-platform-stage-card-description">{stage.description}</p>
                          </div>
                          {isCompleted ? (
                            <CheckCircle className="git-platform-stage-card-icon git-platform-icon-completed" />
                          ) : isUnlocked ? (
                            <ChevronRight className="git-platform-stage-card-icon git-platform-icon-pending" />
                          ) : (
                            <span style={{ fontSize: '1.5rem' }}>🔒</span>
                          )}
                        </div>
                        <div className="git-platform-stage-card-steps">
                          {!isUnlocked && (
                            <div style={{ 
                              marginBottom: '0.5rem', 
                              padding: '0.5rem', 
                              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              color: '#ef4444'
                            }}>
                              🔒 Complete all previous level stages to unlock
                            </div>
                          )}
                          <div className="git-platform-stage-card-step-dots">
                            {stage.steps.slice(0, 5).map((_, i) => (
                              <div key={i} className="git-platform-stage-card-step-dot" />
                            ))}
                            {stage.steps.length > 5 && (
                              <span className="git-platform-stage-card-step-count">+{stage.steps.length - 5}</span>
                            )}
                          </div>
                          <span className="git-platform-stage-card-step-count">
                            {stage.steps.length} steps
                            {stage.test && stage.test.questions && (
                              <span style={{ marginLeft: '0.5rem', color: '#3b82f6', fontWeight: '600' }}>
                                • {stage.test.questions.length} test questions
                              </span>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Stage view
  const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced, ...stages.remote, ...stages.expert];
  const currentStageData = allStages.find(s => s.id === currentStage);

  return (
    <div className={`git-platform-container ${showTest ? 'git-platform-container-test-mode' : ''}`}>
      {/* Header */}
      <div className="git-platform-header">
        <div className="git-platform-header-content">
          <div className="git-platform-header-left">
            <button
              onClick={returnToMenu}
              className="git-platform-header-button"
            >
              <Home className="git-platform-icon-small" />
              <span className="git-platform-header-text-mobile">Menu</span>
            </button>
            <div className="git-platform-header-divider" />
            <div>
              <h1 className="git-platform-header-title">{currentStageData?.title}</h1>
              <p className="git-platform-header-description git-platform-header-text-mobile">{currentStageData?.description}</p>
            </div>
          </div>
          <div className="git-platform-header-right">
          <button
            onClick={() => startStage(currentStage)}
            className="git-platform-header-button git-platform-button-reset"
          >
            <RefreshCw className="git-platform-icon-small" />
            <span className="git-platform-header-text-mobile">Reset</span>
          </button>
            {currentUser && (
              <button
                onClick={logout}
                className="git-platform-header-button git-platform-button-logout"
                title="Logout"
              >
                <LogOut className="git-platform-icon-small" />
                <span className="git-platform-header-text-mobile">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="git-platform-progress">
        <div className="git-platform-progress-content">
          <div className="git-platform-progress-bar">
            {currentStageData?.steps.map((_, idx) => (
              <div
                key={idx}
                className={`git-platform-progress-bar-item ${
                  idx < currentStep ? 'git-platform-progress-bar-item-completed' :
                  idx === currentStep ? 'git-platform-progress-bar-item-current' :
                  'git-platform-progress-bar-item-pending'
                }`}
              />
            ))}
          </div>
          <p className="git-platform-progress-text">
            Step {currentStep + 1} of {currentStageData?.steps.length}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="git-platform-main">
        {/* Test Panel */}
        {showTest && currentStageData?.test && (
          <div className="git-platform-instructions" style={{ width: '100%', marginBottom: '1rem' }}>
            <div className="git-platform-instructions-panel" style={{ maxWidth: '100%' }}>
              <div className="git-platform-instructions-header">
                <div className="git-platform-instructions-step-number">
                  <span className="git-platform-instructions-step-number-text">📝</span>
                </div>
                <span className="git-platform-instructions-label">Stage Test</span>
              </div>
              
              <p className="git-platform-instructions-text" style={{ marginBottom: '1.5rem', color: '#cbd5e1', fontSize: '0.9375rem' }}>
                Answer all questions correctly to complete this stage and proceed to the next one.
              </p>

              {currentStageData.test.questions.map((q, qIdx) => {
                const isCorrect = testSubmitted && testAnswers[qIdx] === q.correct;
                const isWrong = testSubmitted && testAnswers[qIdx] !== undefined && testAnswers[qIdx] !== q.correct;
                
                return (
                  <div key={qIdx} style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1.25rem', 
                    border: isCorrect ? '1px solid rgba(52, 211, 153, 0.5)' : isWrong ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(148, 163, 184, 0.3)', 
                    borderRadius: '12px', 
                    backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : isWrong ? 'rgba(239, 68, 68, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <p style={{ 
                      fontWeight: '600', 
                      marginBottom: '1rem', 
                      fontSize: '1rem',
                      color: isCorrect ? '#34d399' : isWrong ? '#f87171' : '#e2e8f0',
                      lineHeight: '1.5'
                    }}>
                      {qIdx + 1}. {q.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {q.options.map((option, optIdx) => {
                        const isSelected = testAnswers[qIdx] === optIdx;
                        const isCorrectOption = optIdx === q.correct;
                        const showAsCorrect = testSubmitted && isCorrectOption;
                        const showAsWrong = testSubmitted && isWrong && isSelected && !isCorrectOption;
                        
                        return (
                        <label
                          key={optIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.875rem 1rem',
                            cursor: testSubmitted ? 'default' : 'pointer',
                            borderRadius: '8px',
                            backgroundColor: isSelected 
                              ? (showAsCorrect ? 'rgba(16, 185, 129, 0.3)' : showAsWrong ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)')
                              : showAsCorrect 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : 'rgba(30, 41, 59, 0.4)',
                            border: isSelected 
                              ? (showAsCorrect ? '1px solid rgba(52, 211, 153, 0.5)' : showAsWrong ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(59, 130, 246, 0.5)')
                              : showAsCorrect 
                              ? '1px solid rgba(52, 211, 153, 0.3)' 
                              : '1px solid rgba(148, 163, 184, 0.2)',
                            color: '#e2e8f0',
                            transition: 'all 0.2s ease',
                            opacity: testSubmitted && !isSelected && !showAsCorrect ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!testSubmitted && !isSelected) {
                              e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!testSubmitted && !isSelected) {
                              e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.4)';
                              e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            value={optIdx}
                            checked={isSelected}
                            onChange={() => {
                              if (!testSubmitted) {
                                setTestAnswers({ ...testAnswers, [qIdx]: optIdx });
                              }
                            }}
                            disabled={testSubmitted}
                            style={{ 
                              marginRight: '0.75rem',
                              width: '18px',
                              height: '18px',
                              cursor: testSubmitted ? 'default' : 'pointer',
                              accentColor: '#3b82f6'
                            }}
                          />
                          <span style={{ flex: 1, fontSize: '0.9375rem', lineHeight: '1.5' }}>{option}</span>
                          {showAsCorrect && (
                            <span style={{ marginLeft: '0.5rem', color: '#34d399', fontWeight: 'bold', fontSize: '1.25rem' }}>✓</span>
                          )}
                          {showAsWrong && (
                            <span style={{ marginLeft: '0.5rem', color: '#f87171', fontWeight: 'bold', fontSize: '1.25rem' }}>✗</span>
                          )}
                        </label>
                      );
                      })}
                    </div>
                  </div>
                );
              })}

              {!testSubmitted ? (
                <button
                  onClick={() => {
                    const allAnswered = currentStageData.test.questions.every((_, qIdx) => testAnswers[qIdx] !== undefined);
                    if (!allAnswered) {
                      setTerminalOutput(prev => [...prev, { type: 'error', text: 'Please answer all questions before submitting.' }]);
                      return;
                    }
                    setTestSubmitted(true);
                    const score = currentStageData.test.questions.filter((q, qIdx) => testAnswers[qIdx] === q.correct).length;
                    const total = currentStageData.test.questions.length;
                    const passed = score === total;
                    
                    if (passed) {
                      setTerminalOutput(prev => [...prev, { type: 'success', text: `\n✅ Test passed! ${score}/${total} correct.` }, { type: 'success', text: '🎉 Stage completed!' }]);
                      setTimeout(() => {
                        const newCompletedStages = new Set([...completedStages, currentStage]);
                        setCompletedStages(newCompletedStages);
                        setShowTest(false);
                      }, 1500);
                    } else {
                      setTerminalOutput(prev => [...prev, { type: 'error', text: `\n❌ Test failed. You got ${score}/${total} correct. Please review and try again.` }]);
                    }
                  }}
                  className="git-platform-hint-button"
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Submit Test
                </button>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  {currentStageData.test.questions.every((q, qIdx) => testAnswers[qIdx] === q.correct) ? (
                    <button
                      onClick={() => {
                        setShowTest(false);
                        setTestAnswers({});
                        setTestSubmitted(false);
                      }}
                      className="git-platform-hint-button"
                      style={{ width: '100%', backgroundColor: '#059669' }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setTestAnswers({});
                        setTestSubmitted(false);
                        setTerminalOutput(prev => [...prev, { type: 'system', text: 'Test reset. Please try again.' }]);
                      }}
                      className="git-platform-hint-button"
                      style={{ width: '100%', backgroundColor: '#dc2626' }}
                    >
                      Retry Test
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions panel */}
        {!showTest && (
          <div className="git-platform-instructions">
            <div className="git-platform-instructions-panel">
              <div className="git-platform-instructions-header">
                <div className="git-platform-instructions-step-number">
                  <span className="git-platform-instructions-step-number-text">{currentStep + 1}</span>
                </div>
                <span className="git-platform-instructions-label">Current Task</span>
              </div>
              
              <p className="git-platform-instructions-text">
                {currentStageData?.steps[currentStep]?.instruction}
              </p>

            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="git-platform-hint-button"
              >
                💡 Need help?
              </button>
            ) : (
              <div className="git-platform-hints-container">
                <div className="git-platform-hints-panel">
                  <p className="git-platform-hints-title">Hints</p>
                  {currentStageData?.steps[currentStep]?.hints?.map((hint, i) => (
                    <p key={i} className="git-platform-hint-item">
                      <span className="git-platform-hint-bullet">•</span> {hint}
                    </p>
                  ))}
                </div>
                <div className="git-platform-answer-panel">
                  <p className="git-platform-answer-title">Answer</p>
                  <code className="git-platform-answer-code">
                    {currentStageData?.steps[currentStep]?.expectedCommand}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Terminal / Documentation Section */}
        <div className="git-platform-content">
          {/* Tabs */}
          {!currentStageData?.hideDocs && (
            <div className="git-platform-tabs">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`git-platform-tab ${
                  activeTab === 'terminal'
                    ? 'git-platform-tab-active'
                    : 'git-platform-tab-inactive'
                }`}
              >
                <Terminal className="git-platform-icon-small" />
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('docs')}
                className={`git-platform-tab ${
                  activeTab === 'docs'
                    ? 'git-platform-tab-active'
                    : 'git-platform-tab-inactive'
                }`}
              >
                <FileText className="git-platform-icon-small" />
                Documentation
              </button>
            </div>
          )}

          {/* Terminal Tab */}
          {((currentStageData?.hideDocs && !showTest) || (activeTab === 'terminal' && !showTest)) && (
            <>
              <div className="git-platform-terminal-header">
                <div className="git-platform-terminal-window-controls">
                  <div className="git-platform-terminal-window-control git-platform-terminal-window-control-red" />
                  <div className="git-platform-terminal-window-control git-platform-terminal-window-control-yellow" />
                  <div className="git-platform-terminal-window-control git-platform-terminal-window-control-green" />
                </div>
                <span className="git-platform-terminal-path">~/project</span>
              </div>
              
              <div 
                ref={terminalRef}
                className="git-platform-terminal"
              >
                {terminalOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={`git-platform-terminal-line ${
                      line.type === 'input' ? 'terminal-line-input' :
                      line.type === 'error' ? 'terminal-line-error' :
                      line.type === 'success' ? 'terminal-line-success' :
                      line.type === 'warning' ? 'terminal-line-warning' :
                      line.type === 'system' ? 'terminal-line-system' :
                      'terminal-line-output'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                
                <form onSubmit={handleCommandSubmit} className="git-platform-terminal-input-form">
                  <span className="git-platform-terminal-prompt">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      // Reset history index when user manually types
                      if (historyIndex !== -1) {
                        setHistoryIndex(-1);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className="git-platform-terminal-input"
                    placeholder="Type your command..."
                    autoFocus
                    spellCheck={false}
                  />
                </form>
              </div>
            </>
          )}

          {/* Documentation Tab */}
          {!currentStageData?.hideDocs && activeTab === 'docs' && !showTest && (
            <div className="git-platform-docs-container">
              <DocumentationContent />
            </div>
          )}
        </div>

        {/* Rebase Todo Editor Modal */}
        {rebaseTodoList && (
          <div className="git-platform-modal-overlay" style={{ pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }} className="git-platform-modal">
            <div className="git-platform-modal-content">
              <div className="git-platform-modal-header">
                <h2 className="git-platform-modal-title">Interactive Rebase - Edit Todo List</h2>
                <button
                  onClick={() => {
                    setRebaseTodoList(null);
                    setRebaseTodoText('');
                  }}
                  className="git-platform-modal-close"
                >
                  ✕
                </button>
              </div>
              
              {/* Instructions Panel */}
              <div className="git-platform-instructions-panel git-platform-instructions-panel-emerald">
                <h3 className="git-platform-instructions-panel-title">📝 How to Edit:</h3>
                <ul className="git-platform-instructions-panel-list">
                  <li>Change the first word on each line to modify commits</li>
                  <li><code>pick</code> or <code>p</code> = keep commit as-is</li>
                  <li><code>squash</code> or <code>s</code> = combine with previous commit</li>
                  <li><code>reword</code> or <code>r</code> = change commit message</li>
                  <li><code>drop</code> or <code>d</code> = remove commit</li>
                </ul>
                <p className="git-platform-instructions-panel-text">
                  <strong>Example:</strong> To combine WIP commits, change <code>pick</code> to <code>squash</code> for the commits you want to merge.
                </p>
              </div>
              
              <div className="git-platform-modal-body">
                <textarea
                  value={rebaseTodoText}
                  onChange={(e) => setRebaseTodoText(e.target.value)}
                  className="git-platform-textarea"
                  spellCheck={false}
                  placeholder="Edit the rebase todo list..."
                />
              </div>
              <div className="git-platform-modal-footer">
                <button
                  onClick={() => {
                    setRebaseTodoList(null);
                    setRebaseTodoText('');
                    const output = [...terminalOutput, { type: 'input', text: '$ git rebase --abort' }];
                    const { newState, output: cmdOutput } = executeGitCommand('git rebase --abort', gitState, null);
                    setTerminalOutput([...output, ...cmdOutput]);
                    setGitState(newState);
                  }}
                  className="git-platform-button git-platform-button-secondary"
                >
                  Abort
                </button>
                <button
                  onClick={() => {
                    const output = [...terminalOutput, { type: 'input', text: '$ git rebase --continue' }];
                    const rebaseTodoState = { commits: rebaseTodoList, text: rebaseTodoText };
                    const { newState, output: cmdOutput, rebaseTodo } = executeGitCommand('git rebase --continue', gitState, rebaseTodoState);
                    setTerminalOutput([...output, ...cmdOutput]);
                    if (rebaseTodo && rebaseTodo.action === 'clear') {
                      setRebaseTodoList(null);
                      setRebaseTodoText('');
                    }
                    setGitState(newState);
                  }}
                  className="git-platform-button git-platform-button-primary"
                >
                  Continue
                </button>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Conflict Resolution Editor Modal */}
        {conflictEditor && (
          <div className="git-platform-modal-overlay" style={{ pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }} className="git-platform-modal git-platform-modal-padded">
            <div className="git-platform-modal-content">
              <div className="git-platform-modal-header">
                <h2 className="git-platform-modal-title">Resolve Merge Conflict - {conflictEditor.file}</h2>
                <button
                  onClick={() => setConflictEditor(null)}
                  className="git-platform-modal-close"
                >
                  ✕
                </button>
              </div>
              
              {/* Instructions Panel */}
              <div className="git-platform-instructions-panel git-platform-instructions-panel-warning">
                <h3 className="git-platform-instructions-panel-title git-platform-instructions-panel-title-warning">⚠️ Conflict Resolution:</h3>
                <ul className="git-platform-instructions-panel-list">
                  <li>Edit the file below to resolve the conflict</li>
                  <li>Remove the conflict markers: <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code></li>
                  <li>Keep the content you want, or combine both versions</li>
                  <li>After editing, click "Mark as Resolved" and then run <code>git add {conflictEditor.file}</code></li>
                </ul>
                <div className="git-platform-conflict-preview">
                  <div className="git-platform-conflict-preview-item">
                    <p className="git-platform-conflict-preview-label">HEAD (current branch):</p>
                    <pre className="git-platform-conflict-preview-code">{conflictEditor.ours}</pre>
                  </div>
                  <div className="git-platform-conflict-preview-item">
                    <p className="git-platform-conflict-preview-label">Incoming changes:</p>
                    <pre className="git-platform-conflict-preview-code">{conflictEditor.theirs}</pre>
                  </div>
                </div>
              </div>
              
              <div className="git-platform-modal-body">
                <textarea
                  value={conflictEditor.resolved}
                  onChange={(e) => setConflictEditor({ ...conflictEditor, resolved: e.target.value })}
                  className="git-platform-textarea git-platform-textarea-warning"
                  spellCheck={false}
                  placeholder="Edit to resolve conflict..."
                />
              </div>
              <div className="git-platform-modal-footer">
                <button
                  onClick={() => setConflictEditor(null)}
                  className="git-platform-button git-platform-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Update working directory with resolved content
                    setGitState(prev => ({
                      ...prev,
                      workingDirectory: {
                        ...prev.workingDirectory,
                        [conflictEditor.file]: conflictEditor.resolved
                      }
                    }));
                    setConflictEditor(null);
                    setTerminalOutput(prev => [...prev, { type: 'system', text: 'Conflict resolved. Run "git add ' + conflictEditor.file + '" to stage the resolved file.' }]);
                  }}
                  className="git-platform-button git-platform-button-warning"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitLearningPlatform;
