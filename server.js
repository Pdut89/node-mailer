require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer')
const Email = require('email-templates')
const morgan = require('morgan')
const helmet = require('helmet')

const { PORT, MAIL_USER, MAIL_PASS } = process.env

const app = express()

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(helmet())


// Config Mailers
const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
  }
})

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
})

app.post('/send', function (req, res) {
  const { name, surname, phoneNumber, emailAddress, subject, message } = req.body

  const emailOptions = {
    template: 'websiteEmail',
    message: {
      from: 'no-reply@virtuegroup.co.za <pdut8901@gmail.com>',
      to: 'pdut8901@gmail.com',
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
  console.log('Server is running at port: ',PORT)
})
