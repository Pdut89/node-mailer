try {
  const config = require('./config.json')
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
} catch (err) {
  console.log('error: ', err)
}
