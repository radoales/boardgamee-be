/* eslint-disable no-console */

import nodemailer, { Transporter } from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport/index.js'

export const sendMail = ({
  to,
  html,
  subject
}: {
  to: string
  subject: string
  html: string
}) => {
  const transporter: Transporter = nodemailer.createTransport({
    auth: {
      pass: process.env.EMAIL_PASSWORD,
      user: process.env.EMAIL_USER
    },
    service: 'gmail'
  })

  const mailOptions: MailOptions = {
    from: 'noreply.boardgamee@gmail.com',
    html,
    subject,
    to
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent:', info.response)
    }
  })
}
