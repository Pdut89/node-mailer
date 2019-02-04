const env = process.env.NODE_ENV
const config = require('./config.json')

if (config) {
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
}
