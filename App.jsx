import React, { useState } from 'react';
import { Play, CheckCircle, Circle, Book, Terminal, AlertCircle, ChevronRight, Home, RefreshCw } from 'lucide-react';

const GitLearningPlatform = () => {
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [userInput, setUserInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // Realistic Git repository state
  const [gitState, setGitState] = useState({
    initialized: false,
    currentBranch: 'main',
    branches: ['main'],
    files: {},
    stagedFiles: {},
    commits: [],
    workingDirectory: {},
    stash: [],
    conflictState: null
  });

  const stages = {
    beginner: [
      {
        id: 'init',
        title: 'Initialize a Repository',
        description: 'Learn how to create your first Git repository',
        steps: [
          {
            instruction: 'Initialize a new Git repository',
            hints: ['Use the git init command', 'This command creates a .git directory'],
            validator: (cmd, state) => cmd.trim() === 'git init',
            expectedCommand: 'git init'
          },
          {
            instruction: 'Check the status of your repository',
            hints: ['Use git status to see the current state', 'This shows tracked and untracked files'],
            validator: (cmd, state) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'add-commit',
        title: 'Add and Commit Changes',
        description: 'Learn the basic Git workflow',
        steps: [
          {
            instruction: 'Add the file "README.md" to staging',
            hints: ['The file README.md already exists in your directory', 'Use git add to stage it', 'Format: git add <filename>'],
            validator: (cmd, state) => cmd.trim() === 'git add README.md',
            expectedCommand: 'git add README.md',
            setup: (state) => {
              state.workingDirectory['README.md'] = '# My Project\nWelcome to my project!';
              return state;
            }
          },
          {
            instruction: 'Check status to see the staged file',
            hints: ['Use git status', 'This will show files in the staging area'],
            validator: (cmd, state) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Commit the staged changes with message "Initial commit"',
            hints: ['Use git commit with the -m flag for messages', 'Format: git commit -m "your message"'],
            validator: (cmd, state) => cmd.trim() === 'git commit -m "Initial commit"',
            expectedCommand: 'git commit -m "Initial commit"'
          },
          {
            instruction: 'View your commit history',
            hints: ['Use git log to see commits', 'Try git log --oneline for a compact view'],
            validator: (cmd, state) => cmd.trim() === 'git log' || cmd.trim() === 'git log --oneline',
            expectedCommand: 'git log'
          }
        ]
      },
      {
        id: 'modify-track',
        title: 'Modify and Track Changes',
        description: 'Learn how Git tracks file modifications',
        setup: (state) => {
          state.files['app.js'] = 'console.log("Hello");';
          state.commits.push({
            hash: 'a1b2c3d',
            message: 'Add app.js',
            files: { 'app.js': 'console.log("Hello");' }
          });
          return state;
        },
        steps: [
          {
            instruction: 'Check the current status',
            hints: ['Use git status'],
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status',
            setup: (state) => {
              state.workingDirectory['app.js'] = 'console.log("Hello World!");';
              return state;
            }
          },
          {
            instruction: 'View the differences in app.js',
            hints: ['Use git diff to see what changed'],
            validator: (cmd) => cmd.trim() === 'git diff' || cmd.trim() === 'git diff app.js',
            expectedCommand: 'git diff'
          },
          {
            instruction: 'Stage the modified file',
            hints: ['Use git add app.js'],
            validator: (cmd) => cmd.trim() === 'git add app.js',
            expectedCommand: 'git add app.js'
          },
          {
            instruction: 'Commit with message "Update greeting"',
            validator: (cmd) => cmd.trim() === 'git commit -m "Update greeting"',
            expectedCommand: 'git commit -m "Update greeting"'
          },
          {
            instruction: 'View the commit log',
            validator: (cmd) => cmd.trim() === 'git log' || cmd.trim() === 'git log --oneline',
            expectedCommand: 'git log'
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'branching',
        title: 'Creating and Switching Branches',
        description: 'Learn to work with branches',
        steps: [
          {
            instruction: 'Create a new branch called "feature"',
            hints: ['Use git branch feature'],
            validator: (cmd) => cmd.trim() === 'git branch feature',
            expectedCommand: 'git branch feature'
          },
          {
            instruction: 'List all branches to see your new branch',
            hints: ['Use git branch to list branches'],
            validator: (cmd) => cmd.trim() === 'git branch',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'Switch to the feature branch',
            hints: ['Use git checkout feature'],
            validator: (cmd) => cmd.trim() === 'git checkout feature' || cmd.trim() === 'git switch feature',
            expectedCommand: 'git checkout feature'
          },
          {
            instruction: 'Check status to confirm you are on feature branch',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'merging',
        title: 'Merging Branches',
        description: 'Combine work from different branches',
        setup: (state) => {
          state.branches = ['main', 'feature'];
          state.currentBranch = 'main';
          state.commits.push({
            hash: 'f1e2d3c',
            message: 'Feature work',
            branch: 'feature',
            files: { 'feature.txt': 'Feature content' }
          });
          return state;
        },
        steps: [
          {
            instruction: 'Make sure you are on the main branch',
            validator: (cmd) => cmd.trim() === 'git checkout main' || cmd.trim() === 'git switch main',
            expectedCommand: 'git checkout main'
          },
          {
            instruction: 'Check current branch with status',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Merge the feature branch into main',
            validator: (cmd) => cmd.trim() === 'git merge feature',
            expectedCommand: 'git merge feature'
          },
          {
            instruction: 'View the updated commit log',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log'
          }
        ]
      },
      {
        id: 'conflicts',
        title: 'Resolving Merge Conflicts',
        description: 'Handle conflicts when merging branches',
        setup: (state) => {
          state.branches = ['main', 'feature-a'];
          state.currentBranch = 'main';
          state.files['config.txt'] = 'port=3000';
          state.workingDirectory['config.txt'] = 'port=3000';
          state.conflictState = {
            file: 'config.txt',
            ours: 'port=3000',
            theirs: 'port=8080'
          };
          return state;
        },
        steps: [
          {
            instruction: 'Try to merge feature-a branch (this will create a conflict)',
            validator: (cmd) => cmd.trim() === 'git merge feature-a',
            expectedCommand: 'git merge feature-a'
          },
          {
            instruction: 'Check status to see the conflict',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Add the resolved file to staging',
            hints: ['After resolving conflicts manually, use git add config.txt'],
            validator: (cmd) => cmd.trim() === 'git add config.txt',
            expectedCommand: 'git add config.txt'
          },
          {
            instruction: 'Complete the merge with a commit',
            validator: (cmd) => cmd.trim() === 'git commit -m "Resolve conflict"' || cmd.trim() === 'git commit',
            expectedCommand: 'git commit -m "Resolve conflict"'
          }
        ]
      }
    ],
    advanced: [
      {
        id: 'rebase',
        title: 'Rebasing Branches',
        description: 'Learn to rebase for a cleaner history',
        setup: (state) => {
          state.branches = ['main', 'feature'];
          state.currentBranch = 'feature';
          state.commits = [
            { hash: 'a1b2c3', message: 'Initial commit', branch: 'main' },
            { hash: 'd4e5f6', message: 'Feature work', branch: 'feature' },
            { hash: 'g7h8i9', message: 'Main update', branch: 'main' }
          ];
          return state;
        },
        steps: [
          {
            instruction: 'Check current branch',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Rebase feature branch onto main',
            hints: ['Make sure you are on feature branch, then use git rebase main'],
            validator: (cmd) => cmd.trim() === 'git rebase main',
            expectedCommand: 'git rebase main'
          },
          {
            instruction: 'View the updated log',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'stash',
        title: 'Stashing Changes',
        description: 'Temporarily save uncommitted work',
        setup: (state) => {
          state.workingDirectory['temp.txt'] = 'Work in progress';
          return state;
        },
        steps: [
          {
            instruction: 'Check status to see uncommitted changes',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Stash your changes',
            hints: ['Use git stash'],
            validator: (cmd) => cmd.trim() === 'git stash' || cmd.trim() === 'git stash save',
            expectedCommand: 'git stash'
          },
          {
            instruction: 'Check status again (should be clean)',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'List stashed changes',
            validator: (cmd) => cmd.trim() === 'git stash list',
            expectedCommand: 'git stash list'
          },
          {
            instruction: 'Apply the stashed changes back',
            validator: (cmd) => cmd.trim() === 'git stash pop' || cmd.trim() === 'git stash apply',
            expectedCommand: 'git stash pop'
          },
          {
            instruction: 'Verify changes are back',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'reset',
        title: 'Reset and Revert',
        description: 'Undo changes in different ways',
        setup: (state) => {
          state.commits = [
            { hash: 'abc123', message: 'First commit' },
            { hash: 'def456', message: 'Second commit' },
            { hash: 'ghi789', message: 'Third commit' }
          ];
          state.stagedFiles['mistake.txt'] = 'Oops';
          return state;
        },
        steps: [
          {
            instruction: 'View the commit log',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Unstage the file using reset',
            hints: ['Use git reset HEAD mistake.txt'],
            validator: (cmd) => cmd.trim() === 'git reset HEAD mistake.txt' || cmd.trim() === 'git reset mistake.txt',
            expectedCommand: 'git reset HEAD mistake.txt'
          },
          {
            instruction: 'Check status to confirm',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      }
    ]
  };

  const executeGitCommand = (cmd, state) => {
    const trimmed = cmd.trim();
    const newState = { ...state };
    let output = [];

    // Basic shell commands
    if (trimmed === 'ls' || trimmed === 'ls -la') {
      const allFiles = new Set([
        ...Object.keys(state.files || {}),
        ...Object.keys(state.workingDirectory || {}),
        ...Object.keys(state.stagedFiles || {})
      ]);
      if (allFiles.size > 0) {
        Array.from(allFiles).forEach(file => {
          output.push({ type: 'output', text: file });
        });
      } else {
        output.push({ type: 'output', text: '(empty directory)' });
      }
    }
    else if (trimmed.startsWith('cat ')) {
      const file = trimmed.replace('cat ', '').trim();
      const content = state.workingDirectory[file] || state.files[file] || state.stagedFiles[file];
      if (content) {
        output.push({ type: 'output', text: content });
      } else {
        output.push({ type: 'error', text: `cat: ${file}: No such file or directory` });
      }
    }
    else if (trimmed === 'pwd') {
      output.push({ type: 'output', text: '/project' });
    }
    else if (trimmed === 'clear') {
      return { newState, output: [{ type: 'system', text: 'Terminal cleared' }] };
    }
    else if (trimmed.startsWith('echo ')) {
      const match = trimmed.match(/echo ["']?([^"']+)["']?\s*>\s*(\S+)/);
      if (match) {
        const content = match[1];
        const file = match[2];
        newState.workingDirectory = { ...state.workingDirectory, [file]: content };
        output.push({ type: 'success', text: `Created/updated ${file}` });
      } else {
        const text = trimmed.replace('echo ', '').replace(/["']/g, '');
        output.push({ type: 'output', text: text });
      }
    }
    else if (trimmed.startsWith('rm ')) {
      const file = trimmed.replace('rm ', '').trim();
      if (state.workingDirectory[file] || state.files[file]) {
        newState.workingDirectory = { ...state.workingDirectory };
        delete newState.workingDirectory[file];
        newState.files = { ...state.files };
        delete newState.files[file];
        output.push({ type: 'success', text: `Removed ${file}` });
      } else {
        output.push({ type: 'error', text: `rm: ${file}: No such file or directory` });
      }
    }
    else if (trimmed.startsWith('mkdir ')) {
      const dir = trimmed.replace('mkdir ', '').trim();
      output.push({ type: 'success', text: `Created directory ${dir}` });
    }
    else if (trimmed === 'help' || trimmed === '--help') {
      output.push({ type: 'system', text: 'Available commands:' });
      output.push({ type: 'output', text: '  Git: git init, git status, git add, git commit, git log, git diff, git branch, git checkout, git merge, git stash, git rebase, git reset' });
      output.push({ type: 'output', text: '  Shell: ls, cat <file>, pwd, echo, rm, mkdir, clear' });
    }
    // Git commands
    else if (trimmed === 'git init') {
      if (state.initialized) {
        output.push({ type: 'output', text: 'Reinitialized existing Git repository in /project/.git/' });
      } else {
        newState.initialized = true;
        newState.branches = ['main'];
        newState.currentBranch = 'main';
        output.push({ type: 'success', text: 'Initialized empty Git repository in /project/.git/' });
      }
    }
    else if (trimmed === 'git status') {
      output.push({ type: 'output', text: `On branch ${state.currentBranch}` });
      
      const unstagedFiles = Object.keys(state.workingDirectory || {}).filter(
        f => !state.stagedFiles[f] && state.workingDirectory[f] !== state.files[f]
      );
      const stagedFiles = Object.keys(state.stagedFiles || {});
      const untrackedFiles = Object.keys(state.workingDirectory || {}).filter(
        f => !state.files[f] && !state.stagedFiles[f]
      );

      if (state.conflictState) {
        output.push({ type: 'error', text: '\nYou have unmerged paths.' });
        output.push({ type: 'error', text: '  (fix conflicts and run "git commit")' });
        output.push({ type: 'error', text: '\nUnmerged paths:' });
        output.push({ type: 'error', text: `  both modified:   ${state.conflictState.file}` });
      } else if (stagedFiles.length > 0) {
        output.push({ type: 'success', text: '\nChanges to be committed:' });
        output.push({ type: 'success', text: '  (use "git restore --staged <file>..." to unstage)' });
        stagedFiles.forEach(f => {
          const status = state.files[f] ? 'modified' : 'new file';
          output.push({ type: 'success', text: `\t${status}:   ${f}` });
        });
      }
      
      if (unstagedFiles.length > 0) {
        output.push({ type: 'warning', text: '\nChanges not staged for commit:' });
        output.push({ type: 'output', text: '  (use "git add <file>..." to update what will be committed)' });
        unstagedFiles.forEach(f => {
          output.push({ type: 'warning', text: `\tmodified:   ${f}` });
        });
      }

      if (untrackedFiles.length > 0) {
        output.push({ type: 'output', text: '\nUntracked files:' });
        output.push({ type: 'output', text: '  (use "git add <file>..." to include in what will be committed)' });
        untrackedFiles.forEach(f => {
          output.push({ type: 'warning', text: `\t${f}` });
        });
      }

      if (stagedFiles.length === 0 && unstagedFiles.length === 0 && untrackedFiles.length === 0 && !state.conflictState) {
        output.push({ type: 'output', text: '\nnothing to commit, working tree clean' });
      }
    }
    else if (trimmed.startsWith('git add ')) {
      const file = trimmed.replace('git add ', '').trim();
      if (file === '.') {
        const allFiles = Object.keys(state.workingDirectory || {});
        allFiles.forEach(f => {
          newState.stagedFiles = { ...newState.stagedFiles, [f]: state.workingDirectory[f] };
        });
        output.push({ type: 'success', text: `Added all files to staging area` });
      } else if (state.workingDirectory[file]) {
        newState.stagedFiles = { ...state.stagedFiles, [file]: state.workingDirectory[file] };
        output.push({ type: 'success', text: `Added ${file} to staging area` });
      } else {
        output.push({ type: 'error', text: `fatal: pathspec '${file}' did not match any files` });
      }
    }
    else if (trimmed.startsWith('git commit')) {
      const match = trimmed.match(/-m ["']([^"']+)["']/);
      const message = match ? match[1] : 'Commit message';
      
      if (Object.keys(state.stagedFiles).length === 0 && !state.conflictState) {
        output.push({ type: 'error', text: 'nothing to commit, working tree clean' });
      } else {
        const hash = Math.random().toString(36).substr(2, 7);
        newState.commits = [...(state.commits || []), {
          hash,
          message,
          files: { ...state.stagedFiles },
          branch: state.currentBranch
        }];
        newState.files = { ...state.files, ...state.stagedFiles };
        newState.stagedFiles = {};
        newState.conflictState = null;
        
        const fileCount = Object.keys(state.stagedFiles).length;
        output.push({ type: 'success', text: `[${state.currentBranch} ${hash}] ${message}` });
        output.push({ type: 'success', text: ` ${fileCount} file(s) changed` });
      }
    }
    else if (trimmed === 'git log' || trimmed === 'git log --oneline') {
      if (state.commits && state.commits.length > 0) {
        const isOneline = trimmed.includes('--oneline');
        state.commits.slice().reverse().forEach(commit => {
          if (isOneline) {
            output.push({ type: 'output', text: `${commit.hash} ${commit.message}` });
          } else {
            output.push({ type: 'output', text: `commit ${commit.hash}` });
            output.push({ type: 'output', text: `    ${commit.message}\n` });
          }
        });
      } else {
        output.push({ type: 'error', text: 'fatal: your current branch does not have any commits yet' });
      }
    }
    else if (trimmed === 'git diff' || trimmed.startsWith('git diff ')) {
      const file = trimmed.replace('git diff', '').trim() || Object.keys(state.workingDirectory)[0];
      if (state.workingDirectory[file] && state.files[file]) {
        output.push({ type: 'output', text: `diff --git a/${file} b/${file}` });
        output.push({ type: 'error', text: `--- a/${file}` });
        output.push({ type: 'success', text: `+++ b/${file}` });
        output.push({ type: 'error', text: `-${state.files[file]}` });
        output.push({ type: 'success', text: `+${state.workingDirectory[file]}` });
      } else {
        output.push({ type: 'output', text: 'No differences found' });
      }
    }
    else if (trimmed.startsWith('git branch')) {
      if (trimmed === 'git branch') {
        state.branches.forEach(b => {
          const marker = b === state.currentBranch ? '* ' : '  ';
          const color = b === state.currentBranch ? 'success' : 'output';
          output.push({ type: color, text: `${marker}${b}` });
        });
      } else {
        const branchName = trimmed.replace('git branch ', '').trim();
        if (!state.branches.includes(branchName)) {
          newState.branches = [...state.branches, branchName];
          output.push({ type: 'success', text: `Created branch '${branchName}'` });
        } else {
          output.push({ type: 'error', text: `fatal: A branch named '${branchName}' already exists.` });
        }
      }
    }
    else if (trimmed.startsWith('git checkout ') || trimmed.startsWith('git switch ')) {
      const branchName = trimmed.split(' ').pop();
      if (state.branches.includes(branchName)) {
        newState.currentBranch = branchName;
        output.push({ type: 'success', text: `Switched to branch '${branchName}'` });
      } else {
        output.push({ type: 'error', text: `error: pathspec '${branchName}' did not match any file(s) known to git` });
      }
    }
    else if (trimmed.startsWith('git merge ')) {
      const branchName = trimmed.replace('git merge ', '').trim();
      
      if (state.conflictState && branchName === 'feature-a') {
        output.push({ type: 'error', text: `Auto-merging config.txt` });
        output.push({ type: 'error', text: `CONFLICT (content): Merge conflict in config.txt` });
        output.push({ type: 'error', text: `Automatic merge failed; fix conflicts and then commit the result.` });
      } else {
        output.push({ type: 'success', text: `Updating ${state.commits[0]?.hash || 'abc123'}..${state.commits[state.commits.length - 1]?.hash || 'def456'}` });
        output.push({ type: 'success', text: `Fast-forward` });
        output.push({ type: 'success', text: ` feature.txt | 1 +` });
      }
    }
    else if (trimmed === 'git stash' || trimmed === 'git stash save') {
      const unstaged = Object.keys(state.workingDirectory || {});
      if (unstaged.length > 0) {
        newState.stash = [...(state.stash || []), { files: { ...state.workingDirectory } }];
        newState.workingDirectory = {};
        output.push({ type: 'success', text: `Saved working directory and index state WIP on ${state.currentBranch}` });
      } else {
        output.push({ type: 'output', text: 'No local changes to save' });
      }
    }
    else if (trimmed === 'git stash list') {
      if (state.stash && state.stash.length > 0) {
        state.stash.forEach((s, i) => {
          output.push({ type: 'output', text: `stash@{${i}}: WIP on ${state.currentBranch}` });
        });
      } else {
        output.push({ type: 'output', text: 'No stash entries found' });
      }
    }
    else if (trimmed === 'git stash pop' || trimmed === 'git stash apply') {
      if (state.stash && state.stash.length > 0) {
        const lastStash = state.stash[state.stash.length - 1];
        newState.workingDirectory = { ...lastStash.files };
        if (trimmed === 'git stash pop') {
          newState.stash = state.stash.slice(0, -1);
          output.push({ type: 'success', text: 'Dropped refs/stash@{0}' });
        }
        output.push({ type: 'success', text: 'Changes applied successfully' });
      } else {
        output.push({ type: 'error', text: 'No stash entries found' });
      }
    }
    else if (trimmed.startsWith('git rebase ')) {
      output.push({ type: 'success', text: `Successfully rebased and updated refs/heads/${state.currentBranch}` });
    }
    else if (trimmed.startsWith('git reset ')) {
      const parts = trimmed.split(' ');
      if (parts.includes('HEAD')) {
        const file = parts[parts.length - 1];
        if (state.stagedFiles[file]) {
          newState.stagedFiles = { ...state.stagedFiles };
          delete newState.stagedFiles[file];
          output.push({ type: 'success', text: `Unstaged changes after reset:` });
          output.push({ type: 'output', text: `M\t${file}` });
        }
      }
    }
    else {
      const gitCmd = trimmed.startsWith('git ') ? trimmed.split(' ')[1] : trimmed.split(' ')[0];
      output.push({ type: 'error', text: `Command not recognized: ${gitCmd}. Type 'help' for available commands.` });
    }

    return { newState, output };
  };

  const handleCommandSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!userInput.trim()) return;

    const output = [...terminalOutput];
    output.push({ type: 'input', text: `$ ${userInput}` });

    const { newState, output: cmdOutput } = executeGitCommand(userInput, gitState);
    output.push(...cmdOutput);

    setTerminalOutput(output);
    setGitState(newState);

    const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced];
    const stageData = allStages.find(s => s.id === currentStage);

    if (stageData && stageData.steps[currentStep]) {
      const step = stageData.steps[currentStep];
      
      if (step.validator(userInput, newState)) {
        setShowHint(false);
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, { 
            type: 'success', 
            text: '✓ Correct command!' 
          }]);
          
          if (currentStep < stageData.steps.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 1500);
          } else {
            setTimeout(() => {
              setCompletedStages(new Set([...completedStages, currentStage]));
              setTerminalOutput(prev => [...prev, { 
                type: 'success', 
                text: '\n🎉 Stage completed! Return to menu to continue learning.' 
              }]);
            }, 1500);
          }
        }, 300);
      }
    }

    setUserInput('');
  };

  const startStage = (stageId) => {
    const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced];
    const stageData = allStages.find(s => s.id === stageId);

    let initialState = {
      initialized: true,
      currentBranch: 'main',
      branches: ['main'],
      files: {},
      stagedFiles: {},
      commits: [],
      workingDirectory: {},
      stash: [],
      conflictState: null
    };

    if (stageData?.setup) {
      initialState = stageData.setup(initialState);
    }

    if (stageData?.steps[0]?.setup) {
      initialState = stageData.steps[0].setup(initialState);
    }

    setCurrentStage(stageId);
    setCurrentStep(0);
    setGitState(initialState);
    setShowHint(false);
    setTerminalOutput([
      { type: 'system', text: '=== Git Terminal Simulator ===' },
      { type: 'system', text: 'Type Git commands to complete each step. Click "Show Answer" if you need help.' },
      { type: 'system', text: 'Shell commands available: ls, cat, pwd, echo, rm, mkdir, clear, help\n' }
    ]);
  };

  const returnToMenu = () => {
    setCurrentStage(null);
    setTerminalOutput([]);
    setCurrentStep(0);
    setUserInput('');
    setShowHint(false);
  };

  const resetStage = () => {
    if (currentStage) {
      startStage(currentStage);
    }
  };

  if (!currentStage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Git Mastery Academy
            </h1>
            <p className="text-xl text-gray-300">
              Master Git through hands-on practice - from beginner to advanced
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Interactive terminal simulator with real Git command validation
            </p>
          </div>

          {Object.entries(stages).map(([level, stageList]) => (
            <div key={level} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 capitalize text-purple-300 flex items-center gap-2">
                <Book className="w-6 h-6" />
                {level} Level
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stageList.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => startStage(stage.id)}
                    className="bg-slate-800 hover:bg-slate-700 p-6 rounded-lg text-left transition-all hover:scale-105 border border-slate-700 hover:border-purple-500"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                      {completedStages.has(stage.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{stage.description}</p>
                    <div className="flex items-center text-purple-400 text-sm">
                      <span>{stage.steps.length} steps</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const allStages = [...stages.beginner, ...stages.intermediate, ...stages.advanced];
  const currentStageData = allStages.find(s => s.id === currentStage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={returnToMenu}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <Home className="w-5 h-5" />
            Return to Menu
          </button>
          <button
            onClick={resetStage}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Stage
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-3xl font-bold mb-2">{currentStageData?.title}</h2>
          <p className="text-gray-300 mb-4">{currentStageData?.description}</p>
          
          <div className="flex items-center gap-2 mb-4">
            {currentStageData?.steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded ${
                  idx < currentStep ? 'bg-green-500' :
                  idx === currentStep ? 'bg-purple-500' :
                  'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="bg-slate-900 p-4 rounded border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-semibold text-purple-300 mb-1">
                  Step {currentStep + 1} of {currentStageData?.steps.length}
                </p>
                <p className="text-white mb-3">
                  {currentStageData?.steps[currentStep]?.instruction}
                </p>
                
                {!showHint && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-sm text-purple-400 hover:text-purple-300 underline"
                  >
                    💡 Show Hints
                  </button>
                )}
                
                {showHint && (
                  <div className="mt-3 bg-slate-800 p-3 rounded border border-purple-500/30">
                    <p className="text-sm font-semibold text-purple-300 mb-2">Hints:</p>
                    {currentStageData?.steps[currentStep]?.hints?.map((hint, idx) => (
                      <p key={idx} className="text-sm text-gray-300 mb-1">• {hint}</p>
                    ))}
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-sm font-semibold text-yellow-400 mb-1">Answer:</p>
                      <code className="text-sm text-green-400 bg-slate-900 px-2 py-1 rounded">
                        {currentStageData?.steps[currentStep]?.expectedCommand}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-gray-300">Git Terminal</span>
          </div>
          
          <div className="p-4 font-mono text-sm h-96 overflow-y-auto">
            {terminalOutput.map((line, idx) => (
              <div
                key={idx}
                className={`mb-1 ${
                  line.type === 'input' ? 'text-blue-300' :
                  line.type === 'success' ? 'text-green-400' :
                  line.type === 'error' ? 'text-red-400' :
                  line.type === 'warning' ? 'text-yellow-400' :
                  line.type === 'system' ? 'text-purple-400' :
                  'text-gray-300'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommandSubmit} className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400">$</span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white font-mono"
                placeholder="Type git command here..."
                autoFocus
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                Execute
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-gray-400">
            💡 <strong>Tip:</strong> Try to figure out the command yourself! You can experiment freely - 
            the terminal will execute any Git command. Click "Show Hints" when you need guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GitLearningPlatform;
