import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
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
  
  console.log('Sending magic link to:', email)
  console.log('Magic link URL:', magicLink)
  console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Magic Link to Photo Booth Admin',
    html: '<p>Click <a href="' + magicLink + '">here</a> to log in.</p><p>Or copy this link: ' + magicLink + '</p>',
  }
  await transporter.sendMail(mailOptions)
  
  console.log('Magic link email sent successfully to:', email)
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
    html: 'New selection: ' + clientName + ', ' + clientEmail + ', ' + eventDate + ', ' + backdropName,
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
    subject: 'Your Backdrop Selection Confirmation',
    html: 'Dear ' + clientName + ', Your selection: ' + eventDate + ', ' + backdropName,
  })
}