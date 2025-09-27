const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = 3001

// Get the actual network IP
const os = require('os')
const networkInterfaces = os.networkInterfaces()
let networkIP = 'localhost'

for (const interfaceName in networkInterfaces) {
  const addresses = networkInterfaces[interfaceName]
  for (const address of addresses) {
    if (address.family === 'IPv4' && !address.internal && address.address.startsWith('192.168.')) {
      networkIP = address.address
      break
    }
  }
}

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, hostname, () => {
      console.log(`
🚀 Snap2Slides Network Server Ready!
  
📍 Local Access:     http://localhost:${port}
🌐 Network Access:   http://${networkIP}:${port}

🔧 Development Features:
  • Performance Monitor (📊 button)
  • System Dashboard (SYS button) 
  • Mobile-responsive design
  • Real-time optimization monitoring

📱 Test on mobile devices using: http://${networkIP}:${port}
      `)
    })
})