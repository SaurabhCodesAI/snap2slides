const os = require('os');

// Get all network IPs
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        ips.push(address.address);
      }
    }
  }
  
  return ips;
}

const networkIPs = getNetworkIPs();
const primaryIP = networkIPs.find(ip => ip.startsWith('192.168.')) || networkIPs[0];

console.log('\n🌐 Snap2Slides Network Access URLs:\n');
console.log('📱 For mobile/other devices:');
if (primaryIP) {
  console.log(`   http://${primaryIP}:3000`);
} else {
  console.log('   No network IP found - check WiFi connection');
}

console.log('\n🖥️  For local access:');
console.log('   http://localhost:3000');

if (networkIPs.length > 1) {
  console.log('\n🔄 Alternative IPs:');
  networkIPs.filter(ip => ip !== primaryIP).forEach(ip => {
    console.log(`   http://${ip}:3000`);
  });
}

console.log('\n📋 Instructions:');
console.log('1. Make sure devices are on same WiFi network');
console.log('2. Use the mobile URL on your phone/tablet');
console.log('3. If connection fails, try alternative IPs\n');