# Contributing

## Guidelines

Our workflow is based on [Trunk Based Development](https://trunkbaseddevelopment.com/), for more information about the how and why, check out their website.

- We have one main branch, `develop`, which is our single source of truth
- `develop` is **always** release ready
- All work happens in [short-lived feature-branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/) (short-lived = no more than 2 days)
- Branch names follow `kebab-case` and have to be prefixed with `feat/`, `refactor/`, `fix/`, `hotfix/`, or `release/`\
  Example: `feat/my-awesome-feature`
- Merge-Commits follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). See [Common Commit Types](./pull_request_template.md).
- All tests need to pass and at least 1 review is required before a Pull Request can be merged
- After a PR has been merged, the branch needs to be deleted (this happens automatically)

For more information about releases, check out [RELEASES](./RELEASES.md)
