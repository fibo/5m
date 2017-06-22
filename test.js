const print = (data) => { console.log(data) }

const log = require('5m')('test', print)
const logXmas = require('5m')('testXmas', print)
const logOnExit = require('5m')('testOnExit', print)

for (var i = 0; i < 1024 * 1024 - 1; i++) {
  log('.....') // Five chars, 1mb times = 5mb
}

log('\nwait to see a Xmas tree\n')

setTimeout(function () {
  process.exit(0)
}, process.env.FIVEM_TIMEOUT_MILLISECONDS * 2)

setTimeout(function () {
  logOnExit('if you see this message, 5m flushes on exit.')
}, process.env.FIVEM_TIMEOUT_MILLISECONDS * 1.5)

logXmas('    *     \n')
logXmas('    **    \n')
logXmas('   ****   \n')
logXmas('  ******  \n')
logXmas(' ******** \n')
logXmas('**********\n')
logXmas('    ||    \n')
