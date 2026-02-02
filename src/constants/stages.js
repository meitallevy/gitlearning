export const stages = {
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
        ],
        test: {
          questions: [
            {
              question: 'What command initializes a new Git repository?',
              options: ['git start', 'git init', 'git new', 'git create'],
              correct: 1
            },
            {
              question: 'What does git status show?',
              options: ['Only committed files', 'The current state of your repository', 'Remote repositories', 'Git version'],
              correct: 1
            },
            {
              question: 'What directory does git init create?',
              options: ['.git', '.github', '.gitignore', '.gitconfig'],
              correct: 0
            },
            {
              question: 'How do you view Git help information?',
              options: ['git help', 'git --help', 'Both of the above', 'git info'],
              correct: 2
            },
            {
              question: 'What information does git status NOT show?',
              options: ['Staged files', 'Untracked files', 'Remote repository URL', 'Modified files'],
              correct: 2
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command stages a file for commit?',
              options: ['git stage', 'git add', 'git commit', 'git push'],
              correct: 1
            },
            {
              question: 'What flag is used to add a commit message?',
              options: ['-msg', '-m', '-message', '-c'],
              correct: 1
            },
            {
              question: 'What is the correct order of Git workflow?',
              options: ['commit, add, status', 'add, commit, status', 'status, add, commit', 'commit, status, add'],
              correct: 2
            },
            {
              question: 'What does staging mean in Git?',
              options: ['Creating a branch', 'Preparing files for commit', 'Pushing to remote', 'Viewing history'],
              correct: 1
            },
            {
              question: 'What command shows commit history?',
              options: ['git history', 'git log', 'git commits', 'git show'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does "git add ." do?',
              options: ['Adds only modified files', 'Adds all files in current directory', 'Adds files to remote', 'Creates a new branch'],
              correct: 1
            },
            {
              question: 'How do you stage multiple files at once?',
              options: ['git add file1 file2', 'git add .', 'Both of the above', 'git stage all'],
              correct: 2
            },
            {
              question: 'What does the dot (.) mean in "git add ."?',
              options: ['Current file', 'Current directory and subdirectories', 'All repositories', 'Hidden files only'],
              correct: 1
            },
            {
              question: 'What is the difference between "git add ." and "git add -A"?',
              options: ['No difference', 'git add -A includes deleted files', 'git add . is faster', 'git add -A only adds new files'],
              correct: 1
            },
            {
              question: 'Can you stage specific files with git add?',
              options: ['No, only all files', 'Yes, by listing file names', 'Only with git stage', 'Only in certain Git versions'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command shows differences in files?',
              options: ['git status', 'git diff', 'git show', 'git compare'],
              correct: 1
            },
            {
              question: 'What does git diff show?',
              options: ['Commit history', 'Changes between commits or working directory', 'Remote repositories', 'Branch list'],
              correct: 1
            },
            {
              question: 'What does git diff show by default?',
              options: ['Staged changes', 'Unstaged changes in working directory', 'All changes', 'Remote changes'],
              correct: 1
            },
            {
              question: 'How do you see differences in staged files?',
              options: ['git diff', 'git diff --staged', 'git status', 'git show'],
              correct: 1
            },
            {
              question: 'What symbol does git diff use for added lines?',
              options: ['+', '-', '*', '>'],
              correct: 0
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What flag shows commit log in one line?',
              options: ['--single', '--oneline', '--compact', '--short'],
              correct: 1
            },
            {
              question: 'How do you view only the last 3 commits?',
              options: ['git log -3', 'git log --last 3', 'git log --limit 3', 'git log --head 3'],
              correct: 0
            },
            {
              question: 'What does git log show?',
              options: ['Current status', 'Commit history', 'Staged files', 'Remote repositories'],
              correct: 1
            },
            {
              question: 'What information does git log include?',
              options: ['Only commit messages', 'Commit hash, author, date, and message', 'Only file changes', 'Only commit dates'],
              correct: 1
            },
            {
              question: 'How do you limit git log output?',
              options: ['-n flag', '-<number>', '--max-count', 'All of the above'],
              correct: 3
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command creates a new branch?',
              options: ['git new branch', 'git branch <name>', 'git create branch', 'git add branch'],
              correct: 1
            },
            {
              question: 'How do you switch to a different branch?',
              options: ['git switch <name>', 'git checkout <name>', 'Both of the above', 'git change <name>'],
              correct: 2
            },
            {
              question: 'What is the default branch name in Git?',
              options: ['master', 'main', 'Both are common', 'develop'],
              correct: 2
            },
            {
              question: 'How do you list all branches?',
              options: ['git list', 'git branch', 'git branches', 'git show branches'],
              correct: 1
            },
            {
              question: 'What does the asterisk (*) mean in git branch output?',
              options: ['Branch is remote', 'Current branch', 'Branch has conflicts', 'Branch is merged'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command creates and switches to a branch in one step?',
              options: ['git branch -b', 'git checkout -b', 'git switch -b', 'git create -b'],
              correct: 1
            },
            {
              question: 'How do you delete a branch?',
              options: ['git branch -d <name>', 'git delete branch', 'git remove branch', 'git branch remove'],
              correct: 0
            },
            {
              question: 'What is the difference between git checkout and git switch?',
              options: ['No difference for branches', 'git switch is newer and branch-specific', 'git checkout is deprecated', 'git switch only works with remotes'],
              correct: 1
            },
            {
              question: 'Can you delete the branch you are currently on?',
              options: ['Yes, always', 'No, you must switch first', 'Only with -D flag', 'Only for remote branches'],
              correct: 1
            },
            {
              question: 'What does -D flag do when deleting a branch?',
              options: ['Deletes remote branch', 'Force delete even if not merged', 'Deletes all branches', 'Deletes and creates new branch'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command merges a branch into the current branch?',
              options: ['git combine', 'git merge <branch>', 'git join <branch>', 'git integrate'],
              correct: 1
            },
            {
              question: 'Which branch should you be on when merging?',
              options: ['The branch being merged', 'The target branch', 'Either branch', 'A new branch'],
              correct: 1
            },
            {
              question: 'What happens during a fast-forward merge?',
              options: ['A merge commit is created', 'Branch pointer moves forward', 'Files are overwritten', 'Conflicts always occur'],
              correct: 1
            },
            {
              question: 'What is a merge commit?',
              options: ['A regular commit', 'A commit that combines two branches', 'A deleted commit', 'A remote commit'],
              correct: 1
            },
            {
              question: 'When does Git create a merge commit?',
              options: ['Always', 'When branches have diverged', 'Only with --no-ff', 'Both B and C'],
              correct: 3
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What happens when Git cannot automatically merge?',
              options: ['Merge is cancelled', 'A merge conflict occurs', 'Files are overwritten', 'Nothing happens'],
              correct: 1
            },
            {
              question: 'After resolving a conflict, what must you do?',
              options: ['Run git merge again', 'Stage the resolved file and commit', 'Delete the branch', 'Reset the merge'],
              correct: 1
            },
            {
              question: 'What markers indicate a merge conflict?',
              options: ['<<<<<<<, =======, >>>>>>>', 'CONFLICT START, CONFLICT END', '{{{{, }}}}', '<<<, >>>'],
              correct: 0
            },
            {
              question: 'What does <<<<<<< HEAD indicate?',
              options: ['End of conflict', 'Your current branch changes', 'Incoming changes', 'Conflict resolution'],
              correct: 1
            },
            {
              question: 'How do you abort a merge?',
              options: ['git merge --abort', 'git reset', 'git checkout', 'git delete'],
              correct: 0
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'How do you unstage a file?',
              options: ['git unstage <file>', 'git restore --staged <file>', 'git remove <file>', 'git reset <file>'],
              correct: 1
            },
            {
              question: 'What does git restore --staged do?',
              options: ['Deletes the file', 'Unstages a file', 'Restores from remote', 'Creates a backup'],
              correct: 1
            },
            {
              question: 'What is the alternative to git restore --staged?',
              options: ['git unstage', 'git reset HEAD <file>', 'git remove', 'git delete'],
              correct: 1
            },
            {
              question: 'Does unstage delete the file?',
              options: ['Yes', 'No, it only removes from staging', 'Only with --force', 'Depends on file type'],
              correct: 1
            },
            {
              question: 'What happens to file changes when you unstage?',
              options: ['Changes are lost', 'Changes remain in working directory', 'Changes are committed', 'File is deleted'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What command discards uncommitted changes?',
              options: ['git discard', 'git restore <file>', 'git undo', 'git remove'],
              correct: 1
            },
            {
              question: 'What does git restore do?',
              options: ['Restores from backup', 'Discards changes in working directory', 'Restores from remote', 'Creates a restore point'],
              correct: 1
            },
            {
              question: 'What is the old way to discard changes?',
              options: ['git discard', 'git checkout -- <file>', 'git delete', 'git remove'],
              correct: 1
            },
            {
              question: 'Can you recover discarded changes?',
              options: ['Yes, always', 'No, they are permanently lost', 'Only if committed first', 'Only with reflog'],
              correct: 1
            },
            {
              question: 'What does git restore restore files to?',
              options: ['Last commit', 'Remote version', 'Initial state', 'HEAD state'],
              correct: 3
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git stash do?',
              options: ['Deletes changes', 'Temporarily saves uncommitted changes', 'Commits changes', 'Pushes to remote'],
              correct: 1
            },
            {
              question: 'What is the difference between git stash pop and git stash apply?',
              options: ['No difference', 'pop removes stash, apply keeps it', 'apply removes stash, pop keeps it', 'pop is faster'],
              correct: 1
            },
            {
              question: 'How do you list all stashes?',
              options: ['git stash', 'git stash list', 'git stash show', 'git stash all'],
              correct: 1
            },
            {
              question: 'Can you stash staged changes?',
              options: ['No', 'Yes, by default', 'Only with --include-untracked', 'Only with --keep-index'],
              correct: 1
            },
            {
              question: 'What happens to your working directory after stashing?',
              options: ['Files are deleted', 'Working directory becomes clean', 'Files are committed', 'Nothing changes'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does rebase do?',
              options: ['Merges branches', 'Replays commits on top of another branch', 'Deletes commits', 'Creates a new branch'],
              correct: 1
            },
            {
              question: 'What is the main advantage of rebase over merge?',
              options: ['Faster execution', 'Cleaner linear history', 'Easier to use', 'More secure'],
              correct: 1
            },
            {
              question: 'Which branch should you be on when rebasing?',
              options: ['The target branch', 'The branch being rebased', 'A new branch', 'Either branch'],
              correct: 1
            },
            {
              question: 'What happens to commit hashes during rebase?',
              options: ['They stay the same', 'They change', 'They are deleted', 'They are merged'],
              correct: 1
            },
            {
              question: 'When should you NOT use rebase?',
              options: ['On shared/public branches', 'On feature branches', 'On local branches', 'Never'],
              correct: 0
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git reset --soft do?',
              options: ['Undoes commit, keeps changes staged', 'Undoes commit, unstages changes', 'Deletes all changes', 'Creates a backup'],
              correct: 0
            },
            {
              question: 'What is HEAD~1?',
              options: ['The first commit', 'The commit before HEAD', 'The next commit', 'A branch name'],
              correct: 1
            },
            {
              question: 'What is the difference between HEAD~1 and HEAD^?',
              options: ['No difference', 'HEAD~1 is older', 'HEAD^ is for merges', 'HEAD~1 is for first parent'],
              correct: 0
            },
            {
              question: 'Can you recover from a soft reset?',
              options: ['No', 'Yes, using reflog', 'Only if committed', 'Only with backup'],
              correct: 1
            },
            {
              question: 'What happens to staged files after --soft reset?',
              options: ['They are deleted', 'They remain staged', 'They become unstaged', 'They are committed'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What is the default reset mode?',
              options: ['--soft', '--mixed', '--hard', '--default'],
              correct: 1
            },
            {
              question: 'What does mixed reset do?',
              options: ['Keeps changes staged', 'Unstages changes but keeps them', 'Deletes all changes', 'Creates a merge'],
              correct: 1
            },
            {
              question: 'What is another name for mixed reset?',
              options: ['Soft reset', 'Default reset', 'Hard reset', 'No other name'],
              correct: 1
            },
            {
              question: 'Where do changes go after mixed reset?',
              options: ['They are deleted', 'They go to working directory', 'They stay staged', 'They are committed'],
              correct: 1
            },
            {
              question: 'Can you recover from mixed reset?',
              options: ['No', 'Yes, changes are in working directory', 'Only with reflog', 'Only if committed'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git reset --hard do?',
              options: ['Undoes commit, keeps changes', 'Completely discards commits and changes', 'Creates a backup', 'Merges branches'],
              correct: 1
            },
            {
              question: 'When should you use --hard reset?',
              options: ['Always', 'When you want to keep changes', 'When you want to completely discard changes', 'Never'],
              correct: 2
            },
            {
              question: 'What does --hard reset affect?',
              options: ['Only commits', 'Commits, staging, and working directory', 'Only working directory', 'Only staging'],
              correct: 1
            },
            {
              question: 'Can you recover from --hard reset?',
              options: ['No, changes are lost', 'Yes, using reflog', 'Only if committed', 'Only with backup'],
              correct: 1
            },
            {
              question: 'Why is --hard reset dangerous?',
              options: ['It is slow', 'It permanently discards uncommitted changes', 'It creates conflicts', 'It is hard to use'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git revert do?',
              options: ['Deletes commits', 'Creates a new commit that undoes changes', 'Resets to previous commit', 'Merges branches'],
              correct: 1
            },
            {
              question: 'Why is revert safer than reset?',
              options: ['It is faster', 'It preserves history and is safe for shared branches', 'It is easier to use', 'It creates backups'],
              correct: 1
            },
            {
              question: 'What happens to commit history with revert?',
              options: ['History is rewritten', 'History is preserved, new commit added', 'History is deleted', 'History is merged'],
              correct: 1
            },
            {
              question: 'Can you revert multiple commits?',
              options: ['No', 'Yes, by specifying range', 'Only one at a time', 'Only with --all'],
              correct: 1
            },
            {
              question: 'When should you use revert instead of reset?',
              options: ['Always', 'On shared/public branches', 'On local branches only', 'Never'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git cherry-pick do?',
              options: ['Picks files from a branch', 'Applies a specific commit to current branch', 'Deletes a commit', 'Merges branches'],
              correct: 1
            },
            {
              question: 'When is cherry-pick useful?',
              options: ['When merging entire branches', 'When you need only specific commits from another branch', 'When deleting commits', 'When creating branches'],
              correct: 1
            },
            {
              question: 'What happens to commit hash when cherry-picking?',
              options: ['It stays the same', 'It changes', 'It is deleted', 'It is merged'],
              correct: 1
            },
            {
              question: 'Can you cherry-pick multiple commits?',
              options: ['No', 'Yes, by specifying range', 'Only one at a time', 'Only with --all'],
              correct: 1
            },
            {
              question: 'What happens if cherry-pick has conflicts?',
              options: ['It fails', 'You must resolve conflicts and continue', 'It skips the commit', 'It auto-resolves'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What are Git tags used for?',
              options: ['To mark branches', 'To mark specific points in history (like releases)', 'To delete commits', 'To merge branches'],
              correct: 1
            },
            {
              question: 'What is the difference between lightweight and annotated tags?',
              options: ['No difference', 'Annotated tags include metadata like author and message', 'Lightweight tags are larger', 'Annotated tags are faster'],
              correct: 1
            },
            {
              question: 'How do you create an annotated tag?',
              options: ['git tag <name>', 'git tag -a <name>', 'git tag --annotated', 'git create tag'],
              correct: 1
            },
            {
              question: 'How do you list all tags?',
              options: ['git tags', 'git tag', 'git list tags', 'git show tags'],
              correct: 1
            },
            {
              question: 'Can you push tags to remote?',
              options: ['No', 'Yes, with git push --tags', 'Only annotated tags', 'Only lightweight tags'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What is a remote repository?',
              options: ['A local backup', 'A repository hosted elsewhere (like GitHub)', 'A deleted repository', 'A branch name'],
              correct: 1
            },
            {
              question: 'What is the default name for the main remote?',
              options: ['main', 'origin', 'remote', 'upstream'],
              correct: 1
            },
            {
              question: 'How do you add a remote?',
              options: ['git remote add <name> <url>', 'git add remote', 'git create remote', 'git new remote'],
              correct: 0
            },
            {
              question: 'How do you view remotes?',
              options: ['git remote', 'git remotes', 'git show remote', 'git list remote'],
              correct: 0
            },
            {
              question: 'What does -v flag show with git remote?',
              options: ['Only names', 'Names and URLs', 'Only URLs', 'Remote branches'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git fetch do?',
              options: ['Merges changes', 'Downloads changes without merging', 'Pushes changes', 'Deletes remote'],
              correct: 1
            },
            {
              question: 'What does git branch -a show?',
              options: ['Only local branches', 'Only remote branches', 'Both local and remote branches', 'Deleted branches'],
              correct: 2
            },
            {
              question: 'What happens to your working directory after fetch?',
              options: ['It changes', 'It stays the same', 'Files are deleted', 'Branches are merged'],
              correct: 1
            },
            {
              question: 'How do you view remote branches?',
              options: ['git branch', 'git branch -r', 'git branch -a', 'Both B and C'],
              correct: 3
            },
            {
              question: 'What is the difference between fetch and pull?',
              options: ['No difference', 'Fetch downloads, pull downloads and merges', 'Pull is faster', 'Fetch merges, pull only downloads'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git pull do?',
              options: ['Pushes changes', 'Fetches and merges remote changes', 'Only fetches', 'Deletes remote'],
              correct: 1
            },
            {
              question: 'What is the difference between fetch and pull?',
              options: ['No difference', 'Pull fetches and merges, fetch only downloads', 'Fetch merges, pull only downloads', 'Pull is faster'],
              correct: 1
            },
            {
              question: 'What happens if pull creates conflicts?',
              options: ['Pull fails', 'You must resolve conflicts', 'Auto-merge occurs', 'Changes are discarded'],
              correct: 1
            },
            {
              question: 'Can you pull specific branches?',
              options: ['No', 'Yes, git pull origin <branch>', 'Only main branch', 'Only with --all'],
              correct: 1
            },
            {
              question: 'What does git pull --rebase do?',
              options: ['Pulls and creates merge commit', 'Pulls and rebases local commits', 'Only fetches', 'Forces pull'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git push do?',
              options: ['Downloads changes', 'Uploads commits to remote', 'Deletes remote', 'Creates a branch'],
              correct: 1
            },
            {
              question: 'What does -u flag do in git push?',
              options: ['Forces push', 'Sets upstream tracking', 'Undoes push', 'Creates remote'],
              correct: 1
            },
            {
              question: 'What happens if remote is ahead of local?',
              options: ['Push succeeds', 'Push is rejected', 'Auto-merge occurs', 'Remote is overwritten'],
              correct: 1
            },
            {
              question: 'How do you push a specific branch?',
              options: ['git push', 'git push origin <branch>', 'git push <branch>', 'Both A and B'],
              correct: 3
            },
            {
              question: 'What does upstream tracking do?',
              options: ['Forces push', 'Allows git push without specifying remote/branch', 'Deletes remote', 'Creates backup'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'When should you use force push?',
              options: ['Always', 'When you want to override remote history', 'Never', 'When pulling'],
              correct: 1
            },
            {
              question: 'What is safer than --force?',
              options: ['--force-hard', '--force-with-lease', '--force-safe', '--force-soft'],
              correct: 1
            },
            {
              question: 'Why is force push dangerous?',
              options: ['It is slow', 'It can overwrite others work', 'It is hard to use', 'It creates conflicts'],
              correct: 1
            },
            {
              question: 'What does --force-with-lease check?',
              options: ['Nothing', 'If remote has been updated by others', 'If local is ahead', 'If branch exists'],
              correct: 1
            },
            {
              question: 'When should you NEVER use force push?',
              options: ['On feature branches', 'On shared/main branches', 'On local branches', 'Never'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git pull --rebase do?',
              options: ['Pulls and creates merge commit', 'Pulls and rebases local commits on top', 'Only fetches', 'Forces push'],
              correct: 1
            },
            {
              question: 'Why use pull --rebase?',
              options: ['It is faster', 'It creates a cleaner linear history', 'It is easier', 'It deletes commits'],
              correct: 1
            },
            {
              question: 'What happens to local commits with pull --rebase?',
              options: ['They are deleted', 'They are replayed on top of remote', 'They are merged', 'They are ignored'],
              correct: 1
            },
            {
              question: 'Can pull --rebase create conflicts?',
              options: ['No', 'Yes, if local and remote modified same lines', 'Only with --force', 'Only on main branch'],
              correct: 1
            },
            {
              question: 'What is the default pull behavior?',
              options: ['Rebase', 'Merge', 'Fetch only', 'Force'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git clone do?',
              options: ['Creates a new repository', 'Downloads a complete repository', 'Deletes a repository', 'Merges repositories'],
              correct: 1
            },
            {
              question: 'What is automatically configured when you clone?',
              options: ['Branches', 'Remote named origin', 'Tags', 'Commits'],
              correct: 1
            },
            {
              question: 'What does clone download?',
              options: ['Only current branch', 'All branches and history', 'Only files', 'Only commits'],
              correct: 1
            },
            {
              question: 'Can you clone a specific branch?',
              options: ['No', 'Yes, with -b flag', 'Only main branch', 'Only with --single-branch'],
              correct: 1
            },
            {
              question: 'What happens to remote tracking after clone?',
              options: ['Nothing', 'Local branches track remote branches', 'Remote is deleted', 'Tracking must be set manually'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'How do you push a feature branch to remote?',
              options: ['git push', 'git push -u origin <branch>', 'git push branch', 'git upload'],
              correct: 1
            },
            {
              question: 'What does -u flag do when pushing?',
              options: ['Forces push', 'Sets upstream tracking', 'Undoes push', 'Creates branch'],
              correct: 1
            },
            {
              question: 'What happens after setting upstream?',
              options: ['Nothing', 'You can use git push without arguments', 'Branch is deleted', 'Remote is created'],
              correct: 1
            },
            {
              question: 'Can you push multiple branches at once?',
              options: ['No', 'Yes, with git push --all', 'Only with --force', 'Only main and develop'],
              correct: 1
            },
            {
              question: 'What does git branch -a show after pushing?',
              options: ['Only local branches', 'Local and remote-tracking branches', 'Only remote branches', 'Deleted branches'],
              correct: 1
            }
          ]
        }
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
              // Check if command is continue
              const cmdMatches = cmd.trim() === 'git rebase --continue';
              // Accept if command matches and rebase was in progress before
              // The state check ensures rebase was actually in progress
              return cmdMatches && (prevState?.rebaseInProgress === true || state?.rebaseInProgress === false);
            },
            expectedCommand: 'git rebase --continue'
          },
          {
            instruction: 'View the cleaned up history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          }
        ],
        test: {
          questions: [
            {
              question: 'What does interactive rebase allow you to do?',
              options: ['Only view commits', 'Modify commit history interactively', 'Delete all commits', 'Create branches'],
              correct: 1
            },
            {
              question: 'What does "squash" do in interactive rebase?',
              options: ['Deletes commit', 'Combines commit with previous one', 'Splits commit', 'Renames commit'],
              correct: 1
            },
            {
              question: 'What does "pick" mean in interactive rebase?',
              options: ['Delete commit', 'Keep commit as-is', 'Combine commits', 'Edit commit'],
              correct: 1
            },
            {
              question: 'What does "reword" do in interactive rebase?',
              options: ['Deletes commit', 'Changes commit message', 'Combines commits', 'Splits commit'],
              correct: 1
            },
            {
              question: 'When should you use interactive rebase?',
              options: ['On shared branches', 'On local branches before pushing', 'Always', 'Never'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git bisect do?',
              options: ['Finds bugs', 'Finds the commit that introduced a bug', 'Deletes commits', 'Merges branches'],
              correct: 1
            },
            {
              question: 'How does bisect work?',
              options: ['By testing all commits', 'By binary search through commits', 'By random selection', 'By date'],
              correct: 1
            },
            {
              question: 'What do you mark first in bisect?',
              options: ['Good commit', 'Bad commit', 'Current commit', 'Any commit'],
              correct: 1
            },
            {
              question: 'What does git bisect reset do?',
              options: ['Starts bisect', 'Ends bisect and returns to original state', 'Marks commit as bad', 'Marks commit as good'],
              correct: 1
            },
            {
              question: 'Why is bisect efficient?',
              options: ['It is fast', 'It uses binary search to minimize tests', 'It tests all commits', 'It skips commits'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What is reflog?',
              options: ['A log of remote changes', 'A log of all HEAD movements and commits', 'A list of branches', 'A list of tags'],
              correct: 1
            },
            {
              question: 'What can you use reflog for?',
              options: ['Viewing commits', 'Recovering lost commits', 'Deleting commits', 'Creating branches'],
              correct: 1
            },
            {
              question: 'How long does reflog keep entries?',
              options: ['Forever', '90 days by default', '30 days', '7 days'],
              correct: 1
            },
            {
              question: 'What does HEAD@{1} mean?',
              options: ['First commit', 'HEAD position 1 step ago', 'Branch name', 'Remote reference'],
              correct: 1
            },
            {
              question: 'Can you recover from hard reset using reflog?',
              options: ['No', 'Yes, if within reflog retention period', 'Only with backup', 'Only if committed'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What are Git worktrees?',
              options: ['Multiple working directories for same repo', 'Different repositories', 'Backup copies', 'Remote branches'],
              correct: 0
            },
            {
              question: 'Why use worktrees?',
              options: ['To work on multiple branches simultaneously', 'To backup code', 'To delete branches', 'To merge faster'],
              correct: 0
            },
            {
              question: 'How do you create a worktree?',
              options: ['git worktree add <path> <branch>', 'git create worktree', 'git new worktree', 'git worktree new'],
              correct: 0
            },
            {
              question: 'How do you list worktrees?',
              options: ['git worktree', 'git worktree list', 'git list worktree', 'git show worktree'],
              correct: 1
            },
            {
              question: 'Can you have multiple worktrees for the same branch?',
              options: ['Yes', 'No, each branch can only have one worktree', 'Only with --force', 'Only for main branch'],
              correct: 1
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What are Git submodules?',
              options: ['Small modules', 'Other repositories included in your project', 'Deleted files', 'Backup files'],
              correct: 1
            },
            {
              question: 'What does git submodule add do?',
              options: ['Deletes a module', 'Adds another repository as a subdirectory', 'Creates a branch', 'Merges repositories'],
              correct: 1
            },
            {
              question: 'How do you initialize submodules after cloning?',
              options: ['git submodule init', 'git submodule update --init', 'git submodule clone', 'Both A and B'],
              correct: 3
            },
            {
              question: 'What does .gitmodules file contain?',
              options: ['Submodule code', 'Submodule configuration', 'Submodule history', 'Submodule branches'],
              correct: 1
            },
            {
              question: 'How do you update submodules?',
              options: ['git submodule update', 'git pull in submodule', 'git submodule sync', 'All of the above'],
              correct: 3
            }
          ]
        }
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
        ],
        test: {
          questions: [
            {
              question: 'What does git blame show?',
              options: ['Who to blame for bugs', 'Who last modified each line of a file', 'Commit history', 'Branch list'],
              correct: 1
            },
            {
              question: 'What does git log -S do?',
              options: ['Shows commits', 'Searches for commits that add/remove a string', 'Shows authors', 'Shows branches'],
              correct: 1
            },
            {
              question: 'What does git log --author do?',
              options: ['Shows all commits', 'Filters commits by author', 'Shows author info', 'Creates author'],
              correct: 1
            },
            {
              question: 'What is the pickaxe search (-S)?',
              options: ['Search by commit message', 'Search for commits that add/remove specific string', 'Search by date', 'Search by branch'],
              correct: 1
            },
            {
              question: 'Why is git blame useful?',
              options: ['To find bugs', 'To see who wrote what code and when', 'To delete code', 'To merge branches'],
              correct: 1
            }
          ]
        }
      },
      {
        id: 'comprehensive-practice',
        title: 'Comprehensive Practice',
        description: 'Practice all Git concepts without documentation',
        setup: (state) => ({
          ...state,
          initialized: true,
          branches: ['main', 'feature'],
          currentBranch: 'main',
          files: { 'app.js': 'console.log("Hello");' },
          commits: [
            { hash: 'init1', message: 'Initial commit', files: { 'app.js': 'console.log("Hello");' } }
          ],
          workingDirectory: { 'newfile.js': 'console.log("New");' },
          remotes: { origin: 'https://github.com/user/repo.git' }
        }),
        steps: [
          {
            instruction: 'Check the current status',
            validator: (cmd) => cmd.trim() === 'git status',
            expectedCommand: 'git status'
          },
          {
            instruction: 'Stage the new file',
            validator: (cmd) => cmd.trim() === 'git add newfile.js',
            expectedCommand: 'git add newfile.js'
          },
          {
            instruction: 'Commit with message "Add new file"',
            validator: (cmd) => cmd.trim() === 'git commit -m "Add new file"',
            expectedCommand: 'git commit -m "Add new file"'
          },
          {
            instruction: 'Create and switch to a feature branch',
            validator: (cmd) => cmd.trim() === 'git checkout -b feature' || cmd.trim() === 'git switch -c feature',
            expectedCommand: 'git checkout -b feature'
          },
          {
            instruction: 'View commit history',
            validator: (cmd) => cmd.trim().startsWith('git log'),
            expectedCommand: 'git log --oneline'
          },
          {
            instruction: 'Switch back to main',
            validator: (cmd) => cmd.trim() === 'git checkout main' || cmd.trim() === 'git switch main',
            expectedCommand: 'git checkout main'
          },
          {
            instruction: 'Merge feature branch',
            validator: (cmd) => cmd.trim() === 'git merge feature',
            expectedCommand: 'git merge feature'
          }
        ],
        test: {
          questions: [
            {
              question: 'What is the complete Git workflow?',
              options: ['add, commit, push', 'status, add, commit, push', 'init, add, commit', 'clone, pull, push'],
              correct: 1
            },
            {
              question: 'What command shows repository status?',
              options: ['git show', 'git status', 'git info', 'git check'],
              correct: 1
            },
            {
              question: 'What is the correct order for staging and committing?',
              options: ['commit, add', 'add, commit', 'status, commit', 'push, add'],
              correct: 1
            },
            {
              question: 'What does git checkout -b do?',
              options: ['Deletes branch', 'Creates and switches to new branch', 'Merges branches', 'Shows branches'],
              correct: 1
            },
            {
              question: 'What command combines two branches?',
              options: ['git combine', 'git merge', 'git join', 'git integrate'],
              correct: 1
            }
          ]
        },
        hideDocs: true
      }
    ]
  };
