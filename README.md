<div align="center">
  <br>

![GitHubBanner](/docs/GitHub-Banner.png)

Welcome to Etournity!

Etournity is the world’s most advanced (and probably only 😉) open source platform for esports tournaments. It’s built to be easily usable with no prior esports experience.

Some of our testers have called it the “start.gg killer”, but you’re welcome to try that our for yourself on\
[etournity.com](https://etournity.com)

  <a href="https://github.com/JulianKarhof/etournity/actions?query=workflow%3A%22Node.js+CI%22">
    <img src="https://github.com/JulianKarhof/etournity/workflows/Node.js%20CI/badge.svg" alt="Node.js CI">
  </a>
  
  <a href="https://github.com/JulianKarhof/etournity/actions/workflows/develop-backend-build.yaml">
    <img src="https://github.com/JulianKarhof/etournity/actions/workflows/develop-backend-build.yaml/badge.svg" alt="Backend Build">
  </a>
  
   <a href="https://app.netlify.com/sites/angry-keller-f30cb4/deploys">
    <img src="https://img.shields.io/netlify/d599abd4-97f8-45bc-96a6-5259067ba415" alt="Netlify Deploy Status">
  </a>

  <a href="https://securityheaders.com/?q=http%3A%2F%2Fetournity.app%2F&followRedirects=on">
    <img src="https://img.shields.io/security-headers?url=http%3A%2F%2Fetournity.app%2F" alt="Security Headers">
  </a>

  <a href="https://observatory.mozilla.org/analyze/etournity.app">
    <img src="https://img.shields.io/mozilla-observatory/grade/etournity.app?publish" alt="Mozilla HTTP Observatory Grade">
  </a>
  
  <img src="https://img.shields.io/badge/Powererd%20by-Electricity-brightgreen" alt="Powered by">  
    
  
</div>
<br/>

## Index

- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Testing](/docs/TESTING.md)
- [Validation](/docs/VALIDATION.md)
- [RBAC](/docs/RBAC.md)
- [License](#license)

<br/>

# Getting Started

## Requirements

Please ensure you have all of these installed before proceeding:

- [node.js >=12.10](https://nodejs.org/en/download/current/)
- node.js c++ Build Tools\
  windows: `npm install --global windows-build-tools`\
  linux/macOS: `python2.7`, `gcc`, `make`
- [yarn](https://classic.yarnpkg.com/en/docs/install)
- [docker](https://docs.docker.com/engine/installation/#supported-platforms)
- [docker-compose](https://docs.docker.com/compose/install/)
- [react-developer-tools (optional)](https://reactjs.org/blog/2015/09/02/new-react-developer-tools.html#installation)

<br/>

## Installation

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

  > To reset the database, run `yarn db:down`.

  > To reseed the database, run `yarn db:reseed`

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
- Branch names follow `kebab-case` and have to be prefixed with `feat/`, `refactor/`, `fix/`, `hotfix/`, or `release/`\
  Example: `feat/my-awesome-feature`
- Merge-Commits follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary). See [Common Commit Types](./pull_request_template.md).
- All tests need to pass and at least 1 review is required before a Pull Request can be merged
- After a PR has been merged, the branch needs to be deleted (this happens automatically)

For more information about releases, check out [RELEASES](./RELEASES.md)

<br/>

# License

Etournity is distributed under the GNU General Public License version 3 (GNU GPLv3).

In essence, the GNU GPLv3 is designed to ensure that software remains free and open-source, and that anyone can use and improve it.

See the [LICENSE](./LICENSE.md) file in the repository root for the full license.
