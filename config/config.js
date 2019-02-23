
try {
  const config = require('./config.json')
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
} catch (err) {
  console.log('error loading env vars: ', err)
}

// Create config.json file in the same directory.
// It stores ENV vars
// {
//   "PORT": "5000",
//   "USERNAME": "",
//   "PASSWORD": ""
// }
