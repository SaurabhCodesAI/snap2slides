// Simple health check without interrupting the running server
const http = require('http');

async function quickHealthCheck() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'HEAD',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200 ? '✅ HEALTHY' : `⚠️ STATUS: ${res.statusCode}`);
    });
    
    req.on('error', () => resolve('❌ OFFLINE'));
    req.on('timeout', () => resolve('⏱️ TIMEOUT'));
    req.end();
  });
}

async function showLiveStatus() {
  const health = await quickHealthCheck();
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  🚀 SNAP2SLIDES LIVE STATUS - ${timestamp}                   │
├─────────────────────────────────────────────────────────────────┤
│  Server Health: ${health.padEnd(20)}                      │
│  Mobile URLs:   http://192.168.56.1:3000                      │
│                 http://192.168.1.33:3000                      │
│  Local Access:  http://localhost:3000                         │
├─────────────────────────────────────────────────────────────────┤
│  🔥 SERVER CONTINUES RUNNING IN BACKGROUND                     │
│  📱 Ready for mobile device testing!                           │
└─────────────────────────────────────────────────────────────────┘
  `);
}

showLiveStatus();