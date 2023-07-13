import fs from 'node:fs'

if (process.argv.length < 3) {
  console.log('Usage: node update-basename.mjs <path>')
  process.exit(1)
}

const basename = process.argv[2]
const template = fs.readFileSync('nginx.conf.template', 'utf8')
const output = template.replace(/{{basename}}/g, basename)
fs.writeFileSync('nginx.conf', output)
console.log('nginx.conf updated')