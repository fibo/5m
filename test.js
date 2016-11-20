const log = require('5m')('test', (data) => { console.log(data) })
const logXmas = require('5m')('testXmas', (data) => { console.log(data) })
const logOnExit = require('5m')('testOnExit', (data) => { console.log(data) })

logOnExit('if you see this message, 5m flushes on exit.')

for (var i = 0; i < 1024 * 1024 - 1; i++) {
  log('.....') // Five chars, 1mb times = 5mb
}

log('\nwait 5 minutes to see a Xmas tree\n')

setTimeout(function () {
  logOnExit('... 5 minutes')
}, 3000)

logXmas('    *     \n')
logXmas('    **    \n')
logXmas('   ****   \n')
logXmas('  ******  \n')
logXmas(' ******** \n')
logXmas('**********\n')
logXmas('    ||    \n')
