var buffer = {}
var flush = {}
var lastWrite = {}
var now = {}
const fiveMb = 1024 * 1024 * 5
const fiveMin = 300 * 1000
process.on('exit', () => {
  for (namespace in buffer) flush[namespace]()
})
function fiveM (namespace, write) {
  buffer[namespace] = ''
  lastWrite[namespace] = new Date()
  flush[namespace] = () => {
      write(buffer[namespace])
      delete buffer[namespace]
      lastWrite[namespace] = new Date()
  }
  return function logger (data) {
    now[namespace] = new Date()
    buffer[namespace] += data
    const thereIsSomeData = buffer[namespace].length > 0
    const exceededSpace = (buffer[namespace].length > fiveMb)
    const exceededTime = (fiveMin < now[namespace] - lastWrite[namespace])
    if (thereIsSomeData && (exceededSpace || exceededTime)) {
      flush[namespace]()
    }
  }
}
module.exports = fiveM
