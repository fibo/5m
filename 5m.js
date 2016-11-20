var buffer = {}
var lastWrite = {}
var now = {}
const fiveMb = 1024 * 1024 * 5
const fiveMin = 300 * 1000
function fiveM (namespace, write) {
  buffer[namespace] = ''
  lastWrite[namespace] = new Date()
  process.on('exit', () => write(buffer[namespace]))
  return function logger (data) {
    now[namespace] = new Date()
    buffer[namespace] += data
    const thereIsSomeData = buffer[namespace].length > 0
    const exceededSpace = (buffer[namespace].length > fiveMb)
    const exceededTime = (fiveMin < now[namespace] - lastWrite[namespace])
    if (thereIsSomeData && (exceededSpace || exceededTime)) {
      write(buffer[namespace])
      delete buffer[namespace]
      lastWrite[namespace] = new Date()
    }
  }
}
module.exports = fiveM
