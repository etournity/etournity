'use strict'
const config = require('conventional-changelog-conventionalcommits')

module.exports = config({
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'docs', section: 'Documentation' },
    { type: 'infra', section: 'Infrastructure Changes' },
    { type: 'chore', hidden: true },
    { type: 'style', hidden: true },
    { type: 'refactor', hidden: true },
    { type: 'test', hidden: true },
  ],
})
