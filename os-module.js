
const os = require('os')


//info about current user
const user = os.userInfo()
console.log(user)

//method return the systems uptime in seconds
console.log(`the sysytem uptime is ${os.uptime()} minutes `)

const currentOs = {
    name: os.type(),
    release: os.release(),
    totalMemory: os.totalmem().toPrecision(20),
    freemem: os.freemem().toFixed(8),
}
console.log(currentOs)