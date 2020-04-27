require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer')
const Email = require('email-templates')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const { PORT, USERNAME, PASSWORD, RECIPIENT } = process.env

const app = express()

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(helmet())

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: USERNAME,
    pass: PASSWORD
  }
})

const email = new Email({
  transport: transporter,
  send: true,
  preview: false
})

app.get('/', (req, res) => res.status(200).send(
  'Node-mailer. Nothing here. See server.js for email POST request details.'
))

app.post('/send', (req, res) => {
  const {
    name, surname, phoneNumber, emailAddress, subject, message
  } = req.body

  const emailOptions = {
    template: 'website-email',
    message: {
      from: USERNAME,
      to: RECIPIENT
    },
    locals: {
      name,
      surname, 
      phoneNumber, 
      emailAddress, 
      subject, 
      message
    }
  }

  email.send(emailOptions)
    .then(() => {
      res.status(200).send({
        message: 'Email sent successfully.'
      })
    })
    .catch(err => {
      console.log('error: ', err)
      res.status(400).send({
        error: err.toString()
      })
    })
})

app.listen(PORT, function(req, res){
  console.log('Server is running on port: ', PORT)
})
