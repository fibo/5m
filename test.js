const print = (data) => { console.log(data) }

const log = require('5m')('test', print)
const logXmas = require('5m')('testXmas', print)
const logOnExit = require('5m')('testOnExit', print)

logOnExit('if you see this message, 5m flushes on exit.')

for (var i = 0; i < 1024 * 1024 - 1; i++) {
  log('.....') // Five chars, 1mb times = 5mb
}

log('\nwait 5 minutes to see a Xmas tree\n')

setTimeout(function () {
  logOnExit('... 5 minutes')
}, 300 * 1000)

logXmas('    *     \n')
logXmas('    **    \n')
logXmas('   ****   \n')
logXmas('  ******  \n')
logXmas(' ******** \n')
logXmas('**********\n')
logXmas('    ||    \n')
