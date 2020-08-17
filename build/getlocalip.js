const os = require('os');

function getLocalIp() {
    let localIpAdderess;
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        interfaces[devName].forEach((item, index) => {
            if (item.family == 'IPv4' && !item.internal) {
                localIpAdderess = item.address
            }
        })
    }
    return localIpAdderess;
}
module.exports = {
    getLocalIp: getLocalIp
}
