<div align="center">
  <br>

![GitHubBanner](/docs/GitHub-Banner.png)

Welcome to Etournity!

Etournity is the world’s most advanced (and probably only 😉) open source platform for online esports tournaments. It’s built to be easily usable with no prior esports experience.

Some of our testers have called it the “start.gg killer”, but you’re welcome to try that our for yourself on\
[etournity.com](https://etournity.com)

  <a href="https://securityheaders.com/?q=http%3A%2F%2Fetournity.com%2F&followRedirects=on">
    <img src="https://img.shields.io/security-headers?url=http%3A%2F%2Fetournity.com%2F" alt="Security Headers">
  </a>

  <a href="https://observatory.mozilla.org/analyze/etournity.com">
    <img src="https://img.shields.io/mozilla-observatory/grade/etournity.com?publish" alt="Mozilla HTTP Observatory Grade">
  </a>
  
  <img src="https://img.shields.io/badge/Powererd%20by-Electricity-brightgreen" alt="Powered by">  
    
</div>
<br/>

## Index

- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Validation](/docs/VALIDATION.md)
- [RBAC](/docs/RBAC.md)
- [License](#license)
- Package specific documentation
  - [Client](/packages/client/README.md)
  - [Server](/packages/server/README.md)

<br/>

# Getting Started

### New Feature Idea?

Look into [our Github Discussions](https://github.com/etournity/etournity/discussions/categories/ideas) to see which new features / improvements are currently on our mind. Submit your own idea if you can't find a similar one that already exists!

### Found a bug?

1. Check the Issues page for similar reports\
  a. If it was already reported: Comment\
  b. If it wasn't reported yet: [Submit a Bug issue](https://github.com/etournity/etournity/issues/new?assignees=&labels=bug&template=BUG_REPORT.yml&title=%5BBug%5D%3A+), including as many details as you can think of.
  
### Join Discord!

Talk/Chat with the community on the [Etournity Discord](https://discord.gg/ysm29w7Yxn) - we are friendly :)

<br/>

## Installation

### Requirements

Please ensure you have all of these installed before proceeding:

- [node.js >=12.10](https://nodejs.org/en/download/current/)
- node.js c++ Build Tools\
  windows: `npm install --global windows-build-tools`\
  linux/macOS: `python2.7`, `gcc`, `make`
- [yarn](https://classic.yarnpkg.com/en/docs/install)
- [docker](https://docs.docker.com/engine/installation/#supported-platforms)
- [docker-compose](https://docs.docker.com/compose/install/)
- [react-developer-tools (optional)](https://reactjs.org/blog/2015/09/02/new-react-developer-tools.html#installation)

### Local Setup

First of all, clone this repository:

```bash
git clone https://github.com/JulianKarhof/etournity.git && cd etournity
```

Before jumping into the code, there are a couple of thigs we need to ensure:

- Run `yarn` in the root folder

  > This will install all required npm dependencies locally. Every time new dependencies are introduced, this will have to be run again.

- Run `yarn generate` in the root folder
  > This will generate all of the necessary graphql/prisma code and will have to be run again each time the prisma schema is updated

---

**NOTE:** For convenience, we've created a setup script (`yarn setup`) which combines these two together for when you e.g. pull the latest changes from github.

---

- Ensure all environment variables are defined

  > In `packages/server` and `packages/client`, copy the `.env.example` files to `.env`. The default values should `just work™`

- Have a Postgresql database running

  > For convenience, we provide a docker-compose script to run a seeded postgres database. To start it, run:\
  > `yarn db` or `yarn db:bg` (background - detach from terminal)

  > To stop an instance running in the background, use `yarn db:stop-bg`.

  > To reset the database, run `yarn db:reset`.

  > To reseed the database, run `yarn db:reseed` (database is also automatically seeded on server start)

- Apply the latest database migrations

  > In development mode, this happens automatically.
  > The only thing to remember is that - after you change the database schema, `yarn migrate:save` has to be run to create a new migration file.
  > NOTE: there should only be one migration per Pull-Request max.

<br/>

Now the fun can finally begin!\
Fire up your favourite terminal emulator, run `yarn dev` and everything should be up and runing perfectly.

<br/>

# Contributing

## Guidelines

Our workflow is based on [Trunk Based Development](https://trunkbaseddevelopment.com/), for more information about the how and why, check out their website.

- We have one main branch, `main`, which is our single source of truth
- `main` is **always** release ready
- All work happens in [short-lived feature-branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/) (short-lived = no more than 2 days)
- Branch names follow `kebab-case` and have to be prefixed with `feat/`, `refactor/`, `chore/`, `fix/` or `hotfix/`\
  Example: `feat/my-awesome-feature`
- Merge-Commits follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). See [Common Commit Types](./pull_request_template.md).
- All tests need to pass and at least 1 review is required before a Pull Request can be merged
- After a PR has been merged, the branch should be deleted (this happens automatically)

<br/>

## Linting and Formatting

We are using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/) as guidelines to keep our code nice and tidy.\
We highly recommend you to set up formatting and linting in your code editor!

**Eslint** makes sure we abide by the coding conventions we set.
We are using recommended rules from eslint as well as several plugins and some of the rules are customized.\
You can find all plugins and custom rules used in `.eslintrc.js`.

**Prettier** is used to format and, as the name suggests, make the code base prettier. \
Specifications for our repository can be found in `.prettierrc`.

<br/>

# License

Etournity is distributed under the GNU General Public License version 3 (GNU GPLv3).

In essence, the GNU GPLv3 is designed to ensure that software remains free and open-source, and that anyone can use and improve it.

See the [LICENSE](./LICENSE.md) file in the repository root for the full license.
