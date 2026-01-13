import React, { useState } from 'react';
import './DocumentationContent.css';

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
  -S <string>, --pickaxe-all
    Look for commits that add or remove the specified string
  --author=<pattern>
    Filter commits by author name or email
  --grep=<pattern>
    Filter commits by commit message

EXAMPLES:
  git log
  git log --oneline
  git log -5
  git log --graph --oneline --all
  git log --stat
  git log -S "return null"
  git log --author="John Doe"
  git log --author="john@example.com"
  git log --grep="bug fix"`
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

OPTIONS:
  --staged, --cached
    Show changes in staging area
  --stat
    Show statistics about changes
  -w, --ignore-all-space
    Ignore whitespace changes

EXAMPLES:
  git diff
  git diff file.txt
  git diff --staged
  git diff HEAD
  git diff main feature`
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

OPTIONS:
  --staged
    Restore the index (unstage files)
  --worktree
    Restore working tree files (default)
  --source=<tree>
    Restore from specified tree (default: HEAD)

EXAMPLES:
  git restore file.txt
  git restore --staged file.txt
  git restore --source=HEAD~1 file.txt`
    },
    revert: {
      title: 'git revert',
      content: `Revert some existing commits.

SYNTAX:
  git revert [<options>] <commit>...

DESCRIPTION:
  Creates a new commit that undoes the changes made by the specified commit(s).

OPTIONS:
  -n, --no-commit
    Don't automatically create a commit
  -m <parent-number>
    Specify the mainline parent for merge commits
  --no-edit
    Don't edit the commit message

EXAMPLES:
  git revert HEAD
  git revert abc123
  git revert -n HEAD
  git revert main..feature`
    },
    cherrypick: {
      title: 'git cherry-pick',
      content: `Apply the changes introduced by some existing commits.

SYNTAX:
  git cherry-pick [<options>] <commit>...

DESCRIPTION:
  Applies the changes from one or more commits to the current branch.

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
  git cherry-pick abc123
  git cherry-pick -n abc123
  git cherry-pick main..feature
  git cherry-pick --continue`
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
    clone: {
      title: 'git clone',
      content: `Clone a repository into a new directory.

SYNTAX:
  git clone [<options>] [--] <repo> [<directory>]

DESCRIPTION:
  Clones a repository into a newly created directory.

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

OPTIONS:
  --all
    Show all refs
  --date=<format>
    Show date in specified format
  -n, --max-count=<number>
    Limit number of entries

EXAMPLES:
  git reflog
  git reflog show HEAD
  git reflog --all
  git reflog -10
  git checkout HEAD@{2}`
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
  git worktree add ../feature feature-branch
  git worktree list
  git worktree remove ../feature
  git worktree prune`
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

COMMANDS:
  add      Add a submodule
  status   Show submodule status
  init     Initialize submodules
  update   Update submodules

OPTIONS:
  --init
    Initialize submodules
  --recursive
    Recursively initialize submodules

EXAMPLES:
  git submodule add https://github.com/user/lib.git libs/lib
  git submodule init
  git submodule update
  git submodule update --init --recursive
  git submodule status`
    },
    blame: {
      title: 'git blame',
      content: `Show what revision and author last modified each line of a file.

SYNTAX:
  git blame [<options>] [<rev-opts>] [<rev>] [--] <file>

DESCRIPTION:
  Annotates each line in the given file with information from the revision which last modified the line.

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
  git blame file.txt
  git blame -L 10,20 file.txt
  git blame -w file.txt
  git blame -M file.txt`
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
    }
  };

  return (
    <div className="docs-container">
      {/* Sidebar */}
      <div className="docs-sidebar">
        <h3 className="docs-sidebar-title">Commands</h3>
        <div className="docs-sidebar-commands">
          {Object.keys(gitCommands).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCommand(key)}
              className={`docs-command-button ${
                selectedCommand === key
                  ? 'docs-command-button-active'
                  : ''
              }`}
            >
              {gitCommands[key].title}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="docs-content">
        <h2 className="docs-content-title">{gitCommands[selectedCommand].title}</h2>
        <div className="docs-content-wrapper">
          <pre className="docs-content-text">
            {gitCommands[selectedCommand].content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DocumentationContent;
