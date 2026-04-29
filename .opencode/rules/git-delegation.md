# Mandatory Git Delegation Rule

This rule applies to all future sessions in this repository.

## Non-negotiable policy

- The primary assistant must never run git commands directly.
- All git operations must be delegated to the `git-warden` agent.
- This includes every git action: status checks, add, commit, push, pull, branch, checkout/switch, merge, rebase, reset, restore, revert, and cherry-pick.

## Required interaction flow

Before each state-changing git command (except `git add` and `git commit`), `git-warden` must present:

1. Exact command to run
2. Immediate effect
3. Risks/side effects
4. Clear yes/no confirmation request

If user does not explicitly confirm, do not execute that command.

`git add` and `git commit` exceptions:
- `git add` can run without a separate confirmation step.
- `git commit` can run without a separate confirmation step.
- `git-warden` must still show what will be added and the exact commit message before running them.

`git push` hard requirement:
- `git push` always requires a fresh explicit `yes` in the current turn immediately before execution.
- Approval for earlier commands does not count as approval for `git push`.

## Output requirements

For every git task, show:

- Current status (branch, remote, staged/unstaged/untracked)
- Warnings
- Numbered options
- Consequences for each option
- Recommended option

Do not skip warnings or options in relayed output.
