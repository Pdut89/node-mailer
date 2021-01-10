require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const nodeMailer = require('nodemailer')
const Email = require('email-templates')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const { 
  PORT = 5000, 
  USERNAME, 
  PASSWORD, 
  HOST, 
  RECIPIENT, 
  SMTP_PORT = 465 
} = process.env

const app = express()

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('tiny'))
app.use(helmet())

const transporter = nodeMailer.createTransport({
  host: HOST,
  port: SMTP_PORT,
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

const renderMessage = ({ message, email, phoneNumber }) => `
  <div>
    <p>You have received a message from ${email} </p>
    <strong>Message:</strong>
    <p>${message}</p>
    <p> <a href = "mailto:${email}">Reply to sender</a> </p>
    ${phoneNumber ? `
      <p>Sender phone number: <a href="tel:${phoneNumber}">${phoneNumber}</a> </p>
    ` : `
      <p>Sender did not include a phone number.</p>
    `}
  </div>
`

app.get('/', (req, res) => res.status(200).send(
  'Node-mailer. Nothing here. See server.js for email POST request details.'
))

app.post('/send', (req, res) => {
  const {
    name, 
    surname, 
    phoneNumber, 
    emailAddress, 
    subject, 
    message
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
    .catch(error => {
      console.log('error: ', error)
      res.status(400).send({
        error: error.toString()
      })
    })
})

app.post('/generic', async (req, res) => {
  const {
    to,
    ...rest
  } = req.body

  try {
    await transporter.sendMail({
      from: USERNAME,
      to,
      subject: 'New Web Message Received',
      html: renderMessage(rest),
    })
    res.status(200).send({
      message: 'Email sent successfully.'
    })
  } catch (error) {
    console.log('error: ', error)
    res.status(400).send({
      error: error.toString()
    })
  }
})

app.post('/remax', async (req, res) => {

  const {
    recipient: to,
    subject,
    message: text
  } = req.body

  try {
    await transporter.sendMail({
      from: USERNAME,
      to,
      subject,
      text,
    })
    res.status(200).send({
      message: 'Email sent successfully.'
    })
  } catch (error) {
    console.log('error: ', error)
    res.status(400).send({
      error: error.toString()
    })
  }
})

app.listen(PORT, () => {
  console.log('Server is running on port: ', PORT)
})
