export const executeGitCommand = (cmd, state, rebaseTodoState = null, conflictResolvedText = null) => {
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
