import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendMagicLink(email: string, token: string) {
  const magicLink = process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/verify?token=' + token

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Magic Link to Photo Booth Admin',
    html: 'Click <a href="' + magicLink + '">here</a> to log in to your Photo Booth Admin dashboard.',
  })
}

export async function sendSubmissionNotification(
  attendantEmail: string,
  clientName: string,
  clientEmail: string,
  eventDate: string,
  backdropName: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: attendantEmail,
    subject: 'New Backdrop Selection from ' + clientName,
    html: 'A new backdrop selection has been made: Client Name: ' + clientName + ', Client Email: ' + clientEmail + ', Event Date: ' + eventDate + ', Selected Backdrop: ' + backdropName,
  })
}

export async function sendClientConfirmation(
  clientEmail: string,
  clientName: string,
  eventDate: string,
  backdropName: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: clientEmail,
    subject: 'Your Photo Booth Backdrop Selection Confirmation',
    html: 'Dear ' + clientName + ', Thank you for your backdrop selection! Event Date: ' + eventDate + ', Selected Backdrop: ' + backdropName + '. We look forward to your event!',
  })
}
