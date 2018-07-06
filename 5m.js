var bucket = {}
var flush = {}
const fiveMb = 1024 * 1024 * 5
const fiveMin = 300 * 1000
const flushTimeout = process.env.FIVEM_TIMEOUT_MILLISECONDS || fiveMin
process.on('exit', () => {
  for (var namespace in bucket) flush[namespace]()
})
/**
 * **@param** `{String}` namespace
 * **@param** `{Function}` write
 *
 * **@returns** `{Function}` logger
 */
function fiveM (namespace, write) {
  flush[namespace] = () => {
    if (bucket[namespace]) {
      write(bucket[namespace])

      delete bucket[namespace]
    }
  }
  /**
   * @param {*} data
   */
  return function logger (data) {
    if (typeof bucket[namespace] === 'undefined') {
      bucket[namespace] = ''

      setTimeout(flush[namespace], flushTimeout)
    }
    bucket[namespace] += data
    const exceededSpace = bucket[namespace] && (bucket[namespace].length > 0) && (bucket[namespace].length > fiveMb)
    if (exceededSpace) flush[namespace]()
  }
}
module.exports = fiveM
