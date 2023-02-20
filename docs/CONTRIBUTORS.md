# Contributors

You can get an overview of the different contributors from [github](../../graphs/contributors). In the following document, we want to give more in depth overview about who contributed what parts of the codebase:

**_NOTE:_** **This document is still a work in progress, feel free to add more information about your contributions to this project! This can also include small tasks specific to a university module.**

- **Julian Karhof** [@JulianKarhof](https://github.com/JulianKarhof)

  - [Continous Integration & Deployment](https://github.com/JulianKarhof/etournity/commit/f38ff98cdc07284a882077877dcbf04e558efdad)
  - [Initial Project Setup](https://github.com/JulianKarhof/etournity/pull/1)
  - [Chromatic Storybook Deploy Setup](https://github.com/JulianKarhof/etournity/commit/1d7b88c3890ac2157d93d93142bd1d46319bfe09)
  - [Websocket/GraphQL Subscription Setup](https://github.com/JulianKarhof/etournity/commit/20607c6635bd718ad43d871eb3df811317ea5ba6)
  - [Backend Model File Structure Generation](https://github.com/JulianKarhof/etournity/commit/53d86ab4e94d59a032edcfc2739d8419c4060179)
  - GraphQL API changes
  - UI Components and Layout
    - [Input](https://github.com/JulianKarhof/etournity/commit/5bb2463d763f57b7b6d11f6d1e70dd116ea95e83)
    - [TextArea](https://github.com/JulianKarhof/etournity/commit/738f662fedb73235f8601bc39b3447a494c777c3)
    - [Dropdown](https://github.com/JulianKarhof/etournity/commit/1d7b88c3890ac2157d93d93142bd1d46319bfe09)
    - [TournamentListTile](https://github.com/JulianKarhof/etournity/commit/95d134fe41522333befc4ec82fe7494d5094a10a)
    - [TicketCreateForm](https://github.com/JulianKarhof/etournity/pull/350)
    - CheckinRegistrationCard
    - BracketView

- **Felix Luplow** [@FLuplow](https://github.com/FLuplow)

  - [Initial Project Setup](https://github.com/JulianKarhof/etournity/pull/1)
  - [Initial Storybook Setup](https://github.com/JulianKarhof/etournity/pull/62)
  - [Icon Library](https://github.com/JulianKarhof/etournity/pull/169)
  - GraphQL API changes
  - UI Components and Layout
    - [Button](https://github.com/JulianKarhof/etournity/pull/165)
    - Icon
    - [Loader](https://github.com/JulianKarhof/etournity/pull/211)
    - [Progress](https://github.com/JulianKarhof/etournity/pull/246)
    - [Countdown](https://github.com/JulianKarhof/etournity/pull/260)
    - [Tooltip](https://github.com/JulianKarhof/etournity/pull/220)
    - ShortcutBar
    - [Modal](https://github.com/JulianKarhof/etournity/pull/188)
  - Matchlobby Feature
  - CSS/SASS Variables

- **Luca Brües** [@lucanr1](https://github.com/lucanr1)

  - [Homepage](https://github.com/JulianKarhof/etournity/pull/333/commits/fcb6b47219247659971395e7c73282ed292255fe)
  - UI Components and Layout
    - [Empty](https://github.com/JulianKarhof/etournity/commit/87a49cc2f220740c09914aa3a3539fee727f9ad0)
    - [Avatar](https://github.com/JulianKarhof/etournity/commit/23dabd19f6f262b672f3ed23755f5f328359b742)
    - [Tournament Card](https://github.com/JulianKarhof/etournity/commit/332a096f6ab1ff242607051b763e7555c674c233)
    - [SearchBar](https://github.com/JulianKarhof/etournity/commit/f08e8b1e8c1752d71b659300ddd61bb38646068a)
    - [Tabs](https://github.com/JulianKarhof/etournity/commit/785aa2dd09da58a6c9286483bd0c76a73382c942)
  - Tournament Controller
    - [Tournament Controller](https://github.com/JulianKarhof/etournity/pull/368)
    - [Confirmation Modal](https://github.com/JulianKarhof/etournity/commit/e70a56a4fd860a14b8bd0af50f3d20353dfd2de3)
    - [Tournament Steps](https://github.com/JulianKarhof/etournity/commit/ac90eb8a92cc414d51db1d1bbff49ae40208e849)
    - [Add Time Component](https://github.com/JulianKarhof/etournity/pull/366)

- **Henry Gressmann** [@explodingcamera](https://github.com/explodingcamera)

  - [Testing Setup & Documentation/Guidelines](https://github.com/JulianKarhof/etournity/commit/d43ba79acb5a6766583baf343d8684bd4f91b580)
  - [Documentation Structure, Getting Started Guide](https://github.com/JulianKarhof/etournity/tree/develop/docs)
  - [Security Documentation & Future Plans](https://github.com/JulianKarhof/etournity/commit/b6811ac3ca4bbf655731e36e50b04d809543c881)
  - [Threat Model & implementing the mentioned mitigations](https://github.com/etournity/threat-model)
  - [Global State management using mobx-state-tree](https://github.com/JulianKarhof/etournity/tree/develop/packages/client/stores)
  - [Custom Role Based Access Control Implementation](https://github.com/JulianKarhof/etournity/tree/develop/packages/rbac)
  - [Hardening Docker Security](https://github.com/JulianKarhof/etournity/commits/exp/docker-image)
  - [Authentification Strategy & Implementation](https://github.com/JulianKarhof/etournity/blob/develop/packages/server/src/auth.ts)
  - [GraphQL field level authentification & rules using graphql-shield](https://github.com/JulianKarhof/etournity/blob/develop/packages/server/src/permissions/index.ts)
  - [Rate Limiting](https://github.com/JulianKarhof/etournity/blob/chore/security/packages/server/src/ratelimit.ts)
  - Limiting GraphQL Query Complexity using `graphql-query-complexity`
  - [Switching from a custom webpack setup to next.js](https://github.com/JulianKarhof/etournity/commit/41b609d0c5d029fbd4d0329983060e3e91b0e841)
  - Initial Continuous integration setup & Automated Security tests
  - Adding Security relevant headers to the client & API
  - [Contributing & Release Guidelines](https://github.com/JulianKarhof/etournity/commit/9c80fa428f092cceccc4d130021bc62be22e4da2)
