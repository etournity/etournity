import * as shell from 'shelljs'
import * as readline from 'readline'

/**
 * This script generates a model folder with content defined by the template
 * files inside the /templates folder. %Object and %object inside the templates will
 * be replaced by the name of the model in title and lower case respectively.
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

shell.echo('enter a model name')

const basePath = 'packages/server/src/api'
const templatePath = 'scripts/templates'

const importMarker = '// IMPORT-MARKER'
const typeMarker = '// TYPE-MARKER'

rl.on('line', function (cmd) {
  const cmdUpper = cmd.charAt(0).toUpperCase() + cmd.slice(1)
  shell.mkdir(`${basePath}/${cmd}`)
  shell.ls(templatePath).forEach((file) => {
    const fileName = `${basePath}/${cmd}/${file
      .replace('_', cmd)
      .replace('.template', '')}`

    shell.cp(`${templatePath}/${file}`, fileName)

    shell.sed('-i', '%object', cmd, fileName)
    shell.sed('-i', '%Object', cmdUpper, fileName)
  })

  shell.sed(
    '-i',
    importMarker,
    `import { ${cmdUpper}Schema } from './${cmd}'\n${importMarker}`,
    `${basePath}/index.ts`
  )

  shell.sed(
    '-i',
    typeMarker,
    `...${cmdUpper}Schema,\n  ${typeMarker}`,
    `${basePath}/index.ts`
  )
})
