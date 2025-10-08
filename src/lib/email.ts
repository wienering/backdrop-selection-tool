import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendMagicLink(email: string, token: string) {
  const magicLink = ${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Magic Link to Photo Booth Admin',
    html: <p>Click <a href="">here</a> to log in to your Photo Booth Admin dashboard.</p>,
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
    subject: New Backdrop Selection from ,
    html: 
      <p>A new backdrop selection has been made:</p>
      <ul>
        <li>Client Name: </li>
        <li>Client Email: </li>
        <li>Event Date: </li>
        <li>Selected Backdrop: </li>
      </ul>
    ,
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
    subject: Your Photo Booth Backdrop Selection Confirmation,
    html: 
      <p>Dear ,</p>
      <p>Thank you for your backdrop selection!</p>
      <p>Here are the details:</p>
      <ul>
        <li>Event Date: </li>
        <li>Selected Backdrop: </li>
      </ul>
      <p>We look forward to your event!</p>
    ,
  })
}
