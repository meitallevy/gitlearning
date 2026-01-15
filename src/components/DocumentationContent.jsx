import React, { useState, useMemo, useEffect } from 'react';
import './DocumentationContent.css';

const DocumentationContent = () => {
  const [selectedCommand, setSelectedCommand] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

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
    shell: {
      title: 'Basic Shell Commands',
      content: `Essential shell commands used with Git.

These are NOT Git commands, but basic terminal/shell commands you'll need:

CAT - Display file contents
  cat <filename>
  Displays the contents of a file in the terminal.
  
  EXAMPLES:
    cat config.txt          # View config.txt file
    cat app.js              # View app.js file
  
  USE CASES:
    - View file contents
    - Check merge conflict markers (<<<<<<<, =======, >>>>>>>)
    - Read configuration files
    - Inspect code before committing

LS - List directory contents
  ls [options]
  Lists files and directories in the current location.
  
  OPTIONS:
    -la    Show all files including hidden ones with details
  
  EXAMPLES:
    ls                     # List files in current directory
    ls -la                 # List all files with details
  
  USE CASES:
    - See what files are in a directory
    - Check if files exist
    - After cloning a repository (e.g., "List files in the cloned repo")

PWD - Print working directory
  pwd
  Shows the current directory path.
  
  EXAMPLES:
    pwd                    # Shows current directory path

IMPORTANT NOTES:
  - These are standard Unix/Linux shell commands
  - They work in Git Bash, Terminal, and most command-line interfaces
  - Essential for viewing files and navigating directories
  - "cat" is especially useful for viewing merge conflict markers
  - "ls" is commonly used after cloning repositories to see what was downloaded`
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
    Stage all changes (new, modified, deleted) in the entire repository
  -u, --update
    Stage only modified and deleted files
  -p, --patch
    Interactively choose hunks to stage
  --dry-run
    Show what would be staged without actually staging

IMPORTANT NOTES:
  - "git add ." stages all files in the current directory and subdirectories
  - "git add -A" stages all changes in the entire repository (including deleted files)
  - The dot (.) means "current directory and all subdirectories"
  - You can stage specific files by listing them: git add file1.txt file2.txt
  - Difference: "git add ." only adds files in current directory tree,
    while "git add -A" adds all changes in the entire repository

EXAMPLES:
  git add file.txt
  git add .
  git add -A
  git add -p
  git add *.js
  git add file1.txt file2.txt`
    },
    bisect: {
      title: 'git bisect',
      content: `Use binary search to find the commit that introduced a bug.

SYNTAX:
  git bisect start [<bad> [<good>...]] [--] [<pathspec>...]
  git bisect bad [<rev>]
  git bisect good [<rev>...]
  git bisect skip [<rev>...]
  git bisect reset [<commit>]
  git bisect visualize
  git bisect replay <logfile>
  git bisect log
  git bisect run <cmd>...

DESCRIPTION:
  Uses binary search to find which commit introduced a bug.

COMMANDS:
  start    Begin bisection
  bad      Mark current commit as bad
  good     Mark current commit as good
  skip     Skip current commit
  reset    Return to original state
  visualize Show bisect log

EXAMPLES:
  git bisect start
  git bisect bad
  git bisect good abc123
  git bisect reset`
    },
    blame: {
      title: 'git blame',
      content: `Show what revision and author last modified each line of a file.

SYNTAX:
  git blame [<options>] [<rev-opts>] [<rev>] [--] <file>

DESCRIPTION:
  Annotates each line in the given file with information from the revision which last modified the line.

IMPORTANT NOTES:
  - Shows WHO last modified each line of a file
  - Shows WHEN (commit) and WHAT (author) changed each line
  - Useful for finding who wrote specific code and when
  - Also called "pickaxe" when used with git log -S

OPTIONS:
  -L <start>,<end>
    Annotate only the given line range
  -w
    Ignore whitespace changes
  -M
    Detect moved or copied lines
  -C
    Detect lines moved or copied from other files

EXAMPLES:
  git blame file.txt           # Show who modified each line
  git blame -L 10,20 file.txt  # Show only lines 10-20
  git blame -w file.txt        # Ignore whitespace changes
  git blame -M file.txt        # Detect moved lines`
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

IMPORTANT NOTES:
  - The asterisk (*) in git branch output indicates the current branch
  - Default branch name is typically "main" or "master" (both are common)
  - You cannot delete the branch you are currently on (must switch first)
  - -D flag force deletes even if branch is not merged

OPTIONS:
  -a, --all
    List both remote-tracking and local branches
  -r, --remotes
    List only remote-tracking branches
  -d, --delete
    Delete a branch (only if merged)
  -D
    Force delete a branch (even if not merged)
  -m, --move
    Rename a branch
  --merged
    List only merged branches

EXAMPLES:
  git branch                  # List local branches (asterisk shows current)
  git branch feature-x        # Create new branch
  git branch -a               # List all branches (local and remote)
  git branch -r               # List only remote branches
  git branch -d old-feature   # Delete merged branch
  git branch -D old-feature   # Force delete unmerged branch
  git branch -m old-name new-name`
    },
    cherrypick: {
      title: 'git cherry-pick',
      content: `Apply the changes introduced by some existing commits.

SYNTAX:
  git cherry-pick [<options>] <commit>...

DESCRIPTION:
  Applies the changes from one or more commits to the current branch.

IMPORTANT NOTES:
  - Useful when you need only SPECIFIC commits from another branch
  - Commit hash CHANGES when cherry-picked (new commit is created)
  - Can cherry-pick multiple commits by specifying range
  - If conflicts occur, resolve them and use --continue
  - Alternative to merging entire branch when you only need some commits

OPTIONS:
  -n, --no-commit
    Don't automatically create a commit
  -e, --edit
    Edit the commit message
  -x
    Append a line that says "(cherry picked from commit...)"
  --continue
    Continue the operation after resolving conflicts
  --abort
    Cancel the operation

EXAMPLES:
  git cherry-pick abc123      # Apply specific commit to current branch
  git cherry-pick -n abc123   # Apply without committing
  git cherry-pick main..feature # Apply range of commits
  git cherry-pick --continue  # Continue after resolving conflicts`
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

IMPORTANT NOTES:
  - "git switch" is newer and branch-specific (recommended for switching branches)
  - "git checkout" is older and has multiple purposes (branches, files, etc.)
  - Both commands can create and switch to a branch in one command
  - "git checkout -b" is equivalent to "git switch -c"
  - "git switch" is safer and clearer for branch operations

OPTIONS:
  -b <branch>
    Create a new branch and switch to it (git checkout)
  -c <branch>
    Create a new branch and switch to it (git switch)
  --track
    Set up tracking information

EXAMPLES:
  git checkout main           # Switch to main branch
  git checkout -b feature-x   # Create and switch to feature-x
  git switch main             # Switch to main (newer, recommended)
  git switch -c feature-x     # Create and switch to feature-x (newer)`
    },
    clone: {
      title: 'git clone',
      content: `Clone a repository into a new directory.

SYNTAX:
  git clone [<options>] [--] <repo> [<directory>]

DESCRIPTION:
  Clones a repository into a newly created directory.

IMPORTANT NOTES:
  - Downloads ALL branches and complete history by default
  - Automatically configures remote named "origin"
  - Local branches automatically track remote branches
  - Can clone specific branch with -b flag
  - Creates a complete copy of the repository

OPTIONS:
  --depth <depth>
    Create a shallow clone with limited history
  -b <name>, --branch <name>
    Checkout specified branch instead of default
  --single-branch
    Clone only one branch
  --recursive
    Initialize submodules

EXAMPLES:
  git clone https://github.com/user/repo.git
  git clone -b develop https://github.com/user/repo.git
  git clone --depth 1 https://github.com/user/repo.git
  git clone repo.git my-project`
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
    diff: {
      title: 'git diff',
      content: `Show changes between commits, commit and working tree, etc.

SYNTAX:
  git diff [<options>] [<commit>] [--] [<path>...]
  git diff [<options>] --cached [<commit>] [--] [<path>...]
  git diff [<options>] <commit> <commit> [--] [<path>...]

DESCRIPTION:
  Shows changes between the working directory and staging area, or between commits.

IMPORTANT NOTES:
  - By default, "git diff" shows UNSTAGED changes in the working directory
  - Use "--staged" or "--cached" to see changes that are already staged
  - The output uses "+" for added lines and "-" for removed lines
  - Shows differences between working directory and staging area by default

OPTIONS:
  --staged, --cached
    Show changes in staging area (staged changes)
  --stat
    Show statistics about changes
  -w, --ignore-all-space
    Ignore whitespace changes

EXAMPLES:
  git diff                    # Shows unstaged changes
  git diff file.txt           # Shows unstaged changes in file.txt
  git diff --staged           # Shows staged changes
  git diff HEAD               # Shows all changes
  git diff main feature       # Shows differences between branches`
    },
    fetch: {
      title: 'git fetch',
      content: `Download objects and refs from another repository.

SYNTAX:
  git fetch [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Downloads commits, files, and refs from a remote repository without merging.

IMPORTANT NOTES:
  - Downloads changes WITHOUT merging (working directory stays the same)
  - Use "git branch -a" to see remote-tracking branches after fetch
  - Use "git branch -r" to see only remote branches
  - Difference from pull: fetch only downloads, pull downloads AND merges
  - Safe operation: doesn't change your working directory

OPTIONS:
  --all
    Fetch all remotes
  --prune
    Remove remote-tracking references that no longer exist

EXAMPLES:
  git fetch                  # Fetch from default remote
  git fetch origin           # Fetch from origin
  git fetch --all            # Fetch from all remotes
  git fetch origin main      # Fetch specific branch`
    },
    help: {
      title: 'git help',
      content: `Display help information about Git.

SYNTAX:
  git help [<command>]
  git help -a
  git help -g

DESCRIPTION:
  Shows help information for Git commands.

OPTIONS:
  -a, --all
    List all available commands
  -g, --guides
    List available guides
  -w, --web
    Open manual in web browser

EXAMPLES:
  git help
  git help commit
  git help -a
  git help -g
  git help --web add`
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
    log: {
      title: 'git log',
      content: `Show commit logs.

SYNTAX:
  git log [<options>] [<revision-range>] [[--] <path>]

DESCRIPTION:
  Lists commits in reverse chronological order.

IMPORTANT NOTES:
  - Shows commit hash, author, date, and message by default
  - Use -n or --max-count to limit number of commits (e.g., git log -3)
  - -S is called "pickaxe search" - finds commits that add/remove a string
  - --author filters commits by author name or email
  - Shows commit history (not current status or staged files)

OPTIONS:
  --oneline
    Show each commit on a single line
  -n, --max-count <number>, -<number>
    Limit the number of commits (e.g., -3 for last 3 commits)
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
  -S <string>, --pickaxe-all
    Search for commits that add or remove the specified string (pickaxe search)
  --author=<pattern>
    Filter commits by author name or email
  --grep=<pattern>
    Filter commits by commit message

EXAMPLES:
  git log                      # Show full commit history
  git log --oneline            # Show one line per commit
  git log -3                   # Show last 3 commits
  git log -n 3                 # Same as above
  git log --graph --oneline --all  # Visual graph of all branches
  git log --stat               # Show file statistics
  git log -S "return null"     # Find commits that add/remove "return null"
  git log --author="John Doe"   # Filter by author name
  git log --author="john@example.com"  # Filter by email
  git log --grep="bug fix"     # Search commit messages`
    },
    merge: {
      title: 'git merge',
      content: `Join two or more development histories together.

SYNTAX:
  git merge [<options>] [<commit>...]

DESCRIPTION:
  Incorporates changes from the named commits into the current branch.

IMPORTANT NOTES:
  - You should be on the TARGET branch when merging (the branch that will receive changes)
  - Fast-forward merge: When branches haven't diverged, branch pointer just moves forward (no merge commit)
  - Merge commit: Created when branches have diverged or with --no-ff flag
  - Merge commit combines two branches and preserves history of both
  - Merge conflicts occur when Git cannot automatically merge (same lines modified)
  - Conflict markers: <<<<<<< (your changes), ======= (separator), >>>>>>> (incoming changes)
  - To view conflicts: Use "cat <filename>" to see conflict markers in the file
  - After resolving conflicts: edit file to remove markers, stage with "git add", then commit

OPTIONS:
  --no-ff
    Create a merge commit even if fast-forward is possible
  --squash
    Create a single commit instead of merging
  --abort
    Abort the current merge (returns to state before merge)
  -m <msg>
    Set the merge commit message

EXAMPLES:
  git merge feature-x         # Merge feature-x into current branch
  git merge --no-ff feature-x  # Force merge commit creation
  git merge --squash feature-x # Squash all commits into one
  git merge --abort            # Cancel merge in progress`
    },
    pull: {
      title: 'git pull',
      content: `Fetch from and integrate with another repository.

SYNTAX:
  git pull [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Fetches from a remote and merges into the current branch.

IMPORTANT NOTES:
  - Default behavior: fetch + merge (creates merge commit if branches diverged)
  - --rebase: fetch + rebase (replays local commits on top, creates linear history)
  - Pull with rebase avoids merge commits and keeps history cleaner
  - Can create conflicts if local and remote modified same lines
  - Use "git pull --rebase" to keep history linear

OPTIONS:
  --rebase
    Rebase local commits on top of remote (instead of merging)
  --ff-only
    Only fast-forward if possible
  --no-ff
    Always create a merge commit

EXAMPLES:
  git pull                    # Fetch and merge (default)
  git pull origin main        # Pull from specific remote/branch
  git pull --rebase           # Fetch and rebase (cleaner history)
  git pull --rebase origin main  # Pull with rebase from specific remote/branch`
    },
    push: {
      title: 'git push',
      content: `Update remote refs along with associated objects.

SYNTAX:
  git push [<options>] [<repository> [<refspec>...]]

DESCRIPTION:
  Uploads local branch commits to the remote repository.

IMPORTANT NOTES:
  - Push is rejected if remote is ahead of local (must pull first)
  - --force-with-lease is SAFER than --force (checks if remote was updated)
  - --force can overwrite others' work (DANGEROUS, especially on shared branches)
  - After setting upstream with -u, you can use "git push" without arguments
  - NEVER use force push on shared/main branches

OPTIONS:
  -u, --set-upstream
    Set upstream tracking (allows future "git push" without arguments)
  --force, -f
    Force push (overwrites remote, DANGEROUS)
  --force-with-lease
    Safer force push (only if remote hasn't been updated by others)
  --all
    Push all branches

EXAMPLES:
  git push                    # Push to upstream (if set)
  git push origin main        # Push main branch to origin
  git push -u origin feature-x # Push and set upstream
  git push --force            # Force push (dangerous!)
  git push --force-with-lease # Safer force push (recommended)`
    },
    rebase: {
      title: 'git rebase',
      content: `Reapply commits on top of another base tip.

SYNTAX:
  git rebase [<options>] [<upstream>] [<branch>]
  git rebase [<options>] --interactive [<base>]

DESCRIPTION:
  Takes commits from one branch and replays them on another branch.

IMPORTANT NOTES:
  - Main advantage: Creates cleaner linear history (no merge commits)
  - Commit hashes CHANGE during rebase (commits are recreated)
  - You should be on the branch being REBASED (not the target branch)
  - NEVER rebase shared/public branches (only use on local branches before pushing)
  - Use on feature branches before merging to keep history clean

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
  pick, p    Use commit as-is (keep commit unchanged)
  reword, r  Use commit, but edit the commit message
  edit, e    Use commit, but stop for amending
  squash, s  Combine commit with previous one (meld into previous)
  fixup, f   Like squash, but discard the commit message
  drop, d    Remove commit entirely

EXAMPLES:
  git rebase main            # Rebase current branch onto main
  git rebase -i HEAD~3       # Interactive rebase for last 3 commits
  git rebase --continue      # Continue after resolving conflicts
  git rebase --abort         # Cancel rebase and return to original state`
    },
    reflog: {
      title: 'git reflog',
      content: `Reference logs, or "reflogs", record when the tips of branches were updated.

SYNTAX:
  git reflog [show] [<log-options>] [<ref>]
  git reflog expire [<options>] [<ref>...]
  git reflog delete [<options>] [<ref>...]
  git reflog exists <ref>

DESCRIPTION:
  Shows a log of where your HEAD and branch references have been.

IMPORTANT NOTES:
  - Reflog keeps entries for 90 DAYS by default (retention period)
  - Can recover LOST commits using reflog (even after hard reset)
  - HEAD@{1} means "HEAD position 1 step ago"
  - HEAD@{2} means "HEAD position 2 steps ago"
  - Use reflog to find commit hashes of "lost" work
  - Essential for recovering from mistakes like hard reset

OPTIONS:
  --all
    Show all refs
  --date=<format>
    Show date in specified format
  -n, --max-count=<number>
    Limit number of entries

EXAMPLES:
  git reflog                  # Show reflog for HEAD
  git reflog show HEAD        # Same as above
  git reflog --all            # Show all refs
  git reflog -10              # Show last 10 entries
  git checkout HEAD@{2}       # Checkout HEAD from 2 steps ago`
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
    reset: {
      title: 'git reset',
      content: `Reset current HEAD to the specified state.

SYNTAX:
  git reset [<mode>] [<commit>]

DESCRIPTION:
  Moves the current branch to the specified commit.

IMPORTANT NOTES:
  - HEAD~1 means "one commit before HEAD" (the previous commit)
  - HEAD^ is equivalent to HEAD~1 (both mean the same thing)
  - HEAD~2 means two commits before HEAD
  - You can recover from reset using reflog (within retention period)
  - --hard is DANGEROUS: permanently discards uncommitted changes

MODES:
  --soft
    Undo commit, keep changes STAGED (ready to commit again)
  --mixed (default)
    Undo commit, keep changes in WORKING DIRECTORY (unstaged)
  --hard
    Undo commit AND discard all changes (DANGEROUS)

EXAMPLES:
  git reset HEAD~1            # Mixed reset (default): undo commit, keep changes unstaged
  git reset --soft HEAD~1    # Undo commit, keep changes staged
  git reset --mixed HEAD~1   # Same as above (mixed is default)
  git reset --hard HEAD~1    # Undo commit and discard all changes (dangerous!)
  git reset --hard origin/main`
    },
    restore: {
      title: 'git restore',
      content: `Restore working tree files.

SYNTAX:
  git restore [<options>] [--source=<tree>] [--staged] [--worktree] [--] <pathspec>...
  git restore [<options>] [--source=<tree>] --staged [--] <pathspec>...
  git restore [<options>] [--source=<tree>] --worktree [--] <pathspec>...

DESCRIPTION:
  Restores files in the working tree or staging area from a source.

IMPORTANT NOTES:
  - "git restore <file>" discards uncommitted changes in working directory
  - "git restore --staged <file>" unstages a file (removes from staging)
  - Restores files to HEAD state by default (last commit)
  - Alternative old command: "git checkout -- <file>" (git restore is newer)
  - Discarded changes are PERMANENTLY LOST (cannot recover)
  - Does NOT delete the file, only removes uncommitted changes

OPTIONS:
  --staged
    Restore the index (unstage files)
  --worktree
    Restore working tree files (default)
  --source=<tree>
    Restore from specified tree (default: HEAD)

EXAMPLES:
  git restore file.txt                    # Discard changes in file.txt
  git restore --staged file.txt           # Unstage file.txt
  git restore --source=HEAD~1 file.txt   # Restore from previous commit`
    },
    revert: {
      title: 'git revert',
      content: `Revert some existing commits.

SYNTAX:
  git revert [<options>] <commit>...

DESCRIPTION:
  Creates a new commit that undoes the changes made by the specified commit(s).

IMPORTANT NOTES:
  - SAFER than reset: preserves history and safe for shared branches
  - Creates a NEW commit that undoes changes (history is preserved)
  - Use on shared/public branches instead of reset
  - Can revert multiple commits by specifying range
  - History shows both original commit and revert commit

OPTIONS:
  -n, --no-commit
    Don't automatically create a commit
  -m <parent-number>
    Specify the mainline parent for merge commits
  --no-edit
    Don't edit the commit message

EXAMPLES:
  git revert HEAD            # Revert last commit (creates new commit)
  git revert abc123           # Revert specific commit
  git revert -n HEAD          # Revert without committing
  git revert main..feature     # Revert range of commits`
    },
    submodule: {
      title: 'git submodule',
      content: `Initialize, update or inspect submodules.

SYNTAX:
  git submodule [--quiet] add [<options>] [--] <repository> [<path>]
  git submodule [--quiet] status [--cached] [--recursive] [--] [<path>...]
  git submodule [--quiet] init [--] [<path>...]
  git submodule [--quiet] update [<options>] [--] [<path>...]

DESCRIPTION:
  Manages submodules - repositories within repositories.

IMPORTANT NOTES:
  - Submodules are OTHER repositories included in your project
  - .gitmodules file contains submodule configuration
  - After cloning, must initialize submodules with "git submodule init"
  - Update submodules with "git submodule update" or pull in submodule directory
  - Use "git submodule update --init" to initialize and update in one command

COMMANDS:
  add      Add a submodule (another repository as subdirectory)
  status   Show submodule status
  init     Initialize submodules
  update   Update submodules to latest commit

OPTIONS:
  --init
    Initialize submodules
  --recursive
    Recursively initialize submodules

EXAMPLES:
  git submodule add https://github.com/user/lib.git libs/lib
  git submodule init                              # Initialize after clone
  git submodule update                             # Update to latest
  git submodule update --init --recursive         # Init and update recursively
  git submodule status                            # Show submodule status`
    },
    tag: {
      title: 'git tag',
      content: `Create, list, delete or verify a tag object.

SYNTAX:
  git tag [-a | -s | -u <keyid>] [-f] [-m <msg> | -F <file>] <tagname> [<commit>]
  git tag -d <tagname>...
  git tag [-n[<num>]] -l [<pattern>]
  git tag -v <tagname>...

DESCRIPTION:
  Creates tags to mark specific points in history, typically for releases.

OPTIONS:
  -a, --annotated
    Create an annotated tag
  -m, --message <msg>
    Tag message
  -d, --delete
    Delete a tag
  -l, --list
    List tags matching pattern
  -v, --verify
    Verify tag signature

EXAMPLES:
  git tag v1.0
  git tag -a v1.0 -m "Release version 1.0"
  git tag -l "v1.*"
  git tag -d v1.0
  git tag -v v1.0`
    },
    worktree: {
      title: 'git worktree',
      content: `Manage multiple working trees attached to the same repository.

SYNTAX:
  git worktree add [<options>] <path> [<branch>]
  git worktree list [<options>]
  git worktree remove [<options>] <worktree>
  git worktree prune [<options>]

DESCRIPTION:
  Allows you to check out multiple branches simultaneously in separate directories.

IMPORTANT NOTES:
  - Worktrees allow working on MULTIPLE branches simultaneously
  - Each worktree is a separate working directory for the same repository
  - Cannot have multiple worktrees for the SAME branch
  - Useful for testing different branches without switching
  - All worktrees share the same .git repository

OPTIONS:
  add <path> [<branch>]
    Create a new worktree
  list
    List all worktrees
  remove <worktree>
    Remove a worktree
  prune
    Prune stale worktree information

EXAMPLES:
  git worktree add ../feature feature-branch  # Create worktree for feature branch
  git worktree list                            # List all worktrees
  git worktree remove ../feature               # Remove worktree
  git worktree prune                           # Clean up stale worktrees`
    }
  };

  // Filter commands based on search query
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) {
      return Object.keys(gitCommands);
    }
    
    const query = searchQuery.toLowerCase().trim();
    return Object.keys(gitCommands).filter((key) => {
      const command = gitCommands[key];
      const title = command.title.toLowerCase();
      const content = command.content.toLowerCase();
      
      // Check if search matches title or content
      return title.includes(query) || content.includes(query);
    });
  }, [searchQuery]);

  // Auto-select first match when searching (only if current selection is not in filtered results)
  useEffect(() => {
    if (searchQuery.trim() && filteredCommands.length > 0) {
      // If current selection is still in filtered results, keep it
      if (filteredCommands.includes(selectedCommand)) {
        return;
      }
      // Otherwise, select the first match
      setSelectedCommand(filteredCommands[0]);
    }
  }, [searchQuery, filteredCommands]);

  // Highlight matching text in command title
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="docs-search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="docs-container">
      {/* Sidebar */}
      <div className="docs-sidebar">
        <h3 className="docs-sidebar-title">Commands</h3>
        <div className="docs-search-container">
          <input
            type="text"
            placeholder="Search commands (e.g., git commit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="docs-search-input"
          />
        </div>
        <div className="docs-sidebar-commands">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCommand(key)}
                className={`docs-command-button ${
                  selectedCommand === key
                    ? 'docs-command-button-active'
                    : ''
                }`}
              >
                {highlightText(gitCommands[key].title, searchQuery)}
              </button>
            ))
          ) : (
            <div className="docs-no-results">
              No commands found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="docs-content">
        {gitCommands[selectedCommand] ? (
          <>
            <h2 className="docs-content-title">{gitCommands[selectedCommand].title}</h2>
            <div className="docs-content-wrapper">
              <pre className="docs-content-text">
                {gitCommands[selectedCommand].content}
              </pre>
            </div>
          </>
        ) : (
          <div className="docs-content-wrapper">
            <p className="docs-no-results">Select a command to view its documentation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationContent;
