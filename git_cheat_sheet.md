# Git Cheat Sheet
*Essential commands for everyday version control*

## Setup & Init
| Command | Description |
| :--- | :--- |
| `git init` | Initialize a new local repository |
| `git clone <url>` | Clone a remote repository locally |
| `git config --global user.name "Name"` | Set global username |
| `git config --global user.email "email"` | Set global email address |

## Staging & Snapshots
| Command | Description |
| :--- | :--- |
| `git status` | Show working tree status |
| `git add <file>` | Stage a specific file |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Commit staged changes with a message |
| `git commit --amend` | Edit the last commit message or content |

## Branching
| Command | Description |
| :--- | :--- |
| `git branch` | List all local branches |
| `git branch <name>` | Create a new branch |
| `git switch <name>` | Switch to a branch |
| `git switch -c <name>` | Create and switch to a new branch |
| `git branch -d <name>` | Delete a merged branch |
| `git branch -D <name>` | Force delete a branch |

## Merging & Rebasing
| Command | Description |
| :--- | :--- |
| `git merge <branch>` | Merge a branch into current branch |
| `git rebase <branch>` | Reapply commits on top of another branch |
| `git rebase -i HEAD~N` | Interactively rebase last N commits |
| `git cherry-pick <hash>` | Apply a specific commit onto current branch |

## Remote
| Command | Description |
| :--- | :--- |
| `git remote -v` | List remote connections |
| `git remote add origin <url>` | Add a remote named origin |
| `git fetch` | Download changes without merging |
| `git pull` | Fetch and merge from remote |
| `git push origin <branch>` | Push branch to remote |
| `git push --force-with-lease` | Safely force push (won't overwrite others' work) |

## Inspect & Log
| Command | Description |
| :--- | :--- |
| `git log --oneline` | Compact commit history |
| `git log --graph --oneline` | Visualize branch history as a graph |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git show <hash>` | Show details of a specific commit |

## Undoing Changes
| Command | Description |
| :--- | :--- |
| `git restore <file>` | Discard unstaged changes to a file |
| `git restore --staged <file>` | Unstage a file (keep changes) |
| `git revert <hash>` | Create a new commit that undoes a commit |
| `git reset --soft HEAD~1` | Undo last commit, keep changes staged |
| `git reset --hard HEAD~1` | Undo last commit and discard all changes |

## Stashing
| Command | Description |
| :--- | :--- |
| `git stash` | Stash current uncommitted changes |
| `git stash pop` | Apply and remove the latest stash |
| `git stash list` | List all stashes |
| `git stash apply stash@{N}` | Apply a specific stash without removing it |
| `git stash drop stash@{N}` | Delete a specific stash |

## Tags
| Command | Description |
| :--- | :--- |
| `git tag` | List all tags |
| `git tag <name>` | Create a lightweight tag |
| `git tag -a <name> -m "msg"` | Create an annotated tag with message |
| `git push origin <tag>` | Push a specific tag to remote |
| `git push origin --tags` | Push all tags to remote |
