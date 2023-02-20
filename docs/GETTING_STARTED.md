# Getting Started

## System Reqirements

Please ensure you have all of these installed before proceeding:

- [node.js >=12.10](https://nodejs.org/en/download/current/)
- node.js c++ Build Tools\
  windows: `npm install --global windows-build-tools`\
  linux/macOS: `python2.7`, `gcc`, `make`
- [yarn >=1.17](https://classic.yarnpkg.com/en/docs/install)
- [react-developer-tools (optional)](https://reactjs.org/blog/2015/09/02/new-react-developer-tools.html#installation)
- [docker](https://docs.docker.com/engine/installation/#supported-platforms)
- [docker-compose](https://docs.docker.com/compose/install/)

## Structure

First of all, we want to give a short overview of how this Repo is structured:

etournity is managed as a monorepo that is composed of many npm packages:
(more info about [lerna](https://github.com/lerna/lerna))

<big><pre>
**etournity**
├── [docs](./) _# Documentation_
├── [packages](../packages/)
│ ├── [client](../packages/client/) _# react web app_
│ └── [server](../packages/server/) _# graphql server_
└── [scripts](../scripts/) _# build or deployment scripts_</big></pre>

## Setup

First of all, clone this repository:

```bash
$ git clone https://github.com/JulianKarhof/etournity.git && cd etournity
```

Before jumping into the code, there are a couple of thigs we need to ensure:

- Run `$ yarn` in the root folder

  > This will install all required npm dependencies locally. Every time new dependencies are introduced, this will have to be run again.

- Run `$ yarn generate` in the root folder
  > This will generate all of the necessary graphql/prisma code and will have to be run again each time the prisma schema is updated

---

**NOTE:** For convenience, we've created a setup script (`$ yarn setup`) which combines these two together for when you e.g. pull the latest changes from github.

---

- Have a Postgresql database running

  > For convenience, we provide a docker-compose script to run postgres. To start it, run\
  > `$ yarn postgres` or `$ yarn postgres:background`.\
  > To stop an instance running in the background, use `$ yarn postgres:stop-background`.\
  > To reset the database, run `$ yarn postgres:down`.\
  > Note: also includes a database explorer located at `http://localhost:5050/`

- Apply the latest database migrations

  > In development mode, this happens automatically.
  > The only thing to remember is that - after you change the database schema, `$ yarn migrate:save` has to be run to create a new migration file.
  > NOTE: there should only be one migration per Pull-Request max.

- Ensure all environment variables are defined
  > In `packages/server` and `packages/client`, copy the `.env.example` files to `.env`. The default values should `just work™`

Now the fun can finally begin!\
Fire up your favourite terminal emulator, run `$ yarn dev` and everything should be up and runing perfectly.
