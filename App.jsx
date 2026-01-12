import React, { useState, useRef, useEffect } from 'react';
import { Play, CheckCircle, Circle, Book, Terminal, AlertCircle, ChevronRight, Home, RefreshCw, GitBranch, Cloud, Lock, Zap, Trophy, FileText } from 'lucide-react';

const DocumentationContent = () => {
  const [selectedCommand, setSelectedCommand] = useState('overview');

  const gitCommands = {
    overview: {
      title: 'Git Overview',
      content: `Git is a distributed version control system for tracking changes in source code.

BASIC CONCEPTS:
- Repository: A collection of files and their complete history
- Commit: A snapshot of your repository at a point in time
- Branch: A parallel version of your repository
- Remote: A version of your project hosted on the internet or network

WORKFLOW:
1. Modify files in your working directory
2. Stage changes with 'git add'
3. Commit changes with 'git commit'
4. Push to remote with 'git push'`
    },
    init: {
      title: 'git init',
      content: `Initialize a new Git repository.

SYNTAX:
  git init [<directory>]

DESCRIPTION:
  Creates a new Git repository in the specified directory (or current directory if none specified).

OPTIONS:
  --bare
    Create a bare repository (no working directory)

EXAMPLES:
  git init
  git init my-project
  git init --bare shared-repo`
    },
    add: {
      title: 'git add',
      content: `Add file contents to the staging area.

SYNTAX:
  git add [<options>] [--] <pathspec>...

DESCRIPTION:
  Stages changes for the next commit. Files can be added individually or all at once.

OPTIONS:
  -A, --all
    Stage all changes (new, modified, deleted)
  -u, --update
    Stage only modified and deleted files
  -p, --patch
    Interactively choose hunks to stage
  --dry-run
    Show what would be staged without actually staging

EXAMPLES:
  git add file.txt
  git add .
  git add -A
  git add -p
  git add *.js`
    },
    commit: {
      title: 'git commit',
      content: `Record changes to the repository.

SYNTAX:
  git commit [<options>] [--] <pathspec>...

DESCRIPTION:
  Creates a new commit with the currently staged changes.

OPTIONS:
  -m, --message <msg>
    Use the given message as the commit message
  -a, --all
    Automatically stage files that have been modified and deleted
  --amend
    Amend the previous commit instead of creating a new one
  --no-verify
    Bypass pre-commit and commit-msg hooks

EXAMPLES:
  git commit -m "Add new feature"
  git commit -am "Quick commit"
  git commit --amend
  git commit --amend -m "New message"`
    },
    status: {
      title: 'git status',
      content: `Show the working tree status.

SYNTAX:
  git status [<options>] [--] [<pathspec>...]

DESCRIPTION:
  Displays the state of the working directory and staging area.

OPTIONS:
  -s, --short
    Give the output in the short-format
  -b, --branch
    Show the branch and tracking info
  --porcelain
    Give the output in a stable, easy-to-parse format

EXAMPLES:
  git status
  git status -s
  git status --short`
    },
    log: {
      title: 'git log',
      content: `Show commit logs.

SYNTAX:
  git log [<options>] [<revision-range>] [[--] <path>]

DESCRIPTION:
  Lists commits in reverse chronological order.

OPTIONS:
  --oneline
    Show each commit on a single line
  -n, --max-count <number>
    Limit the number of commits
  --graph
    Draw a text-based graphical representation
  --all
    Show all branches
  --decorate
    Show ref names
  -p, --patch
    Show the patch (diff) for each commit
  --stat
    Show statistics about files changed

EXAMPLES:
  git log
  git log --oneline
  git log -5
  git log --graph --oneline --all
  git log --stat`
    },
    branch: {
      title: 'git branch',
      content: `List, create, or delete branches.

SYNTAX:
  git branch [<options>] [-r | -a] [--merged | --no-merged]
  git branch [<options>] [-f] <branchname> [<start-point>]
  git branch [<options>] [-d | -D] <branchname>...

DESCRIPTION:
  Without arguments, lists existing branches. With a branch name, creates a new branch.

OPTIONS:
  -a, --all
    List both remote-tracking and local branches
  -r, --remotes
    List remote-tracking branches
  -d, --delete
    Delete a branch (only if merged)
  -D
    Force delete a branch
  -m, --move
    Rename a branch
  --merged
    List only merged branches

EXAMPLES:
  git branch
  git branch feature-x
  git branch -a
  git branch -d old-feature
  git branch -m old-name new-name`
    },
    checkout: {
      title: 'git checkout / switch',
      content: `Switch branches or restore working tree files.

SYNTAX:
  git checkout [<options>] <branch>
  git checkout -b <new-branch> [<start-point>]
  git switch [<options>] <branch>
  git switch -c <new-branch> [<start-point>]

DESCRIPTION:
  Switches to the specified branch or creates a new branch and switches to it.

OPTIONS:
  -b <branch>
    Create a new branch and switch to it
  -c <branch>
    Create a new branch and switch to it (git switch)
  --track
    Set up tracking information

EXAMPLES:
  git checkout main
  git checkout -b feature-x
  git switch main
  git switch -c feature-x`
    },
    merge: {
      title: 'git merge',
      content: `Join two or more development histories together.

SYNTAX:
  git merge [<options>] [<commit>...]

DESCRIPTION:
  Incorporates changes from the named commits into the current branch.

OPTIONS:
  --no-ff
    Create a merge commit even if fast-forward is possible
  --squash
    Create a single commit instead of merging
  --abort
    Abort the current merge
  -m <msg>
    Set the merge commit message

EXAMPLES:
  git merge feature-x
  git merge --no-ff feature-x
  git merge --squash feature-x
  git merge --abort`
    },
    rebase: {
      title: 'git rebase',
      content: `Reapply commits on top of another base tip.

SYNTAX:
  git rebase [<options>] [<upstream>] [<branch>]
  git rebase [<options>] --interactive [<base>]

DESCRIPTION:
  Takes commits from one branch and replays them on another branch.

OPTIONS:
  -i, --interactive
    Start an interactive rebase session
  --continue
    Continue the rebase after resolving conflicts
  --abort
    Abort the rebase operation
  --skip
    Skip the current commit

INTERACTIVE REBASE COMMANDS:
  pick, p    Use commit as-is
  reword, r  Use commit, but edit the message
  edit, e    Use commit, but stop for amending
  squash, s  Use commit, but meld into previous
  fixup, f   Like squash, but discard message
  drop, d    Remove commit

EXAMPLES:
  git rebase main
  git rebase -i HEAD~3
  git rebase --continue
  git rebase --abort`
    },
    remote: {
      title: 'git remote',
      content: `Manage set of tracked repositories.

SYNTAX:
  git remote [-v | --verbose]
  git remote add <name> <url>
  git remote remove <name>
  git remote set-url <name> <url>

DESCRIPTION:
  Manages remote repository connections.

OPTIONS:
  -v, --verbose
    Show remote URLs

EXAMPLES:
  git remote
  git remote -v
  git remote add origin https://github.com/user/repo.git
  git remote remove origin
  git remote set-url origin https://github.com/user/newrepo.git`
    },
    fetch: {
      title: 'git fetch',
      content: `Download objects and refs from another repository.

SYNTAX:
  git fetch [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Downloads commits, files, and refs from a remote repository without merging.

OPTIONS:
  --all
    Fetch all remotes
  --prune
    Remove remote-tracking references that no longer exist

EXAMPLES:
  git fetch
  git fetch origin
  git fetch --all
  git fetch origin main`
    },
    pull: {
      title: 'git pull',
      content: `Fetch from and integrate with another repository.

SYNTAX:
  git pull [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Fetches from a remote and merges into the current branch.

OPTIONS:
  --rebase
    Rebase instead of merge
  --ff-only
    Only fast-forward if possible
  --no-ff
    Always create a merge commit

EXAMPLES:
  git pull
  git pull origin main
  git pull --rebase
  git pull --rebase origin main`
    },
    push: {
      title: 'git push',
      content: `Update remote refs along with associated objects.

SYNTAX:
  git push [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Uploads local branch commits to the remote repository.

OPTIONS:
  -u, --set-upstream
    Set upstream for the branch
  --force, -f
    Force push (overwrites remote)
  --all
    Push all branches

EXAMPLES:
  git push
  git push origin main
  git push -u origin feature-x
  git push --all`
    },
    reset: {
      title: 'git reset',
      content: `Reset current HEAD to the specified state.

SYNTAX:
  git reset [<mode>] [<commit>]

DESCRIPTION:
  Moves the current branch to the specified commit.

MODES:
  --soft
    Keep changes staged
  --mixed (default)
    Keep changes in working directory, unstaged
  --hard
    Discard all changes

EXAMPLES:
  git reset HEAD~1
  git reset --soft HEAD~1
  git reset --hard HEAD~1
  git reset --hard origin/main`
    },
    stash: {
      title: 'git stash',
      content: `Stash changes in a dirty working directory.

SYNTAX:
  git stash [push [<options>] [--] [<pathspec>...]]
  git stash list
  git stash pop [<stash>]
  git stash apply [<stash>]
  git stash drop [<stash>]

DESCRIPTION:
  Temporarily saves uncommitted changes.

OPTIONS:
  -u, --include-untracked
    Include untracked files
  -m, --message <msg>
    Add a message to the stash

EXAMPLES:
  git stash
  git stash list
  git stash pop
  git stash apply
  git stash drop stash@{0}`
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-slate-800 pr-4">
        <h3 className="text-white font-semibold mb-4">Commands</h3>
        <div className="space-y-1">
          {Object.keys(gitCommands).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCommand(key)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCommand === key
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {gitCommands[key].title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pl-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">{gitCommands[selectedCommand].title}</h2>
        <div className="prose prose-invert max-w-none">
          <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {gitCommands[selectedCommand].content}
          </pre>
        </div>
      </div>
    </div>
  );
};

const GitLearningPlatform = () => {
  const [currentStage, setCurrentStage] = useState(null);
  const [completedStages, setCompletedStages] = useState(new Set());
  const [userInput, setUserInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal'); // 'terminal' or 'docs'
  const [rebaseTodoList, setRebaseTodoList] = useState(null);
  const [rebaseTodoText, setRebaseTodoText] = useState('');
  const [conflictEditor, setConflictEditor] = useState(null); // { file, ours, theirs, resolved }
  const terminalRef = useRef(null);

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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

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
            validator: (cmd) => cmd.trim() === 'git init',
            expectedCommand: 'git init'
          },
          {
            instruction: 'Check the status of your repository',
            hints: ['Use git status to see the current state', 'This shows tracked and untracked files'],
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'View available Git commands using --help',
            hints: ['Try git --help to see command overview'],
            validator: (cmd) => cmd.trim() === 'git --help' || cmd.trim() === 'git help',
            expectedCommand: 'git --help'
          }
        ]
      },
      {
        id: 'add-commit',
        title: 'Add and Commit Changes',
        description: 'Learn the basic Git workflow',
        setup: (state) => ({
          ...state,
          initialized: true,
          workingDirectory: { 'README.md': '# My Project\nWelcome to my project!' }
        }),
        steps: [
          {
            instruction: 'Check the current status to see untracked files',
            hints: ['Use git status'],
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Add the file "README.md" to staging',
            hints: ['Use git add to stage files', 'Format: git add <filename>'],
            validator: (cmd) => cmd.trim() === 'git add README.md',
            expectedCommand: 'git add README.md'
          },
          {
            instruction: 'Check status to see the staged file',
            hints: ['Use git status again', 'Staged files show in green'],
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Commit the staged changes with message "Initial commit"',
            hints: ['Use git commit with -m flag', 'Format: git commit -m "message"'],
            validator: (cmd) => cmd.trim() === 'git commit -m "Initial commit"',
            expectedCommand: 'git commit -m "Initial commit"'
          },
          {
            instruction: 'View your commit history',
            hints: ['Use git log to see commits'],
            validator: (cmd) => cmd.trim() === 'git log' || cmd.trim() === 'git log --oneline',
            expectedCommand: 'git log'
          }
        ]
      },
      {
        id: 'add-multiple',
        title: 'Staging Multiple Files',
        description: 'Learn different ways to stage files',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: {},
          workingDirectory: {
            'index.html': '<html><body>Hello</body></html>',
            'style.css': 'body { margin: 0; }',
            'app.js': 'console.log("Hello");'
          }
        }),
        steps: [
          {
            instruction: 'Check status to see all untracked files',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Add all files at once using "git add ."',
            hints: ['The dot means "all files in current directory"'],
            validator: (cmd) => cmd.trim() === 'git add .',
            expectedCommand: 'git add .'
          },
          {
            instruction: 'Check status to confirm all files are staged',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Commit with message "Add web files"',
            validator: (cmd) => cmd.trim() === 'git commit -m "Add web files"',
            expectedCommand: 'git commit -m "Add web files"'
          }
        ]
      },
      {
        id: 'modify-track',
        title: 'Modify and Track Changes',
        description: 'Learn how Git tracks file modifications',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'console.log("Hello");' },
          commits: [{ hash: 'a1b2c3d', message: 'Add app.js', files: { 'app.js': 'console.log("Hello");' } }],
          workingDirectory: { 'app.js': 'console.log("Hello World!");' }
        }),
        steps: [
          {
            instruction: 'Check status to see the modified file',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'View the differences in app.js',
            hints: ['Use git diff to see changes'],
            validator: (cmd) => cmd.trim() === 'git diff' || cmd.trim() === 'git diff app.js',
            expectedCommand: 'git diff'
          },
          {
            instruction: 'Stage the modified file',
            validator: (cmd) => cmd.trim() === 'git add app.js',
            expectedCommand: 'git add app.js'
          },
          {
            instruction: 'Commit with message "Update greeting"',
            validator: (cmd) => cmd.trim() === 'git commit -m "Update greeting"',
            expectedCommand: 'git commit -m "Update greeting"'
          }
        ]
      },
      {
        id: 'view-history',
        title: 'Viewing Commit History',
        description: 'Learn different ways to view Git history',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [
            { hash: 'abc1234', message: 'Initial commit', files: {} },
            { hash: 'def5678', message: 'Add feature', files: {} },
            { hash: 'ghi9012', message: 'Fix bug', files: {} },
            { hash: 'jkl3456', message: 'Update docs', files: {} }
          ]
        }),
        steps: [
          {
            instruction: 'View the full commit log',
            validator: (cmd) => cmd.trim() === 'git log',
            expectedCommand: 'git log'
          },
          {
            instruction: 'View log in compact one-line format',
            hints: ['Add --oneline flag'],
            validator: (cmd) => cmd.trim() === 'git log --oneline',
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'View the last 2 commits only',
            hints: ['Use -n flag or just -2'],
            validator: (cmd) => cmd.trim() === 'git log -2' || cmd.trim() === 'git log -n 2',
            expectedCommand: 'git log -2'
          }
        ]
      }
    ],
    intermediate: [
      {
        id: 'branching',
        title: 'Creating and Switching Branches',
        description: 'Learn to work with branches',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [{ hash: 'abc123', message: 'Initial commit', files: {} }]
        }),
        steps: [
          {
            instruction: 'List all current branches',
            validator: (cmd) => cmd.trim() === 'git branch',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'Create a new branch called "feature"',
            hints: ['Use git branch <name>'],
            validator: (cmd) => cmd.trim() === 'git branch feature',
            expectedCommand: 'git branch feature'
          },
          {
            instruction: 'List branches again to see your new branch',
            validator: (cmd) => cmd.trim() === 'git branch',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'Switch to the feature branch',
            hints: ['Use git checkout or git switch'],
            validator: (cmd) => cmd.trim() === 'git checkout feature' || cmd.trim() === 'git switch feature',
            expectedCommand: 'git checkout feature'
          },
          {
            instruction: 'Check status to confirm branch switch',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'branch-create-switch',
        title: 'Create and Switch in One Command',
        description: 'Efficient branch creation workflow',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [{ hash: 'abc123', message: 'Initial commit', files: {} }]
        }),
        steps: [
          {
            instruction: 'Create and switch to "bugfix" branch in one command',
            hints: ['Use git checkout -b or git switch -c'],
            validator: (cmd) => cmd.trim() === 'git checkout -b bugfix' || cmd.trim() === 'git switch -c bugfix',
            expectedCommand: 'git checkout -b bugfix'
          },
          {
            instruction: 'Verify you are on the bugfix branch',
            validator: (cmd) => cmd.trim() === 'git branch' || cmd.trim() === 'git status',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'Switch back to main branch',
            validator: (cmd) => cmd.trim() === 'git checkout main' || cmd.trim() === 'git switch main',
            expectedCommand: 'git checkout main'
          },
          {
            instruction: 'Delete the bugfix branch',
            hints: ['Use git branch -d <name>'],
            validator: (cmd) => cmd.trim() === 'git branch -d bugfix',
            expectedCommand: 'git branch -d bugfix'
          }
        ]
      },
      {
        id: 'merging',
        title: 'Merging Branches',
        description: 'Combine work from different branches',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature'],
          currentBranch: 'main',
          files: { 'main.txt': 'Main content' },
          commits: [
            { hash: 'a1b2c3', message: 'Initial commit', branch: 'main', files: { 'main.txt': 'Main content' } }
          ],
          featureCommits: [
            { hash: 'f1e2d3', message: 'Add feature', branch: 'feature', files: { 'feature.txt': 'Feature content' } }
          ]
        }),
        steps: [
          {
            instruction: 'Check which branch you are on',
            validator: (cmd) => cmd.trim() === 'git status' || cmd.trim() === 'git branch',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Make sure you are on main branch',
            hints: ['Switch to main if not already there'],
            validator: (cmd) => cmd.trim() === 'git checkout main' || cmd.trim() === 'git switch main',
            expectedCommand: 'git checkout main'
          },
          {
            instruction: 'Merge the feature branch into main',
            validator: (cmd) => cmd.trim() === 'git merge feature',
            expectedCommand: 'git merge feature'
          },
          {
            instruction: 'View the commit log to see merge result',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'conflicts',
        title: 'Resolving Merge Conflicts',
        description: 'Handle conflicts when merging branches',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature-a'],
          currentBranch: 'main',
          files: { 'config.txt': 'port=3000' },
          commits: [{ hash: 'abc123', message: 'Initial config', files: { 'config.txt': 'port=3000' } }],
          pendingConflict: {
            branch: 'feature-a',
            file: 'config.txt',
            ours: 'port=3000',
            theirs: 'port=8080'
          }
        }),
        steps: [
          {
            instruction: 'Try to merge feature-a branch (this will create a conflict)',
            validator: (cmd) => cmd.trim() === 'git merge feature-a',
            expectedCommand: 'git merge feature-a'
          },
          {
            instruction: 'Check status to see the conflicted file',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'View the conflicted file contents',
            hints: ['Use cat config.txt'],
            validator: (cmd) => cmd.trim() === 'cat config.txt',
            expectedCommand: 'cat config.txt'
          },
          {
            instruction: 'Resolve the conflict in the editor that opened, then add the file to staging',
            hints: ['Edit the file in the conflict editor to remove conflict markers', 'Click "Mark as Resolved" in the editor', 'Then run git add config.txt'],
            validator: (cmd) => cmd.trim() === 'git add config.txt',
            expectedCommand: 'git add config.txt'
          },
          {
            instruction: 'Complete the merge with a commit',
            validator: (cmd) => cmd.trim().startsWith('git commit'),
            expectedCommand: 'git commit -m "Resolve conflict"'
          }
        ]
      },
      {
        id: 'unstage',
        title: 'Unstaging Files',
        description: 'Learn to remove files from staging area',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'old content' },
          stagedFiles: { 'mistake.txt': 'Wrong file', 'correct.txt': 'Right file' },
          workingDirectory: { 'mistake.txt': 'Wrong file', 'correct.txt': 'Right file' }
        }),
        steps: [
          {
            instruction: 'Check status to see staged files',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Unstage mistake.txt using git restore',
            hints: ['Use git restore --staged <file>'],
            validator: (cmd) => cmd.trim() === 'git restore --staged mistake.txt' || cmd.trim() === 'git reset HEAD mistake.txt',
            expectedCommand: 'git restore --staged mistake.txt'
          },
          {
            instruction: 'Check status to confirm only correct.txt is staged',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Commit the correct file',
            validator: (cmd) => cmd.trim().startsWith('git commit -m'),
            expectedCommand: 'git commit -m "Add correct file"'
          }
        ]
      },
      {
        id: 'discard-changes',
        title: 'Discarding Changes',
        description: 'Undo modifications to files',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'console.log("Original");' },
          workingDirectory: { 'app.js': 'console.log("Bad changes I want to undo");' },
          commits: [{ hash: 'abc123', message: 'Add app', files: { 'app.js': 'console.log("Original");' } }]
        }),
        steps: [
          {
            instruction: 'Check status to see modified file',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'View the unwanted changes',
            validator: (cmd) => cmd.trim() === 'git diff' || cmd.trim() === 'git diff app.js',
            expectedCommand: 'git diff'
          },
          {
            instruction: 'Discard changes to app.js',
            hints: ['Use git restore or git checkout -- <file>'],
            validator: (cmd) => cmd.trim() === 'git restore app.js' || cmd.trim() === 'git checkout -- app.js',
            expectedCommand: 'git restore app.js'
          },
          {
            instruction: 'Verify the file is back to original',
            validator: (cmd) => cmd.trim() === 'git status' || cmd.trim() === 'cat app.js',
            expectedCommand: 'git status'
          }
        ]
      }
    ],
    advanced: [
      {
        id: 'stash',
        title: 'Stashing Changes',
        description: 'Temporarily save uncommitted work',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'original' },
          workingDirectory: { 'work-in-progress.txt': 'Important WIP code' },
          commits: [{ hash: 'abc123', message: 'Initial', files: {} }]
        }),
        steps: [
          {
            instruction: 'Check status to see uncommitted changes',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Stash your changes',
            hints: ['Use git stash'],
            validator: (cmd) => cmd.trim() === 'git stash' || cmd.trim() === 'git stash save' || cmd.trim().startsWith('git stash push'),
            expectedCommand: 'git stash'
          },
          {
            instruction: 'Check status (should be clean now)',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'List your stashed changes',
            validator: (cmd) => cmd.trim() === 'git stash list',
            expectedCommand: 'git stash list'
          },
          {
            instruction: 'Apply the stashed changes back',
            hints: ['Use git stash pop or git stash apply'],
            validator: (cmd) => cmd.trim() === 'git stash pop' || cmd.trim() === 'git stash apply',
            expectedCommand: 'git stash pop'
          },
          {
            instruction: 'Verify changes are restored',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'rebase-basic',
        title: 'Rebasing Branches',
        description: 'Learn to rebase for a cleaner history',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature'],
          currentBranch: 'feature',
          commits: [
            { hash: 'a1b2c3', message: 'Initial commit', branch: 'main' },
            { hash: 'g7h8i9', message: 'Main update', branch: 'main' }
          ],
          featureBranchBase: 'a1b2c3',
          featureCommits: [
            { hash: 'd4e5f6', message: 'Feature work', branch: 'feature' }
          ]
        }),
        steps: [
          {
            instruction: 'Check which branch you are on',
            validator: (cmd) => cmd.trim() === 'git status' || cmd.trim() === 'git branch',
            expectedCommand: 'git status'
          },
          {
            instruction: 'View current commit history',
            validator: (cmd) => cmd.trim() === 'git log --oneline' || cmd.trim() === 'git log',
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Rebase feature branch onto main',
            hints: ['Use git rebase main while on feature branch'],
            validator: (cmd) => cmd.trim() === 'git rebase main',
            expectedCommand: 'git rebase main'
          },
          {
            instruction: 'View the rebased history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'reset-soft',
        title: 'Soft Reset',
        description: 'Undo commits while keeping changes staged',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'file1.txt': 'content1', 'file2.txt': 'content2' },
          commits: [
            { hash: 'abc1234', message: 'First commit', files: { 'file1.txt': 'content1' } },
            { hash: 'def5678', message: 'Second commit', files: { 'file2.txt': 'content2' } },
            { hash: 'ghi9012', message: 'Commit to undo', files: { 'oops.txt': 'mistake' } }
          ]
        }),
        steps: [
          {
            instruction: 'View the commit log',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Soft reset to undo last commit but keep changes staged',
            hints: ['Use git reset --soft HEAD~1'],
            validator: (cmd) => cmd.trim() === 'git reset --soft HEAD~1' || cmd.trim() === 'git reset --soft HEAD^',
            expectedCommand: 'git reset --soft HEAD~1'
          },
          {
            instruction: 'Check status to see changes are still staged',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'reset-mixed',
        title: 'Mixed Reset (Default)',
        description: 'Undo commits, unstage changes',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'base.txt': 'base' },
          commits: [
            { hash: 'aaa1111', message: 'Base commit', files: { 'base.txt': 'base' } },
            { hash: 'bbb2222', message: 'Bad commit', files: { 'bad.txt': 'bad' } }
          ]
        }),
        steps: [
          {
            instruction: 'View current commits',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Reset to undo commit (changes become unstaged)',
            hints: ['Use git reset HEAD~1 (mixed is default)'],
            validator: (cmd) => cmd.trim() === 'git reset HEAD~1' || cmd.trim() === 'git reset --mixed HEAD~1',
            expectedCommand: 'git reset HEAD~1'
          },
          {
            instruction: 'Check status - changes should be unstaged',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'reset-hard',
        title: 'Hard Reset (Dangerous)',
        description: 'Completely discard commits and changes',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'keep.txt': 'keep this' },
          workingDirectory: { 'discard.txt': 'will be lost' },
          commits: [
            { hash: 'keep111', message: 'Good commit', files: { 'keep.txt': 'keep this' } },
            { hash: 'bad2222', message: 'Bad commit to discard', files: { 'bad.txt': 'bad' } }
          ]
        }),
        steps: [
          {
            instruction: 'View commits and working directory',
            validator: (cmd) => cmd.trim().startsWith('git log') || cmd.trim() === 'git status',
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Hard reset to previous commit (WARNING: loses all changes)',
            hints: ['Use git reset --hard HEAD~1'],
            validator: (cmd) => cmd.trim() === 'git reset --hard HEAD~1',
            expectedCommand: 'git reset --hard HEAD~1'
          },
          {
            instruction: 'Verify everything is gone',
            validator: (cmd) => cmd.trim() === 'git status' || cmd.trim() === 'ls',
            expectedCommand: 'git status'
          }
        ]
      },
      {
        id: 'revert',
        title: 'Reverting Commits',
        description: 'Safely undo commits with a new commit',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'broken code' },
          commits: [
            { hash: 'good111', message: 'Working version', files: { 'app.js': 'working code' } },
            { hash: 'bad2222', message: 'Broke everything', files: { 'app.js': 'broken code' } }
          ]
        }),
        steps: [
          {
            instruction: 'View commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Revert the last commit (creates a new commit)',
            hints: ['Use git revert HEAD'],
            validator: (cmd) => cmd.trim() === 'git revert HEAD' || cmd.trim().startsWith('git revert HEAD'),
            expectedCommand: 'git revert HEAD'
          },
          {
            instruction: 'View log to see the revert commit',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'cherry-pick',
        title: 'Cherry Picking Commits',
        description: 'Apply specific commits from other branches',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature'],
          currentBranch: 'main',
          commits: [
            { hash: 'main111', message: 'Main work', branch: 'main', files: {} }
          ],
          featureCommits: [
            { hash: 'feat111', message: 'Feature commit 1', branch: 'feature', files: {} },
            { hash: 'hotfix1', message: 'Important hotfix', branch: 'feature', files: { 'fix.txt': 'fix' } },
            { hash: 'feat222', message: 'Feature commit 2', branch: 'feature', files: {} }
          ],
          availableCherryPick: 'hotfix1'
        }),
        steps: [
          {
            instruction: 'Check you are on main branch',
            validator: (cmd) => cmd.trim() === 'git status' || cmd.trim() === 'git branch',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'View commits on feature branch',
            hints: ['Use git log feature --oneline'],
            validator: (cmd) => cmd.trim() === 'git log feature --oneline' || cmd.trim() === 'git log feature',
            expectedCommand: 'git log feature --oneline'
          },
          {
            instruction: 'Cherry-pick the hotfix commit (hotfix1) to main',
            hints: ['Use git cherry-pick <hash>'],
            validator: (cmd) => cmd.trim() === 'git cherry-pick hotfix1',
            expectedCommand: 'git cherry-pick hotfix1'
          },
          {
            instruction: 'Verify the commit was applied',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'tags',
        title: 'Working with Tags',
        description: 'Create and manage version tags',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [
            { hash: 'v1comm', message: 'Version 1.0 release', files: {} },
            { hash: 'v11com', message: 'Bug fixes', files: {} },
            { hash: 'v2comm', message: 'Version 2.0 release', files: {} }
          ]
        }),
        steps: [
          {
            instruction: 'View commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Create a lightweight tag "v2.0" on current commit',
            hints: ['Use git tag <tagname>'],
            validator: (cmd) => cmd.trim() === 'git tag v2.0',
            expectedCommand: 'git tag v2.0'
          },
          {
            instruction: 'List all tags',
            validator: (cmd) => cmd.trim() === 'git tag' || cmd.trim() === 'git tag -l',
            expectedCommand: 'git tag'
          },
          {
            instruction: 'Create annotated tag "v2.0.1" with message',
            hints: ['Use git tag -a v2.0.1 -m "message"'],
            validator: (cmd) => cmd.trim().startsWith('git tag -a v2.0.1'),
            expectedCommand: 'git tag -a v2.0.1 -m "Hotfix release"'
          },
          {
            instruction: 'View tag details',
            hints: ['Use git show <tagname>'],
            validator: (cmd) => cmd.trim() === 'git show v2.0.1' || cmd.trim() === 'git show v2.0',
            expectedCommand: 'git show v2.0.1'
          }
        ]
      }
    ],
    remote: [
      {
        id: 'remote-setup',
        title: 'Setting Up Remotes',
        description: 'Connect your local repo to a remote',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [{ hash: 'local1', message: 'Local commit', files: {} }]
        }),
        steps: [
          {
            instruction: 'List current remotes (should be empty)',
            validator: (cmd) => cmd.trim() === 'git remote' || cmd.trim() === 'git remote -v',
            expectedCommand: 'git remote'
          },
          {
            instruction: 'Add a remote called "origin"',
            hints: ['Use git remote add origin <url>'],
            validator: (cmd) => cmd.trim().startsWith('git remote add origin'),
            expectedCommand: 'git remote add origin https://github.com/user/repo.git'
          },
          {
            instruction: 'Verify the remote was added',
            validator: (cmd) => cmd.trim() === 'git remote -v',
            expectedCommand: 'git remote -v'
          }
        ]
      },
      {
        id: 'fetch',
        title: 'Fetching from Remote',
        description: 'Download remote changes without merging',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          commits: [{ hash: 'local1', message: 'Local commit', files: {} }],
          remoteCommits: {
            origin: [
              { hash: 'local1', message: 'Local commit', files: {} },
              { hash: 'remote1', message: 'Remote commit 1', files: {} },
              { hash: 'remote2', message: 'Remote commit 2', files: {} }
            ]
          },
          remoteBranches: { 'origin/main': 'remote2' }
        }),
        steps: [
          {
            instruction: 'Check current remote configuration',
            validator: (cmd) => cmd.trim() === 'git remote -v',
            expectedCommand: 'git remote -v'
          },
          {
            instruction: 'Fetch updates from origin',
            hints: ['Use git fetch or git fetch origin'],
            validator: (cmd) => cmd.trim() === 'git fetch' || cmd.trim() === 'git fetch origin',
            expectedCommand: 'git fetch origin'
          },
          {
            instruction: 'View all branches including remote-tracking branches',
            hints: ['Use git branch -a'],
            validator: (cmd) => cmd.trim() === 'git branch -a' || cmd.trim() === 'git branch --all',
            expectedCommand: 'git branch -a'
          },
          {
            instruction: 'View commits on origin/main',
            validator: (cmd) => cmd.trim() === 'git log origin/main --oneline' || cmd.trim() === 'git log origin/main',
            expectedCommand: 'git log origin/main --oneline'
          }
        ]
      },
      {
        id: 'pull',
        title: 'Pulling Changes',
        description: 'Fetch and merge remote changes',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          commits: [{ hash: 'shared1', message: 'Shared commit', files: { 'readme.md': 'Hello' } }],
          files: { 'readme.md': 'Hello' },
          remoteCommits: {
            origin: [
              { hash: 'shared1', message: 'Shared commit', files: { 'readme.md': 'Hello' } },
              { hash: 'newrem1', message: 'Remote update', files: { 'readme.md': 'Hello World' } }
            ]
          },
          remoteBranches: { 'origin/main': 'newrem1' }
        }),
        steps: [
          {
            instruction: 'View your current commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Pull changes from origin main',
            hints: ['Use git pull origin main or just git pull'],
            validator: (cmd) => cmd.trim() === 'git pull' || cmd.trim() === 'git pull origin main',
            expectedCommand: 'git pull origin main'
          },
          {
            instruction: 'View updated commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'push',
        title: 'Pushing Changes',
        description: 'Upload your commits to remote',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          commits: [
            { hash: 'base111', message: 'Base commit', files: {} },
            { hash: 'local11', message: 'My local work', files: { 'feature.js': 'code' } }
          ],
          files: { 'feature.js': 'code' },
          remoteCommits: {
            origin: [{ hash: 'base111', message: 'Base commit', files: {} }]
          },
          remoteBranches: { 'origin/main': 'base111' },
          upstreamSet: false
        }),
        steps: [
          {
            instruction: 'Check your local commits',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Push your commits to origin',
            hints: ['Use git push origin main'],
            validator: (cmd) => cmd.trim() === 'git push' || cmd.trim() === 'git push origin main',
            expectedCommand: 'git push origin main'
          },
          {
            instruction: 'Set upstream and push (for future pushes)',
            hints: ['Use git push -u origin main'],
            validator: (cmd) => cmd.trim() === 'git push -u origin main' || cmd.trim() === 'git push --set-upstream origin main',
            expectedCommand: 'git push -u origin main'
          }
        ]
      },
      {
        id: 'push-force',
        title: 'Force Pushing',
        description: 'Override remote history (use carefully!)',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          commits: [
            { hash: 'base111', message: 'Base commit', files: {} },
            { hash: 'rewrite1', message: 'Rewritten history', files: {} }
          ],
          remoteCommits: {
            origin: [
              { hash: 'base111', message: 'Base commit', files: {} },
              { hash: 'oldcomm', message: 'Old commit (will be overwritten)', files: {} }
            ]
          },
          remoteBranches: { 'origin/main': 'oldcomm' },
          diverged: true
        }),
        steps: [
          {
            instruction: 'Try regular push (this will fail due to diverged history)',
            validator: (cmd) => cmd.trim() === 'git push' || cmd.trim() === 'git push origin main',
            expectedCommand: 'git push origin main'
          },
          {
            instruction: 'Force push to override remote (DANGEROUS)',
            hints: ['Use git push --force or git push -f'],
            validator: (cmd) => cmd.trim() === 'git push --force' || cmd.trim() === 'git push -f' || cmd.trim() === 'git push --force origin main' || cmd.trim() === 'git push -f origin main',
            expectedCommand: 'git push --force'
          },
          {
            instruction: 'Safer alternative: force-with-lease',
            hints: ['Use git push --force-with-lease'],
            validator: (cmd) => cmd.trim().includes('--force-with-lease'),
            expectedCommand: 'git push --force-with-lease'
          }
        ]
      },
      {
        id: 'pull-rebase',
        title: 'Pull with Rebase',
        description: 'Keep history linear when pulling',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          currentBranch: 'main',
          commits: [
            { hash: 'shared1', message: 'Shared base', files: {} },
            { hash: 'mywork1', message: 'My local work', files: {} }
          ],
          remoteCommits: {
            origin: [
              { hash: 'shared1', message: 'Shared base', files: {} },
              { hash: 'their11', message: 'Their work', files: {} }
            ]
          },
          remoteBranches: { 'origin/main': 'their11' }
        }),
        steps: [
          {
            instruction: 'View your local commits',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Pull with rebase to avoid merge commit',
            hints: ['Use git pull --rebase'],
            validator: (cmd) => cmd.trim() === 'git pull --rebase' || cmd.trim() === 'git pull --rebase origin main',
            expectedCommand: 'git pull --rebase'
          },
          {
            instruction: 'View the clean linear history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'clone',
        title: 'Cloning Repositories',
        description: 'Download a complete repository',
        setup: (state) => ({
          ...state,
          initialized: false // Simulating fresh start
        }),
        steps: [
          {
            instruction: 'Clone a repository from GitHub',
            hints: ['Use git clone <url>'],
            validator: (cmd) => cmd.trim().startsWith('git clone'),
            expectedCommand: 'git clone https://github.com/user/awesome-project.git'
          },
          {
            instruction: 'List files in the cloned repo',
            validator: (cmd) => cmd.trim() === 'ls' || cmd.trim() === 'ls -la',
            expectedCommand: 'ls'
          },
          {
            instruction: 'Check the remote configuration',
            validator: (cmd) => cmd.trim() === 'git remote -v',
            expectedCommand: 'git remote -v'
          },
          {
            instruction: 'View the commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'push-branch',
        title: 'Pushing Feature Branches',
        description: 'Share branches with teammates',
        setup: (state) => ({
          ...state,
          initialized: true,
          remotes: { origin: 'https://github.com/user/repo.git' },
          branches: ['main', 'feature-login'],
          currentBranch: 'feature-login',
          commits: [
            { hash: 'main111', message: 'Main commit', branch: 'main', files: {} }
          ],
          featureCommits: [
            { hash: 'feat111', message: 'Add login form', branch: 'feature-login', files: {} },
            { hash: 'feat222', message: 'Add validation', branch: 'feature-login', files: {} }
          ],
          remoteBranches: { 'origin/main': 'main111' }
        }),
        steps: [
          {
            instruction: 'Confirm you are on feature-login branch',
            validator: (cmd) => cmd.trim() === 'git branch' || cmd.trim() === 'git status',
            expectedCommand: 'git branch'
          },
          {
            instruction: 'Push feature branch to remote',
            hints: ['Use git push -u origin feature-login'],
            validator: (cmd) => cmd.trim() === 'git push -u origin feature-login' || cmd.trim() === 'git push origin feature-login',
            expectedCommand: 'git push -u origin feature-login'
          },
          {
            instruction: 'List all branches including remote',
            validator: (cmd) => cmd.trim() === 'git branch -a',
            expectedCommand: 'git branch -a'
          }
        ]
      }
    ],
    expert: [
      {
        id: 'interactive-rebase',
        title: 'Interactive Rebase',
        description: 'Rewrite commit history interactively',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [
            { hash: 'base111', message: 'Base commit', files: {} },
            { hash: 'wip1111', message: 'WIP', files: {} },
            { hash: 'wip2222', message: 'WIP again', files: {} },
            { hash: 'wip3333', message: 'More WIP', files: {} },
            { hash: 'finish1', message: 'Finished feature', files: {} }
          ],
          rebaseInProgress: false,
          rebaseCommits: [],
          rebaseBaseCommit: null
        }),
        steps: [
          {
            instruction: 'View messy commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Start interactive rebase for last 4 commits',
            hints: ['Use git rebase -i HEAD~4', 'This will open an editor to modify the commit history'],
            validator: (cmd, state) => {
              const trimmed = cmd.trim();
              // Check if command matches - be flexible with variations
              if (trimmed === 'git rebase -i HEAD~4' || 
                  trimmed === 'git rebase --interactive HEAD~4') {
                return true;
              }
              // Also accept if rebase actually started (state was updated)
              if (state && state.rebaseInProgress) {
                return true;
              }
              // Check for HEAD~4 pattern more flexibly
              if (trimmed.includes('git rebase') && 
                  (trimmed.includes('-i') || trimmed.includes('--interactive')) &&
                  trimmed.includes('HEAD~4')) {
                return true;
              }
              return false;
            },
            expectedCommand: 'git rebase -i HEAD~4'
          },
          {
            instruction: 'In the rebase editor: Change "pick" to "squash" (or "s") for the 3 WIP commits to combine them, then click Continue',
            hints: [
              'The editor shows: pick wip1111 WIP, pick wip2222 WIP again, etc.',
              'Change "pick" to "squash" (or "s") for commits wip1111, wip2222, and wip3333',
              'Keep "pick" for finish1 (the last commit)',
              'Example: pick wip1111 WIP → squash wip1111 WIP',
              'After editing, click the "Continue" button in the editor'
            ],
            validator: (cmd, state, prevState) => {
              // Check if command is continue - after continue, rebaseInProgress becomes false
              const cmdMatches = cmd.trim() === 'git rebase --continue';
              // Rebase was in progress before (prevState) and now it's complete (state.rebaseInProgress is false)
              // OR if command matches and rebase completed successfully
              return cmdMatches && (prevState?.rebaseInProgress === true && state.rebaseInProgress === false);
            },
            expectedCommand: 'git rebase --continue'
          },
          {
            instruction: 'View the cleaned up history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ]
      },
      {
        id: 'bisect',
        title: 'Git Bisect',
        description: 'Find the commit that introduced a bug',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [
            { hash: 'good111', message: 'Working version', files: {}, good: true },
            { hash: 'comm222', message: 'Some changes', files: {} },
            { hash: 'comm333', message: 'More changes', files: {} },
            { hash: 'bug4444', message: 'Introduced bug here', files: {}, bad: true },
            { hash: 'comm555', message: 'Additional work', files: {} },
            { hash: 'bad6666', message: 'Current broken', files: {}, bad: true }
          ],
          bisecting: false
        }),
        steps: [
          {
            instruction: 'Start the bisect process',
            validator: (cmd) => cmd.trim() === 'git bisect start',
            expectedCommand: 'git bisect start'
          },
          {
            instruction: 'Mark current commit as bad',
            validator: (cmd) => cmd.trim() === 'git bisect bad',
            expectedCommand: 'git bisect bad'
          },
          {
            instruction: 'Mark a known good commit',
            hints: ['Use git bisect good <hash>'],
            validator: (cmd) => cmd.trim() === 'git bisect good good111',
            expectedCommand: 'git bisect good good111'
          },
          {
            instruction: 'Test current commit and mark as good or bad',
            hints: ['Git checked out a middle commit - test it'],
            validator: (cmd) => cmd.trim() === 'git bisect good' || cmd.trim() === 'git bisect bad',
            expectedCommand: 'git bisect bad'
          },
          {
            instruction: 'End bisect when bug is found',
            validator: (cmd) => cmd.trim() === 'git bisect reset',
            expectedCommand: 'git bisect reset'
          }
        ]
      },
      {
        id: 'reflog',
        title: 'Using Reflog',
        description: 'Recover lost commits and changes',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [
            { hash: 'kept111', message: 'Kept commit', files: {} }
          ],
          reflog: [
            { hash: 'kept111', action: 'commit', message: 'HEAD@{0}: commit: Kept commit' },
            { hash: 'lost111', action: 'reset', message: 'HEAD@{1}: reset: moving to HEAD~1' },
            { hash: 'lost222', action: 'commit', message: 'HEAD@{2}: commit: Important work (lost!)' },
            { hash: 'base111', action: 'commit', message: 'HEAD@{3}: commit: Base commit' }
          ],
          lostCommit: 'lost222'
        }),
        steps: [
          {
            instruction: 'View the reflog',
            validator: (cmd) => cmd.trim() === 'git reflog',
            expectedCommand: 'git reflog'
          },
          {
            instruction: 'Find and recover the lost commit',
            hints: ['Use git checkout or git reset to recover', 'The lost commit hash is lost222'],
            validator: (cmd, state) => {
              const trimmed = cmd.trim();
              // Accept checkout or reset with the lost commit hash
              return (trimmed.includes('lost222') || trimmed.includes('HEAD@{2}')) &&
                     (trimmed.startsWith('git checkout') || trimmed.startsWith('git reset'));
            },
            expectedCommand: 'git checkout lost222'
          },
          {
            instruction: 'Create a branch to save the recovered commit',
            hints: ['Use git branch <name> to create a branch', 'You can use any branch name'],
            validator: (cmd) => {
              const trimmed = cmd.trim();
              // Accept any branch name creation
              return (trimmed.startsWith('git branch ') && trimmed.split(' ').length >= 3) ||
                     (trimmed.startsWith('git checkout -b ') && trimmed.split(' ').length >= 4) ||
                     (trimmed.startsWith('git switch -c ') && trimmed.split(' ').length >= 4);
            },
            expectedCommand: 'git branch recovered'
          }
        ]
      },
      {
        id: 'worktrees',
        title: 'Git Worktrees',
        description: 'Work on multiple branches simultaneously',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature'],
          commits: [{ hash: 'abc123', message: 'Initial', files: {} }],
          worktrees: []
        }),
        steps: [
          {
            instruction: 'List current worktrees',
            validator: (cmd) => cmd.trim() === 'git worktree list',
            expectedCommand: 'git worktree list'
          },
          {
            instruction: 'Create a new worktree for feature branch',
            hints: ['Use git worktree add <path> <branch>'],
            validator: (cmd) => cmd.trim().startsWith('git worktree add'),
            expectedCommand: 'git worktree add ../feature-work feature'
          },
          {
            instruction: 'List worktrees again',
            validator: (cmd) => cmd.trim() === 'git worktree list',
            expectedCommand: 'git worktree list'
          },
          {
            instruction: 'Remove the worktree when done',
            validator: (cmd) => cmd.trim().startsWith('git worktree remove'),
            expectedCommand: 'git worktree remove ../feature-work'
          }
        ]
      },
      {
        id: 'submodules',
        title: 'Git Submodules',
        description: 'Include other repositories in your project',
        setup: (state) => ({
          ...state,
          initialized: true,
          commits: [{ hash: 'main111', message: 'Initial', files: {} }],
          submodules: []
        }),
        steps: [
          {
            instruction: 'Add a submodule to your project',
            hints: ['Use git submodule add <url> <path>'],
            validator: (cmd) => cmd.trim().startsWith('git submodule add'),
            expectedCommand: 'git submodule add https://github.com/lib/utils.git libs/utils'
          },
          {
            instruction: 'View submodule status',
            validator: (cmd) => cmd.trim() === 'git submodule status' || cmd.trim() === 'git submodule',
            expectedCommand: 'git submodule status'
          },
          {
            instruction: 'Initialize and update submodules',
            hints: ['Use git submodule update --init'],
            validator: (cmd) => cmd.trim().startsWith('git submodule update') || cmd.trim() === 'git submodule init',
            expectedCommand: 'git submodule update --init'
          }
        ]
      },
      {
        id: 'blame',
        title: 'Git Blame and Log Search',
        description: 'Find who changed what and when',
        setup: (state) => ({
          ...state,
          initialized: true,
          files: { 'app.js': 'function broken() {\n  return null; // bug here\n}' },
          commits: [
            { hash: 'auth111', message: 'Initial', author: 'alice', files: {} },
            { hash: 'auth222', message: 'Add function', author: 'bob', files: { 'app.js': 'function broken() {}' } },
            { hash: 'auth333', message: 'Update return', author: 'charlie', files: { 'app.js': 'function broken() {\n  return null; // bug here\n}' } }
          ]
        }),
        steps: [
          {
            instruction: 'Use blame to see who wrote each line',
            validator: (cmd) => cmd.trim() === 'git blame app.js',
            expectedCommand: 'git blame app.js'
          },
          {
            instruction: 'Search commits for a specific string',
            hints: ['Use git log -S "string"'],
            validator: (cmd) => cmd.trim().startsWith('git log -S'),
            expectedCommand: 'git log -S "return null"'
          },
          {
            instruction: 'View commits by a specific author',
            validator: (cmd) => cmd.trim().startsWith('git log --author'),
            expectedCommand: 'git log --author="bob"'
          }
        ]
      }
    ]
  };

  const executeGitCommand = (cmd, state, rebaseTodoState = null, conflictResolvedText = null) => {
    const trimmed = cmd.trim();
    const newState = { ...state };
    let output = [];
    let rebaseTodo = null;

    // Shell commands
    if (trimmed === 'ls' || trimmed === 'ls -la') {
      const allFiles = new Set([
        ...Object.keys(state.files || {}),
        ...Object.keys(state.workingDirectory || {}),
        ...Object.keys(state.stagedFiles || {})
      ]);
      if (state.initialized) allFiles.add('.git/');
      if (allFiles.size > 0) {
        Array.from(allFiles).sort().forEach(file => {
          output.push({ type: 'output', text: file });
        });
      } else {
        output.push({ type: 'output', text: '(empty directory)' });
      }
    } else if (trimmed.startsWith('cat ')) {
      const file = trimmed.replace('cat ', '').trim();
      
      // Check for conflict state
      if (state.conflictState && file === state.conflictState.file) {
        output.push({ type: 'output', text: '<<<<<<< HEAD' });
        output.push({ type: 'output', text: state.conflictState.ours });
        output.push({ type: 'output', text: '=======' });
        output.push({ type: 'output', text: state.conflictState.theirs });
        output.push({ type: 'output', text: '>>>>>>> feature-a' });
      } else {
        const content = state.workingDirectory[file] || state.files[file] || state.stagedFiles[file];
        if (content) {
          output.push({ type: 'output', text: content });
        } else {
          output.push({ type: 'error', text: `cat: ${file}: No such file or directory` });
        }
      }
    } else if (trimmed === 'pwd') {
      output.push({ type: 'output', text: '/home/user/project' });
    } else if (trimmed === 'clear') {
      return { newState, output: [], clear: true };
    } else if (trimmed.startsWith('echo ')) {
      const match = trimmed.match(/echo\s+["']?([^"'>]+)["']?\s*>\s*(\S+)/);
      if (match) {
        newState.workingDirectory = { ...state.workingDirectory, [match[2]]: match[1].trim() };
        output.push({ type: 'success', text: `Created ${match[2]}` });
      } else {
        output.push({ type: 'output', text: trimmed.replace('echo ', '').replace(/["']/g, '') });
      }
    } else if (trimmed.startsWith('rm ')) {
      const file = trimmed.replace('rm ', '').trim();
      if (state.workingDirectory[file] || state.files[file]) {
        newState.workingDirectory = { ...state.workingDirectory };
        delete newState.workingDirectory[file];
        output.push({ type: 'success', text: `Removed ${file}` });
      } else {
        output.push({ type: 'error', text: `rm: ${file}: No such file or directory` });
      }
    } else if (trimmed.startsWith('mkdir ')) {
      output.push({ type: 'success', text: `Created directory ${trimmed.replace('mkdir ', '')}` });
    } else if (trimmed === 'help' || trimmed === '--help') {
      output.push({ type: 'system', text: 'Available commands:' });
      output.push({ type: 'output', text: '  Git: init, status, add, commit, log, diff, branch, checkout, merge,' });
      output.push({ type: 'output', text: '       stash, rebase, reset, revert, cherry-pick, tag, remote, fetch,' });
      output.push({ type: 'output', text: '       pull, push, clone, blame, bisect, reflog, worktree, submodule' });
      output.push({ type: 'output', text: '  Shell: ls, cat, pwd, echo, rm, mkdir, clear, help' });
    }
    // Git --help
    else if (trimmed === 'git --help' || trimmed === 'git help') {
      output.push({ type: 'system', text: 'usage: git <command> [<args>]' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'Common Git commands:' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'start a working area:' });
      output.push({ type: 'output', text: '   clone      Clone a repository into a new directory' });
      output.push({ type: 'output', text: '   init       Create an empty Git repository' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'work on the current change:' });
      output.push({ type: 'output', text: '   add        Add file contents to the index' });
      output.push({ type: 'output', text: '   restore    Restore working tree files' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'examine the history and state:' });
      output.push({ type: 'output', text: '   diff       Show changes between commits' });
      output.push({ type: 'output', text: '   log        Show commit logs' });
      output.push({ type: 'output', text: '   status     Show the working tree status' });
      output.push({ type: 'output', text: '   blame      Show what revision and author last modified each line' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'grow, mark and tweak your history:' });
      output.push({ type: 'output', text: '   branch     List, create, or delete branches' });
      output.push({ type: 'output', text: '   commit     Record changes to the repository' });
      output.push({ type: 'output', text: '   merge      Join two or more development histories' });
      output.push({ type: 'output', text: '   rebase     Reapply commits on top of another base' });
      output.push({ type: 'output', text: '   reset      Reset current HEAD to the specified state' });
      output.push({ type: 'output', text: '   revert     Revert some existing commits' });
      output.push({ type: 'output', text: '   tag        Create, list, delete or verify tags' });
      output.push({ type: 'output', text: '' });
      output.push({ type: 'output', text: 'collaborate:' });
      output.push({ type: 'output', text: '   fetch      Download objects and refs from another repository' });
      output.push({ type: 'output', text: '   pull       Fetch from and integrate with another repository' });
      output.push({ type: 'output', text: '   push       Update remote refs along with associated objects' });
      output.push({ type: 'output', text: '   remote     Manage set of tracked repositories' });
    }
    // Git init
    else if (trimmed === 'git init') {
      if (state.initialized) {
        output.push({ type: 'output', text: 'Reinitialized existing Git repository in /home/user/project/.git/' });
      } else {
        newState.initialized = true;
        newState.branches = ['main'];
        newState.currentBranch = 'main';
        output.push({ type: 'success', text: 'Initialized empty Git repository in /home/user/project/.git/' });
      }
    }
    // Git status
    else if (trimmed === 'git status') {
      output.push({ type: 'output', text: `On branch ${state.currentBranch}` });
      
      if (state.rebaseInProgress) {
        output.push({ type: 'warning', text: 'rebase in progress; onto ' + state.rebaseTarget });
      }
      
      const stagedFiles = Object.keys(state.stagedFiles || {});
      const modifiedFiles = Object.keys(state.workingDirectory || {}).filter(
        f => state.files[f] && state.workingDirectory[f] !== state.files[f]
      );
      const untrackedFiles = Object.keys(state.workingDirectory || {}).filter(
        f => !state.files[f] && !state.stagedFiles[f]
      );

      if (state.conflictState) {
        output.push({ type: 'error', text: '\nYou have unmerged paths.' });
        output.push({ type: 'output', text: '  (fix conflicts and run "git commit")' });
        output.push({ type: 'output', text: '\nUnmerged paths:' });
        output.push({ type: 'error', text: `\tboth modified:   ${state.conflictState.file}` });
      } else if (stagedFiles.length > 0) {
        output.push({ type: 'success', text: '\nChanges to be committed:' });
        output.push({ type: 'output', text: '  (use "git restore --staged <file>..." to unstage)' });
        stagedFiles.forEach(f => {
          const status = state.files[f] ? 'modified' : 'new file';
          output.push({ type: 'success', text: `\t${status}:   ${f}` });
        });
      }

      if (modifiedFiles.length > 0) {
        output.push({ type: 'warning', text: '\nChanges not staged for commit:' });
        output.push({ type: 'output', text: '  (use "git add <file>..." to update what will be committed)' });
        modifiedFiles.forEach(f => {
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

      if (stagedFiles.length === 0 && modifiedFiles.length === 0 && untrackedFiles.length === 0 && !state.conflictState) {
        if (state.commits.length === 0) {
          output.push({ type: 'output', text: '\nNo commits yet' });
        }
        output.push({ type: 'output', text: '\nnothing to commit, working tree clean' });
      }
    }
    // Git add
    else if (trimmed.startsWith('git add ')) {
      const args = trimmed.replace('git add ', '').trim();
      const isAll = args === '.' || args === '-A' || args === '--all' || args.startsWith('-A ') || args.startsWith('--all ');
      const isUpdate = args === '-u' || args === '--update' || args.startsWith('-u ') || args.startsWith('--update ');
      
      if (isAll || args === '.') {
        const allFiles = { ...state.workingDirectory };
        newState.stagedFiles = { ...state.stagedFiles, ...allFiles };
        const count = Object.keys(allFiles).length;
        if (count > 0) {
          output.push({ type: 'success', text: `Added ${count} file(s) to staging area` });
        } else {
          output.push({ type: 'output', text: 'Nothing to add' });
        }
      } else if (isUpdate) {
        const modifiedFiles = Object.keys(state.workingDirectory || {}).filter(
          f => state.files[f] && state.workingDirectory[f] !== state.files[f]
        );
        modifiedFiles.forEach(f => {
          newState.stagedFiles = { ...state.stagedFiles, [f]: state.workingDirectory[f] };
        });
        if (modifiedFiles.length > 0) {
          output.push({ type: 'success', text: `Updated ${modifiedFiles.length} file(s)` });
        } else {
          output.push({ type: 'output', text: 'Nothing to update' });
        }
      } else {
        const files = args.split(/\s+/).filter(f => f && !f.startsWith('-'));
        if (files.length === 0) {
          output.push({ type: 'error', text: 'fatal: no files added' });
        } else {
          let addedCount = 0;
          files.forEach(file => {
            if (state.workingDirectory[file] || state.conflictState?.file === file) {
              // If conflict was resolved via editor, use resolved text
              const fileContent = (state.conflictState?.file === file && conflictResolvedText) 
                ? conflictResolvedText 
                : (state.workingDirectory[file] || 'resolved');
              newState.stagedFiles = { ...state.stagedFiles, [file]: fileContent };
              if (state.conflictState?.file === file) {
                newState.conflictState = null;
                newState.workingDirectory = { ...state.workingDirectory };
                newState.workingDirectory[file] = fileContent;
              }
              addedCount++;
            } else {
              output.push({ type: 'error', text: `fatal: pathspec '${file}' did not match any files` });
            }
          });
          if (addedCount > 0) {
            output.push({ type: 'success', text: `Added ${addedCount} file(s) to staging area` });
          }
        }
      }
    }
    // Git commit
    else if (trimmed.startsWith('git commit')) {
      const msgMatch = trimmed.match(/-m\s+["']([^"']+)["']/);
      const message = msgMatch ? msgMatch[1] : 'Commit message';
      const isAmend = trimmed.includes('--amend');
      const isAll = trimmed.includes('-a') || trimmed.includes('--all');
      
      // Handle -a flag: stage all modified files
      if (isAll && !isAmend) {
        const modifiedFiles = Object.keys(state.workingDirectory || {}).filter(
          f => state.files[f] && state.workingDirectory[f] !== state.files[f]
        );
        modifiedFiles.forEach(f => {
          newState.stagedFiles = { ...state.stagedFiles, [f]: state.workingDirectory[f] };
        });
      }
      
      if (Object.keys(state.stagedFiles).length === 0 && !state.conflictState && !isAll) {
        output.push({ type: 'error', text: 'nothing to commit, working tree clean' });
      } else {
        const hash = Math.random().toString(36).substr(2, 7);
        const filesChanged = Object.keys(state.stagedFiles).length;
        
        if (isAmend && state.commits.length > 0) {
          // Amend: replace last commit
          const lastCommit = state.commits[state.commits.length - 1];
          newState.commits = [...state.commits.slice(0, -1), {
            hash,
            message: msgMatch ? message : lastCommit.message,
            files: { ...state.stagedFiles },
            branch: state.currentBranch
          }];
          output.push({ type: 'success', text: `[${state.currentBranch} ${hash}] ${msgMatch ? message : lastCommit.message} (amended)` });
        } else {
          newState.commits = [...state.commits, {
            hash,
            message,
            files: { ...state.stagedFiles },
            branch: state.currentBranch
          }];
          output.push({ type: 'success', text: `[${state.currentBranch} ${hash}] ${message}` });
        }
        newState.files = { ...state.files, ...state.stagedFiles };
        newState.stagedFiles = {};
        newState.conflictState = null;
        if (filesChanged > 0) {
          output.push({ type: 'output', text: ` ${filesChanged} file(s) changed` });
        }
      }
    }
    // Git log
    else if (trimmed.startsWith('git log')) {
      const isOneline = trimmed.includes('--oneline');
      const isGraph = trimmed.includes('--graph');
      const isAll = trimmed.includes('--all');
      const isStat = trimmed.includes('--stat');
      const isPatch = trimmed.includes('-p') || trimmed.includes('--patch');
      const limitMatch = trimmed.match(/-(\d+)|-n\s*(\d+)|--max-count\s*(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1] || limitMatch[2] || limitMatch[3]) : null;
      const branchMatch = trimmed.match(/git log(?:\s+[^-]*)?\s+(\S+)/);
      const targetBranch = branchMatch && !branchMatch[1].startsWith('-') && !branchMatch[1].match(/^\d+$/) ? branchMatch[1] : null;
      
      // Parse --author filter (handles --author="name" or --author=name or --author name)
      let authorFilter = null;
      // Try double-quoted first (handles --author="bob")
      const authorDoubleQuoted = trimmed.match(/--author="([^"]+)"/);
      if (authorDoubleQuoted) {
        authorFilter = authorDoubleQuoted[1];
      } else {
        // Try single-quoted (handles --author='bob')
        const authorSingleQuoted = trimmed.match(/--author='([^']+)'/);
        if (authorSingleQuoted) {
          authorFilter = authorSingleQuoted[1];
        } else {
          // Try unquoted with = (handles --author=bob)
          const authorUnquoted = trimmed.match(/--author=([^\s]+)/);
          if (authorUnquoted) {
            authorFilter = authorUnquoted[1];
          }
        }
      }
      
      // Parse -S (pickaxe) filter (handles -S "string with spaces" or -S string)
      let pickaxeFilter = null;
      // Try double-quoted first (handles -S "return null")
      const pickaxeDoubleQuoted = trimmed.match(/-S\s+"([^"]+)"/);
      if (pickaxeDoubleQuoted) {
        pickaxeFilter = pickaxeDoubleQuoted[1];
      } else {
        // Try single-quoted (handles -S 'return null')
        const pickaxeSingleQuoted = trimmed.match(/-S\s+'([^']+)'/);
        if (pickaxeSingleQuoted) {
          pickaxeFilter = pickaxeSingleQuoted[1];
        } else {
          // Try unquoted (handles -S return or -S null)
          const pickaxeUnquoted = trimmed.match(/-S\s+([^\s]+)/);
          if (pickaxeUnquoted) {
            pickaxeFilter = pickaxeUnquoted[1];
          }
        }
      }
      
      let commitsToShow = [...state.commits];
      
      // If on feature branch and no specific branch requested, show feature commits + base
      if (state.currentBranch === 'feature' && !targetBranch && state.featureCommits && state.featureCommits.length > 0) {
        // Show feature commits + base commits (main commits up to featureBranchBase)
        const baseHash = state.featureBranchBase;
        const baseIndex = state.commits.findIndex(c => c.hash === baseHash);
        const baseCommits = baseIndex >= 0 ? state.commits.slice(0, baseIndex + 1) : state.commits.filter(c => c.branch === 'main' || !c.branch);
        commitsToShow = [...baseCommits, ...state.featureCommits];
      } else if (targetBranch === 'feature' && state.featureCommits) {
        commitsToShow = [...state.featureCommits];
      } else if (targetBranch?.startsWith('origin/') && state.remoteCommits?.origin) {
        commitsToShow = [...state.remoteCommits.origin];
      } else if (isAll) {
        // Show all branches
        commitsToShow = [...state.commits];
        if (state.featureCommits) {
          commitsToShow = [...commitsToShow, ...state.featureCommits];
        }
      }
      
      // Apply author filter
      if (authorFilter) {
        const beforeCount = commitsToShow.length;
        commitsToShow = commitsToShow.filter(commit => {
          if (!commit.author) return false;
          const authorMatch = commit.author.toLowerCase().includes(authorFilter.toLowerCase());
          return authorMatch;
        });
      }
      
      // Apply pickaxe filter (-S)
      if (pickaxeFilter) {
        commitsToShow = commitsToShow.filter(commit => {
          // Check if any file in the commit contains the search string
          const hasString = Object.values(commit.files || {}).some(content => {
            if (typeof content !== 'string') return false;
            return content.includes(pickaxeFilter);
          });
          return hasString;
        });
      }
      
      if (limit) {
        commitsToShow = commitsToShow.slice(-limit);
      }
      
      if (commitsToShow.length > 0) {
        commitsToShow.slice().reverse().forEach((commit, idx) => {
          if (isOneline) {
            const graphPrefix = isGraph ? (idx % 2 === 0 ? '* ' : '| ') : '';
            output.push({ type: 'output', text: `${graphPrefix}${commit.hash} ${commit.message}` });
          } else {
            if (isGraph && idx > 0) {
              output.push({ type: 'output', text: '|' });
            }
            output.push({ type: 'warning', text: `commit ${commit.hash}` });
            if (commit.author) {
              output.push({ type: 'output', text: `Author: ${commit.author}` });
            }
            output.push({ type: 'output', text: `\n    ${commit.message}\n` });
            if (isStat) {
              const fileCount = Object.keys(commit.files || {}).length;
              output.push({ type: 'output', text: ` ${fileCount} file(s) changed` });
            }
            if (isPatch) {
              output.push({ type: 'output', text: `diff --git a/file b/file\n+changes...` });
            }
          }
        });
      } else {
        output.push({ type: 'error', text: 'fatal: your current branch does not have any commits yet' });
      }
    }
    // Git diff
    else if (trimmed.startsWith('git diff')) {
      const isStaged = trimmed.includes('--staged') || trimmed.includes('--cached');
      const isStat = trimmed.includes('--stat');
      const file = trimmed.replace('git diff', '').replace('--staged', '').replace('--cached', '').replace('--stat', '').trim() || 
                   Object.keys(state.workingDirectory).find(f => state.files[f]);
      
      if (isStaged) {
        // Show staged changes
        const stagedFile = file || Object.keys(state.stagedFiles)[0];
        if (stagedFile && state.stagedFiles[stagedFile]) {
          if (isStat) {
            output.push({ type: 'output', text: ` ${stagedFile} | 1 +` });
          } else {
            output.push({ type: 'output', text: `diff --git a/${stagedFile} b/${stagedFile}` });
            output.push({ type: 'output', text: 'index abc123..def456 100644' });
            output.push({ type: 'error', text: `--- a/${stagedFile}` });
            output.push({ type: 'success', text: `+++ b/${stagedFile}` });
            output.push({ type: 'output', text: '@@ -1 +1 @@' });
            output.push({ type: 'success', text: `+${state.stagedFiles[stagedFile]}` });
          }
        } else {
          output.push({ type: 'output', text: '(no staged changes)' });
        }
      } else if (file && state.workingDirectory[file] && state.files[file]) {
        // Show working directory changes
        if (isStat) {
          output.push({ type: 'output', text: ` ${file} | 1 +` });
        } else {
          output.push({ type: 'output', text: `diff --git a/${file} b/${file}` });
          output.push({ type: 'output', text: 'index abc123..def456 100644' });
          output.push({ type: 'error', text: `--- a/${file}` });
          output.push({ type: 'success', text: `+++ b/${file}` });
          output.push({ type: 'output', text: '@@ -1 +1 @@' });
          output.push({ type: 'error', text: `-${state.files[file]}` });
          output.push({ type: 'success', text: `+${state.workingDirectory[file]}` });
        }
      } else if (!file) {
        // Show all changes
        const modifiedFiles = Object.keys(state.workingDirectory).filter(
          f => state.files[f] && state.workingDirectory[f] !== state.files[f]
        );
        if (modifiedFiles.length > 0) {
          modifiedFiles.forEach(f => {
            output.push({ type: 'output', text: `diff --git a/${f} b/${f}` });
            output.push({ type: 'error', text: `-${state.files[f]}` });
            output.push({ type: 'success', text: `+${state.workingDirectory[f]}` });
          });
        } else {
          output.push({ type: 'output', text: '(no differences)' });
        }
      } else {
        output.push({ type: 'output', text: '(no differences)' });
      }
    }
    // Git branch
    else if (trimmed.startsWith('git branch')) {
      if (trimmed === 'git branch' || trimmed === 'git branch --list') {
        state.branches.forEach(b => {
          const marker = b === state.currentBranch ? '* ' : '  ';
          output.push({ type: b === state.currentBranch ? 'success' : 'output', text: `${marker}${b}` });
        });
      } else if (trimmed === 'git branch -a' || trimmed === 'git branch --all') {
        state.branches.forEach(b => {
          const marker = b === state.currentBranch ? '* ' : '  ';
          output.push({ type: b === state.currentBranch ? 'success' : 'output', text: `${marker}${b}` });
        });
        Object.keys(state.remoteBranches || {}).forEach(rb => {
          output.push({ type: 'error', text: `  remotes/${rb}` });
        });
      } else if (trimmed.startsWith('git branch -d ') || trimmed.startsWith('git branch --delete ')) {
        const branchName = trimmed.split(' ').pop();
        if (branchName === state.currentBranch) {
          output.push({ type: 'error', text: `error: Cannot delete branch '${branchName}' checked out` });
        } else if (state.branches.includes(branchName)) {
          newState.branches = state.branches.filter(b => b !== branchName);
          output.push({ type: 'success', text: `Deleted branch ${branchName}` });
        } else {
          output.push({ type: 'error', text: `error: branch '${branchName}' not found` });
        }
      } else {
        const branchName = trimmed.replace('git branch ', '').trim();
        if (state.branches.includes(branchName)) {
          output.push({ type: 'error', text: `fatal: A branch named '${branchName}' already exists.` });
        } else {
          newState.branches = [...state.branches, branchName];
          output.push({ type: 'success', text: `Created branch '${branchName}'` });
        }
      }
    }
    // Git checkout / switch
    else if (trimmed.startsWith('git checkout ') || trimmed.startsWith('git switch ')) {
      const parts = trimmed.split(' ');
      const hasCreate = parts.includes('-b') || parts.includes('-c');
      const branchName = parts[parts.length - 1];
      
      if (hasCreate) {
        if (state.branches.includes(branchName)) {
          output.push({ type: 'error', text: `fatal: A branch named '${branchName}' already exists.` });
        } else {
          newState.branches = [...state.branches, branchName];
          newState.currentBranch = branchName;
          output.push({ type: 'success', text: `Switched to a new branch '${branchName}'` });
        }
      } else if (state.branches.includes(branchName)) {
        newState.currentBranch = branchName;
        output.push({ type: 'success', text: `Switched to branch '${branchName}'` });
      } else if (branchName.match(/^[a-f0-9]+$/)) {
        // Checking out a commit hash (including from reflog)
        // Check if it's in reflog or commits
        const inReflog = state.reflog?.some(e => e.hash === branchName || e.hash.startsWith(branchName));
        const inCommits = state.commits.some(c => c.hash === branchName || c.hash.startsWith(branchName));
        
        if (inReflog || inCommits) {
          newState.detachedHead = true;
          newState.head = branchName;
          output.push({ type: 'warning', text: `Note: switching to '${branchName}'.` });
          output.push({ type: 'output', text: 'You are in "detached HEAD" state.' });
          output.push({ type: 'output', text: 'You can look around, make experimental changes and commit them,' });
          output.push({ type: 'output', text: 'and you can discard any commits you make in this state' });
          output.push({ type: 'output', text: 'without impacting any branches by switching back to a branch.' });
        } else {
          output.push({ type: 'error', text: `error: pathspec '${branchName}' did not match any file(s) known to git` });
        }
      } else {
        output.push({ type: 'error', text: `error: pathspec '${branchName}' did not match any file(s) known to git` });
      }
    }
    // Git merge
    else if (trimmed.startsWith('git merge ')) {
      const branchName = trimmed.replace('git merge ', '').trim();
      
      if (state.pendingConflict && branchName === state.pendingConflict.branch) {
        newState.conflictState = {
          file: state.pendingConflict.file,
          ours: state.pendingConflict.ours,
          theirs: state.pendingConflict.theirs
        };
        newState.workingDirectory = { ...state.workingDirectory, [state.pendingConflict.file]: 'CONFLICT' };
        output.push({ type: 'output', text: `Auto-merging ${state.pendingConflict.file}` });
        output.push({ type: 'error', text: `CONFLICT (content): Merge conflict in ${state.pendingConflict.file}` });
        output.push({ type: 'error', text: 'Automatic merge failed; fix conflicts and then commit the result.' });
        output.push({ type: 'system', text: 'Conflict editor opened. Resolve the conflict in the editor.' });
        // Open conflict editor
        return { 
          newState, 
          output, 
          conflictEditor: {
            file: state.pendingConflict.file,
            ours: state.pendingConflict.ours,
            theirs: state.pendingConflict.theirs,
            resolved: `<<<<<<< HEAD\n${state.pendingConflict.ours}\n=======\n${state.pendingConflict.theirs}\n>>>>>>> ${branchName}`
          }
        };
      } else if (state.branches.includes(branchName)) {
        if (state.featureCommits) {
          newState.commits = [...state.commits, ...state.featureCommits];
          newState.files = { ...state.files, ...state.featureCommits.reduce((acc, c) => ({ ...acc, ...c.files }), {}) };
        }
        output.push({ type: 'success', text: `Merge made by the 'ort' strategy.` });
        output.push({ type: 'output', text: ' 1 file changed, 1 insertion(+)' });
      } else {
        output.push({ type: 'error', text: `merge: ${branchName} - not something we can merge` });
      }
    }
    // Git stash
    else if (trimmed === 'git stash' || trimmed === 'git stash save' || trimmed.startsWith('git stash push')) {
      const unstaged = Object.keys(state.workingDirectory || {});
      if (unstaged.length > 0) {
        newState.stash = [...(state.stash || []), { files: { ...state.workingDirectory } }];
        newState.workingDirectory = {};
        output.push({ type: 'success', text: `Saved working directory and index state WIP on ${state.currentBranch}` });
      } else {
        output.push({ type: 'output', text: 'No local changes to save' });
      }
    } else if (trimmed === 'git stash list') {
      if (state.stash?.length > 0) {
        state.stash.forEach((_, i) => {
          output.push({ type: 'output', text: `stash@{${i}}: WIP on ${state.currentBranch}: abc1234 message` });
        });
      } else {
        output.push({ type: 'output', text: '(no stashes)' });
      }
    } else if (trimmed === 'git stash pop' || trimmed === 'git stash apply') {
      if (state.stash?.length > 0) {
        const lastStash = state.stash[state.stash.length - 1];
        newState.workingDirectory = { ...state.workingDirectory, ...lastStash.files };
        if (trimmed === 'git stash pop') {
          newState.stash = state.stash.slice(0, -1);
        }
        output.push({ type: 'success', text: 'Changes applied successfully' });
        if (trimmed === 'git stash pop') {
          output.push({ type: 'output', text: 'Dropped refs/stash@{0}' });
        }
      } else {
        output.push({ type: 'error', text: 'error: No stash entries found.' });
      }
    }
    // Git rebase
    else if (trimmed.startsWith('git rebase')) {
      if (trimmed === 'git rebase --continue') {
        if (state.rebaseInProgress && rebaseTodoState && rebaseTodoState.text) {
          // Process the rebase todo list
          const processedCommits = [];
          const todoLines = rebaseTodoState.text.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
          
          let lineIndex = 0;
          todoLines.forEach(line => {
            // Match: action hash message (message can contain spaces)
            const match = line.match(/^(pick|p|reword|r|edit|e|squash|s|fixup|f|drop|d)\s+([a-f0-9]+)\s+(.+)$/);
            if (match) {
              const action = match[1];
              const hash = match[2];
              const message = match[3].trim();
              const commit = state.rebaseCommits.find(c => c.hash === hash);
              const isFirstCommit = lineIndex === 0;
              
              if (commit && action !== 'drop' && action !== 'd') {
                // First commit cannot be squash/fixup - convert to pick
                if ((action === 'squash' || action === 's' || action === 'fixup' || action === 'f') && isFirstCommit) {
                  const newHash = Math.random().toString(36).substr(2, 7);
                  processedCommits.push({
                    ...commit,
                    hash: newHash,
                    message: commit.message
                  });
                } else if (action === 'squash' || action === 's' || action === 'fixup' || action === 'f') {
                  // Merge with previous commit
                  if (processedCommits.length > 0) {
                    const last = processedCommits[processedCommits.length - 1];
                    last.message = action === 'fixup' || action === 'f' 
                      ? last.message 
                      : `${last.message}\n\n${message}`;
                    last.files = { ...last.files, ...commit.files };
                  } else {
                    // Fallback: use as pick if no previous commit
                    const newHash = Math.random().toString(36).substr(2, 7);
                    processedCommits.push({
                      ...commit,
                      hash: newHash,
                      message: commit.message
                    });
                  }
                } else {
                  const newHash = Math.random().toString(36).substr(2, 7);
                  processedCommits.push({
                    ...commit,
                    hash: newHash,
                    message: (action === 'reword' || action === 'r') ? message : commit.message
                  });
                }
              }
              lineIndex++;
            }
          });
          
          // Update commits: keep commits before rebase base, then add processed ones
          if (state.rebaseBaseCommit) {
            const baseIndex = state.commits.findIndex(c => c.hash === state.rebaseBaseCommit);
            if (baseIndex >= 0) {
              // Keep everything up to and including the base commit
              const beforeRebase = state.commits.slice(0, baseIndex + 1);
              newState.commits = [...beforeRebase, ...processedCommits];
            } else {
              // Base commit not found, just replace the rebased commits
              const rebaseStartIndex = state.commits.length - state.rebaseCommits.length;
              newState.commits = [...state.commits.slice(0, rebaseStartIndex), ...processedCommits];
            }
          } else {
            // No base commit (rebasing from start), replace all commits
            newState.commits = processedCommits;
          }
          
          newState.rebaseInProgress = false;
          newState.rebaseCommits = [];
          newState.rebaseBaseCommit = null;
          rebaseTodo = { action: 'clear' };
          output.push({ type: 'success', text: 'Successfully rebased and updated refs/heads/' + state.currentBranch });
        } else if (state.rebaseInProgress) {
          // Simple continue without todo list
          newState.rebaseInProgress = false;
          output.push({ type: 'success', text: 'Successfully rebased and updated refs/heads/' + state.currentBranch });
        } else {
          output.push({ type: 'error', text: 'error: No rebase in progress?' });
        }
      } else if (trimmed === 'git rebase --abort') {
        if (state.rebaseInProgress) {
          newState.rebaseInProgress = false;
          newState.rebaseCommits = [];
          newState.rebaseBaseCommit = null;
          rebaseTodo = { action: 'clear' };
          output.push({ type: 'output', text: 'Rebase aborted' });
        } else {
          output.push({ type: 'error', text: 'error: No rebase in progress?' });
        }
      } else if (trimmed.startsWith('git rebase -i') || trimmed.startsWith('git rebase --interactive')) {
        // Parse HEAD~N or branch name
        const match = trimmed.match(/git rebase (?:-i|--interactive)\s+(HEAD~(\d+)|(\S+))/);
        let commitsToRebase = [];
        let baseCommit = null;
        
        if (match) {
          if (match[2]) {
            // HEAD~N format
            const count = parseInt(match[2]);
            if (count > state.commits.length) {
              output.push({ type: 'error', text: `fatal: invalid upstream 'HEAD~${count}'` });
              return { newState, output, rebaseTodo, conflictEditor: null };
            }
            commitsToRebase = state.commits.slice(-count).reverse();
            const baseIndex = state.commits.length - count - 1;
            baseCommit = baseIndex >= 0 ? state.commits[baseIndex]?.hash : null;
          } else if (match[3]) {
            // Branch name
            const targetBranch = match[3];
            if (state.branches.includes(targetBranch)) {
              baseCommit = state.commits.length > 0 ? state.commits[0]?.hash : null;
              commitsToRebase = [...state.commits].reverse();
            } else {
              output.push({ type: 'error', text: `fatal: invalid upstream '${targetBranch}'` });
              return { newState, output, rebaseTodo, conflictEditor: null };
            }
          }
        } else {
          // Default: rebase last 4 commits (or all if fewer than 4)
          const count = Math.min(4, state.commits.length);
          commitsToRebase = state.commits.slice(-count).reverse();
          const baseIndex = state.commits.length - count - 1;
          baseCommit = baseIndex >= 0 ? state.commits[baseIndex]?.hash : null;
        }
        
        if (commitsToRebase.length > 0) {
          newState.rebaseInProgress = true;
          newState.rebaseCommits = commitsToRebase;
          newState.rebaseBaseCommit = baseCommit;
          
          // Create todo list text with clear instructions
          const todoText = commitsToRebase.map((commit, idx) => 
            `pick ${commit.hash} ${commit.message}`
          ).join('\n') + '\n\n# ============================================\n# INSTRUCTIONS:\n# ============================================\n# Change the first word on each line to modify commits:\n#\n#   pick (or p) = keep this commit as-is\n#   reword (or r) = keep commit but change its message\n#   edit (or e) = stop here to modify the commit\n#   squash (or s) = combine with previous commit\n#   fixup (or f) = like squash, but discard message\n#   drop (or d) = remove this commit\n#\n# Example: To combine WIP commits, change:\n#   pick wip1111 WIP\n#   pick wip2222 WIP again\n#\n# To:\n#   pick wip1111 WIP\n#   squash wip2222 WIP again\n#\n# ============================================\n# Rebase commands:\n# ============================================\n# p, pick = use commit\n# r, reword = use commit, but edit the commit message\n# e, edit = use commit, but stop for amending\n# s, squash = use commit, but meld into previous commit\n# f, fixup = like "squash", but discard this commit\'s log message\n# d, drop = remove commit';
          
          rebaseTodo = { action: 'open', commits: commitsToRebase, text: todoText };
          
          output.push({ type: 'system', text: 'Interactive rebase started. Edit the todo list below and save to continue.' });
          output.push({ type: 'output', text: '\nRebase todo list opened in editor. Edit the commands above.' });
        } else {
          output.push({ type: 'error', text: 'fatal: no commits to rebase' });
        }
      } else {
        const targetBranch = trimmed.replace('git rebase ', '').trim();
        if (state.branches.includes(targetBranch) || targetBranch === 'main') {
          newState.rebaseInProgress = false;
          newState.rebaseTarget = targetBranch;
          // Simulate successful rebase - rebase feature commits on top of main
          if (state.featureCommits && state.currentBranch === 'feature') {
            // Get all main commits (up to and including the target branch's latest)
            const mainCommits = state.commits.filter(c => c.branch === 'main' || !c.branch || c.hash === state.featureBranchBase);
            // Rebase feature commits with new hashes
            const rebasedFeatureCommits = state.featureCommits.map(c => ({
              ...c,
              hash: Math.random().toString(36).substr(2, 7), // New hash after rebase
              branch: 'feature'
            }));
            // Combine: main commits + rebased feature commits
            newState.commits = [...mainCommits, ...rebasedFeatureCommits];
            // Update featureCommits to reflect rebased state
            newState.featureCommits = rebasedFeatureCommits;
          } else if (state.featureCommits) {
            // Fallback for other cases
            const mainCommits = state.commits.filter(c => c.branch === 'main' || !c.branch);
            const featureCommits = state.featureCommits.map(c => ({
              ...c,
              hash: Math.random().toString(36).substr(2, 7)
            }));
            newState.commits = [...mainCommits, ...featureCommits];
          }
          output.push({ type: 'success', text: `Successfully rebased and updated refs/heads/${state.currentBranch}.` });
        } else {
          output.push({ type: 'error', text: `fatal: invalid upstream '${targetBranch}'` });
        }
      }
    }
    // Git reset
    else if (trimmed.startsWith('git reset')) {
      if (trimmed.includes('--soft')) {
        const lastCommit = state.commits[state.commits.length - 1];
        if (lastCommit) {
          newState.commits = state.commits.slice(0, -1);
          newState.stagedFiles = { ...state.stagedFiles, ...lastCommit.files };
          output.push({ type: 'success', text: 'HEAD is now at ' + (state.commits[state.commits.length - 2]?.hash || 'initial') });
        }
      } else if (trimmed.includes('--hard')) {
        newState.commits = state.commits.slice(0, -1);
        newState.workingDirectory = {};
        newState.stagedFiles = {};
        output.push({ type: 'warning', text: 'HEAD is now at ' + (state.commits[state.commits.length - 2]?.hash || 'initial') });
      } else if (trimmed.includes('HEAD') && trimmed.includes('.txt')) {
        const file = trimmed.split(' ').pop();
        if (state.stagedFiles[file]) {
          newState.stagedFiles = { ...state.stagedFiles };
          delete newState.stagedFiles[file];
          output.push({ type: 'success', text: `Unstaged changes after reset:` });
          output.push({ type: 'output', text: `M\t${file}` });
        }
      } else {
        // Mixed reset (default)
        const lastCommit = state.commits[state.commits.length - 1];
        if (lastCommit) {
          newState.commits = state.commits.slice(0, -1);
          newState.workingDirectory = { ...state.workingDirectory, ...lastCommit.files };
          newState.stagedFiles = {};
          output.push({ type: 'success', text: 'Unstaged changes after reset:' });
          Object.keys(lastCommit.files).forEach(f => {
            output.push({ type: 'output', text: `M\t${f}` });
          });
        }
      }
    }
    // Git restore
    else if (trimmed.startsWith('git restore')) {
      if (trimmed.includes('--staged')) {
        const file = trimmed.split(' ').pop();
        if (state.stagedFiles[file]) {
          newState.stagedFiles = { ...state.stagedFiles };
          delete newState.stagedFiles[file];
          output.push({ type: 'success', text: `Unstaged '${file}'` });
        }
      } else {
        const file = trimmed.replace('git restore ', '').trim();
        if (state.files[file]) {
          newState.workingDirectory = { ...state.workingDirectory };
          newState.workingDirectory[file] = state.files[file];
          output.push({ type: 'success', text: `Restored '${file}'` });
        }
      }
    }
    // Git revert
    else if (trimmed.startsWith('git revert')) {
      const hash = Math.random().toString(36).substr(2, 7);
      const lastCommit = state.commits[state.commits.length - 1];
      newState.commits = [...state.commits, {
        hash,
        message: `Revert "${lastCommit?.message || 'previous commit'}"`,
        files: {}
      }];
      output.push({ type: 'success', text: `[${state.currentBranch} ${hash}] Revert "${lastCommit?.message}"` });
      output.push({ type: 'output', text: ' 1 file changed' });
    }
    // Git cherry-pick
    else if (trimmed.startsWith('git cherry-pick')) {
      const commitHash = trimmed.replace('git cherry-pick ', '').trim();
      const sourceCommit = state.featureCommits?.find(c => c.hash === commitHash);
      if (sourceCommit) {
        const newHash = Math.random().toString(36).substr(2, 7);
        newState.commits = [...state.commits, { ...sourceCommit, hash: newHash }];
        newState.files = { ...state.files, ...sourceCommit.files };
        output.push({ type: 'success', text: `[${state.currentBranch} ${newHash}] ${sourceCommit.message}` });
      } else {
        output.push({ type: 'error', text: `fatal: bad revision '${commitHash}'` });
      }
    }
    // Git tag
    else if (trimmed.startsWith('git tag')) {
      if (trimmed === 'git tag' || trimmed === 'git tag -l') {
        const tags = Object.keys(state.tags || {});
        if (tags.length > 0) {
          tags.forEach(t => output.push({ type: 'output', text: t }));
        } else {
          output.push({ type: 'output', text: '(no tags)' });
        }
      } else if (trimmed.startsWith('git tag -a')) {
        const match = trimmed.match(/git tag -a\s+(\S+)/);
        if (match) {
          newState.tags = { ...state.tags, [match[1]]: { annotated: true, hash: state.commits[state.commits.length - 1]?.hash } };
          output.push({ type: 'success', text: `Created annotated tag '${match[1]}'` });
        }
      } else {
        const tagName = trimmed.replace('git tag ', '').trim();
        newState.tags = { ...state.tags, [tagName]: { hash: state.commits[state.commits.length - 1]?.hash } };
        output.push({ type: 'success', text: `Created tag '${tagName}'` });
      }
    }
    // Git show
    else if (trimmed.startsWith('git show')) {
      const target = trimmed.replace('git show ', '').trim();
      const tag = state.tags?.[target];
      if (tag) {
        output.push({ type: 'warning', text: `tag ${target}` });
        if (tag.annotated) {
          output.push({ type: 'output', text: `Tagger: Developer <dev@example.com>` });
        }
        output.push({ type: 'output', text: `\ncommit ${tag.hash}` });
      } else {
        const commit = state.commits.find(c => c.hash === target);
        if (commit) {
          output.push({ type: 'warning', text: `commit ${commit.hash}` });
          output.push({ type: 'output', text: `\n    ${commit.message}` });
        }
      }
    }
    // Git remote
    else if (trimmed.startsWith('git remote')) {
      if (trimmed === 'git remote' || trimmed === 'git remote -v') {
        const remotes = Object.entries(state.remotes || {});
        if (remotes.length > 0) {
          remotes.forEach(([name, url]) => {
            if (trimmed.includes('-v')) {
              output.push({ type: 'output', text: `${name}\t${url} (fetch)` });
              output.push({ type: 'output', text: `${name}\t${url} (push)` });
            } else {
              output.push({ type: 'output', text: name });
            }
          });
        } else {
          output.push({ type: 'output', text: '(no remotes configured)' });
        }
      } else if (trimmed.startsWith('git remote add')) {
        const parts = trimmed.split(' ');
        const name = parts[3];
        const url = parts[4];
        newState.remotes = { ...state.remotes, [name]: url };
        output.push({ type: 'success', text: `Added remote '${name}'` });
      }
    }
    // Git fetch
    else if (trimmed.startsWith('git fetch')) {
      if (Object.keys(state.remotes || {}).length > 0) {
        output.push({ type: 'output', text: 'remote: Enumerating objects: 5, done.' });
        output.push({ type: 'output', text: 'remote: Counting objects: 100% (5/5), done.' });
        output.push({ type: 'output', text: 'remote: Compressing objects: 100% (3/3), done.' });
        output.push({ type: 'success', text: 'From ' + (state.remotes.origin || 'origin') });
        if (state.remoteCommits?.origin) {
          output.push({ type: 'output', text: '   abc1234..def5678  main       -> origin/main' });
        }
        newState.remoteBranches = { ...state.remoteBranches, 'origin/main': 'fetched' };
      } else {
        output.push({ type: 'error', text: 'fatal: No remote repository configured' });
      }
    }
    // Git pull
    else if (trimmed.startsWith('git pull')) {
      const isRebase = trimmed.includes('--rebase');
      if (Object.keys(state.remotes || {}).length > 0) {
        output.push({ type: 'output', text: 'remote: Enumerating objects: 3, done.' });
        output.push({ type: 'output', text: 'remote: Counting objects: 100% (3/3), done.' });
        
        if (state.remoteCommits?.origin) {
          newState.commits = [...state.remoteCommits.origin];
          newState.files = state.remoteCommits.origin.reduce((acc, c) => ({ ...acc, ...c.files }), state.files);
        }
        
        if (isRebase) {
          output.push({ type: 'success', text: 'Successfully rebased and updated refs/heads/main.' });
        } else {
          output.push({ type: 'success', text: 'Fast-forward' });
          output.push({ type: 'output', text: ' readme.md | 1 +' });
          output.push({ type: 'output', text: ' 1 file changed, 1 insertion(+)' });
        }
      } else {
        output.push({ type: 'error', text: 'fatal: No remote repository configured' });
      }
    }
    // Git push
    else if (trimmed.startsWith('git push')) {
      const isForce = trimmed.includes('--force') || trimmed.includes('-f');
      const isForceWithLease = trimmed.includes('--force-with-lease');
      const isSetUpstream = trimmed.includes('-u') || trimmed.includes('--set-upstream');
      
      if (Object.keys(state.remotes || {}).length === 0) {
        output.push({ type: 'error', text: 'fatal: No configured push destination.' });
      } else if (state.diverged && !isForce && !isForceWithLease) {
        output.push({ type: 'error', text: 'To ' + state.remotes.origin });
        output.push({ type: 'error', text: ' ! [rejected]        main -> main (non-fast-forward)' });
        output.push({ type: 'error', text: 'error: failed to push some refs' });
        output.push({ type: 'output', text: 'hint: Updates were rejected because the tip of your current branch is behind' });
        output.push({ type: 'output', text: 'hint: its remote counterpart. If you want to force update, use --force or --force-with-lease' });
      } else {
        output.push({ type: 'output', text: 'Enumerating objects: 5, done.' });
        output.push({ type: 'output', text: 'Counting objects: 100% (5/5), done.' });
        output.push({ type: 'output', text: 'Writing objects: 100% (3/3), 300 bytes | 300.00 KiB/s, done.' });
        output.push({ type: 'success', text: `To ${state.remotes.origin}` });
        
        if (isForce || isForceWithLease) {
          output.push({ type: 'warning', text: ' + abc1234...def5678 main -> main (forced update)' });
          newState.diverged = false;
        } else {
          output.push({ type: 'success', text: '   abc1234..def5678  main -> main' });
        }
        
        if (isSetUpstream) {
          output.push({ type: 'output', text: `Branch '${state.currentBranch}' set up to track 'origin/${state.currentBranch}'.` });
          newState.upstreamSet = true;
        }
      }
    }
    // Git clone
    else if (trimmed.startsWith('git clone')) {
      const url = trimmed.split(' ')[2] || 'repository';
      const repoName = url.split('/').pop()?.replace('.git', '') || 'repo';
      newState.initialized = true;
      newState.remotes = { origin: url };
      newState.commits = [
        { hash: 'abc1111', message: 'Initial commit', files: { 'README.md': '# ' + repoName } },
        { hash: 'def2222', message: 'Add features', files: { 'app.js': 'code' } }
      ];
      newState.files = { 'README.md': '# ' + repoName, 'app.js': 'code' };
      output.push({ type: 'output', text: `Cloning into '${repoName}'...` });
      output.push({ type: 'output', text: 'remote: Enumerating objects: 10, done.' });
      output.push({ type: 'output', text: 'remote: Counting objects: 100% (10/10), done.' });
      output.push({ type: 'success', text: 'Receiving objects: 100% (10/10), done.' });
    }
    // Git blame
    else if (trimmed.startsWith('git blame')) {
      const file = trimmed.replace('git blame ', '').trim();
      if (state.files[file]) {
        const lines = state.files[file].split('\n');
        const authors = ['alice', 'bob', 'charlie'];
        lines.forEach((line, i) => {
          const author = state.commits[Math.min(i, state.commits.length - 1)]?.author || authors[i % 3];
          const hash = state.commits[Math.min(i, state.commits.length - 1)]?.hash || 'abc1234';
          output.push({ type: 'output', text: `${hash.substr(0, 7)} (${author.padEnd(8)} 2024-01-${(i + 1).toString().padStart(2, '0')}) ${line}` });
        });
      } else {
        output.push({ type: 'error', text: `fatal: no such path '${file}' in HEAD` });
      }
    }
    // Git bisect
    else if (trimmed.startsWith('git bisect')) {
      if (trimmed === 'git bisect start') {
        newState.bisecting = true;
        output.push({ type: 'success', text: 'Bisecting: started' });
      } else if (trimmed === 'git bisect bad') {
        output.push({ type: 'output', text: 'Bisecting: 2 revisions left to test after this (roughly 1 step)' });
      } else if (trimmed.startsWith('git bisect good')) {
        output.push({ type: 'output', text: 'Bisecting: 1 revision left to test after this (roughly 1 step)' });
        output.push({ type: 'success', text: '[comm333] More changes' });
      } else if (trimmed === 'git bisect reset') {
        newState.bisecting = false;
        output.push({ type: 'success', text: 'Previous HEAD position was comm333' });
        output.push({ type: 'success', text: `Switched to branch '${state.currentBranch}'` });
      }
    }
    // Git reflog
    else if (trimmed === 'git reflog') {
      if (state.reflog) {
        state.reflog.forEach(entry => {
          output.push({ type: 'output', text: `${entry.hash.substr(0, 7)} ${entry.message}` });
        });
      } else {
        state.commits.slice().reverse().forEach((c, i) => {
          output.push({ type: 'output', text: `${c.hash} HEAD@{${i}}: commit: ${c.message}` });
        });
      }
    }
    // Git worktree
    else if (trimmed.startsWith('git worktree')) {
      if (trimmed === 'git worktree list') {
        output.push({ type: 'output', text: '/home/user/project  abc1234 [main]' });
        (state.worktrees || []).forEach(wt => {
          output.push({ type: 'output', text: `${wt.path}  ${wt.hash} [${wt.branch}]` });
        });
      } else if (trimmed.startsWith('git worktree add')) {
        const parts = trimmed.split(' ');
        const path = parts[3];
        const branch = parts[4] || 'main';
        newState.worktrees = [...(state.worktrees || []), { path, branch, hash: 'abc1234' }];
        output.push({ type: 'success', text: `Preparing worktree (checking out '${branch}')` });
        output.push({ type: 'output', text: `HEAD is now at abc1234` });
      } else if (trimmed.startsWith('git worktree remove')) {
        output.push({ type: 'success', text: 'Worktree removed' });
      }
    }
    // Git submodule
    else if (trimmed.startsWith('git submodule')) {
      if (trimmed.startsWith('git submodule add')) {
        const parts = trimmed.split(' ');
        const url = parts[3];
        const path = parts[4];
        newState.submodules = [...(state.submodules || []), { url, path }];
        output.push({ type: 'output', text: `Cloning into '${path}'...` });
        output.push({ type: 'success', text: 'Submodule added' });
      } else if (trimmed === 'git submodule status' || trimmed === 'git submodule') {
        const subs = state.submodules || [];
        if (subs.length > 0) {
          subs.forEach(s => {
            output.push({ type: 'output', text: ` abc1234 ${s.path} (heads/main)` });
          });
        } else {
          output.push({ type: 'output', text: '(no submodules)' });
        }
      } else if (trimmed.includes('update')) {
        output.push({ type: 'success', text: 'Submodule path: initialized and updated' });
      }
    }
    // Unknown command
    else {
      output.push({ type: 'error', text: `Command not recognized: ${trimmed}` });
      output.push({ type: 'output', text: `Type 'help' or 'git --help' for available commands.` });
    }

    return { newState, output, rebaseTodo };
  };

  const handleCommandSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

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
          setTimeout(() => {
            setCompletedStages(new Set([...completedStages, currentStage]));
            setTerminalOutput(prev => [...prev, { type: 'success', text: '\n🎉 Stage completed!' }]);
          }, 800);
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

  // Main menu
  if (!currentStage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <Terminal className="w-10 h-10 text-emerald-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Git Mastery Academy
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Master Git through hands-on practice. From basics to advanced workflows with remote operations.
            </p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> {completedStages.size} completed</span>
              <span>•</span>
              <span>{Object.values(stages).flat().length} total stages</span>
            </div>
          </div>

          <div className="space-y-8">
            {Object.entries(stages).map(([level, stageList]) => {
              const config = levelConfig[level];
              const Icon = config.icon;
              const completedInLevel = stageList.filter(s => completedStages.has(s.id)).length;
              
              return (
                <div key={level} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-${config.color}-500/20`}>
                      <Icon className={`w-5 h-5 text-${config.color}-400`} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{config.label}</h2>
                    <span className="text-sm text-slate-500 ml-auto">
                      {completedInLevel}/{stageList.length} completed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stageList.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => startStage(stage.id)}
                        className={`group relative p-4 rounded-xl text-left transition-all duration-200 border ${
                          completedStages.has(stage.id)
                            ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50'
                            : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{stage.title}</h3>
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{stage.description}</p>
                          </div>
                          {completedStages.has(stage.id) ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {stage.steps.slice(0, 5).map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-slate-600 border border-slate-700" />
                            ))}
                            {stage.steps.length > 5 && (
                              <span className="text-xs text-slate-500 ml-2">+{stage.steps.length - 5}</span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{stage.steps.length} steps</span>
                        </div>
                      </button>
                    ))}
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={returnToMenu}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Menu</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div>
              <h1 className="text-white font-medium">{currentStageData?.title}</h1>
              <p className="text-slate-400 text-sm hidden sm:block">{currentStageData?.description}</p>
            </div>
          </div>
          <button
            onClick={() => startStage(currentStage)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            {currentStageData?.steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx < currentStep ? 'bg-emerald-500' :
                  idx === currentStep ? 'bg-emerald-400 animate-pulse' :
                  'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Step {currentStep + 1} of {currentStageData?.steps.length}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full p-4 gap-4">
        {/* Instructions panel */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-medium text-sm">{currentStep + 1}</span>
              </div>
              <span className="text-slate-400 text-sm">Current Task</span>
            </div>
            
            <p className="text-white font-medium mb-4">
              {currentStageData?.steps[currentStep]?.instruction}
            </p>

            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                💡 Need help?
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Hints</p>
                  {currentStageData?.steps[currentStep]?.hints?.map((hint, i) => (
                    <p key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-cyan-400">•</span> {hint}
                    </p>
                  ))}
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Answer</p>
                  <code className="text-emerald-300 font-mono text-sm">
                    {currentStageData?.steps[currentStep]?.expectedCommand}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terminal / Documentation Tabs */}
        <div className="flex-1 flex flex-col min-h-[500px]">
          {/* Tabs */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'terminal'
                  ? 'bg-slate-900 text-white border-t border-l border-r border-slate-800'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 inline mr-2" />
              Terminal
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === 'docs'
                  ? 'bg-slate-900 text-white border-t border-l border-r border-slate-800'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documentation
            </button>
          </div>

          {/* Terminal Tab */}
          {activeTab === 'terminal' && (
            <>
              <div className="bg-slate-900 rounded-t-xl border border-slate-800 border-b-0 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-400 text-sm ml-2 font-mono">~/project</span>
              </div>
              
              <div 
                ref={terminalRef}
                className="flex-1 bg-slate-950 border border-slate-800 border-t-0 rounded-b-xl p-4 font-mono text-sm overflow-y-auto"
              >
                {terminalOutput.map((line, idx) => (
                  <div
                    key={idx}
                    className={`whitespace-pre-wrap ${
                      line.type === 'input' ? 'text-cyan-400' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'success' ? 'text-emerald-400' :
                      line.type === 'warning' ? 'text-yellow-400' :
                      line.type === 'system' ? 'text-purple-400' :
                      'text-slate-300'
                    }`}
                  >
                    {line.text}
                  </div>
                ))}
                
                <form onSubmit={handleCommandSubmit} className="flex items-center mt-2">
                  <span className="text-emerald-400 mr-2">$</span>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white caret-emerald-400"
                    placeholder="Type your command..."
                    autoFocus
                    spellCheck={false}
                  />
                </form>
              </div>
            </>
          )}

          {/* Documentation Tab */}
          {activeTab === 'docs' && (
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-6 overflow-y-auto">
              <DocumentationContent />
            </div>
          )}
        </div>

        {/* Rebase Todo Editor Modal */}
        {rebaseTodoList && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" style={{ pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }} className="w-full h-full flex items-center justify-center">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Interactive Rebase - Edit Todo List</h2>
                <button
                  onClick={() => {
                    setRebaseTodoList(null);
                    setRebaseTodoText('');
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Instructions Panel */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-emerald-400 font-semibold mb-2">📝 How to Edit:</h3>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>Change the first word on each line to modify commits</li>
                  <li><code className="text-emerald-400">pick</code> or <code className="text-emerald-400">p</code> = keep commit as-is</li>
                  <li><code className="text-emerald-400">squash</code> or <code className="text-emerald-400">s</code> = combine with previous commit</li>
                  <li><code className="text-emerald-400">reword</code> or <code className="text-emerald-400">r</code> = change commit message</li>
                  <li><code className="text-emerald-400">drop</code> or <code className="text-emerald-400">d</code> = remove commit</li>
                </ul>
                <p className="text-sm text-slate-400 mt-2">
                  <strong>Example:</strong> To combine WIP commits, change <code className="text-emerald-400">pick</code> to <code className="text-emerald-400">squash</code> for the commits you want to merge.
                </p>
              </div>
              
              <div className="flex-1 mb-4 min-h-[300px]">
                <textarea
                  value={rebaseTodoText}
                  onChange={(e) => setRebaseTodoText(e.target.value)}
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  spellCheck={false}
                  placeholder="Edit the rebase todo list..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setRebaseTodoList(null);
                    setRebaseTodoText('');
                    const output = [...terminalOutput, { type: 'input', text: '$ git rebase --abort' }];
                    const { newState, output: cmdOutput } = executeGitCommand('git rebase --abort', gitState, null);
                    setTerminalOutput([...output, ...cmdOutput]);
                    setGitState(newState);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" style={{ pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }} className="w-full h-full flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Resolve Merge Conflict - {conflictEditor.file}</h2>
                <button
                  onClick={() => setConflictEditor(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Instructions Panel */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <h3 className="text-yellow-400 font-semibold mb-2">⚠️ Conflict Resolution:</h3>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                  <li>Edit the file below to resolve the conflict</li>
                  <li>Remove the conflict markers: <code className="text-yellow-400">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code className="text-yellow-400">=======</code>, <code className="text-yellow-400">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code></li>
                  <li>Keep the content you want, or combine both versions</li>
                  <li>After editing, click "Mark as Resolved" and then run <code className="text-emerald-400">git add {conflictEditor.file}</code></li>
                </ul>
                <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-slate-400 mb-1">HEAD (current branch):</p>
                    <pre className="bg-slate-950 p-2 rounded text-slate-300">{conflictEditor.ours}</pre>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Incoming changes:</p>
                    <pre className="bg-slate-950 p-2 rounded text-slate-300">{conflictEditor.theirs}</pre>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 mb-4 min-h-[300px]">
                <textarea
                  value={conflictEditor.resolved}
                  onChange={(e) => setConflictEditor({ ...conflictEditor, resolved: e.target.value })}
                  className="w-full h-full bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  spellCheck={false}
                  placeholder="Edit to resolve conflict..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConflictEditor(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
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
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
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
