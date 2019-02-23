require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer')
const Email = require('email-templates')
const morgan = require('morgan')
const helmet = require('helmet')

const { PORT, USERNAME, PASSWORD } = process.env

const app = express()

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(helmet())

const transporter = nodeMailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
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

app.get('/', (req, res) => res.send(
  'Node-mailer. Nothing here. See server.js for email POST request details.'
))

app.post('/send', (req, res) => {
  const {
    name, surname, phoneNumber, emailAddress, subject, message
  } = req.body

  const emailOptions = {
    template: 'websiteEmail',
    message: {
      from: USERNAME,
      to: emailAddress
    },
    locals: {
      name, surname, phoneNumber, emailAddress, subject, message
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
