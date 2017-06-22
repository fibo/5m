var buffer = {}
var flush = {}
const fiveMb = 1024 * 1024 * 5
const fiveMin = 300 * 1000
const flushTimeout = process.env.FIVEM_TIMEOUT_MILLISECONDS || fiveMin
process.on('exit', () => {
  for (var namespace in buffer) flush[namespace]()
})
/**
 * **@param** `{String}` namespace
 * **@param** `{Function}` write
 *
 * **@returns** `{Function}` logger
 */
function fiveM (namespace, write) {
  flush[namespace] = () => {
    if (buffer[namespace]) {
      write(buffer[namespace])
      delete buffer[namespace]
    }
  }
  /**
   * @param {*} data
   */
  return function logger (data) {
    if (typeof buffer[namespace] === 'undefined') {
      buffer[namespace] = ''
      setTimeout(flush[namespace], flushTimeout)
    }
    buffer[namespace] += data
    const exceededSpace = buffer[namespace] && (buffer[namespace].length > 0) && (buffer[namespace].length > fiveMb)
    if (exceededSpace) flush[namespace]()
  }
}
module.exports = fiveM
