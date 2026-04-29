# Mandatory Git Delegation Rule

This rule applies to all future sessions in this repository.

## Non-negotiable policy

- The primary assistant must never run git commands directly.
- All git operations must be delegated to the `git-warden` agent.
- This includes every git action: status checks, add, commit, push, pull, branch, checkout/switch, merge, rebase, reset, restore, revert, and cherry-pick.

## Required interaction flow

Before each state-changing git command (except `git commit`), `git-warden` must present:

1. Exact command to run
2. Immediate effect
3. Risks/side effects
4. Clear yes/no confirmation request

If user does not explicitly confirm, do not execute that command.

`git commit` exception:
- `git commit` can run without a separate confirmation step.
- `git-warden` must still show the exact commit message and what is being committed before running it.

## Output requirements

For every git task, show:

- Current status (branch, remote, staged/unstaged/untracked)
- Warnings
- Numbered options
- Consequences for each option
- Recommended option

Do not skip warnings or options in relayed output.
