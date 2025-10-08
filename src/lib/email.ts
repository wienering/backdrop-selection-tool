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
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Your Magic Link to Photo Booth Admin',
    html: '<p>Click <a href="' + magicLink + '">here</a> to log in to your Photo Booth Admin dashboard.</p>',
  }
  await transporter.sendMail(mailOptions)
}

export async function sendSubmissionNotification(
  attendantEmail: string,
  clientName: string,
  clientEmail: string,
  eventDate: string,
  backdropName: string
) {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: attendantEmail,
    subject: `New Backdrop Selection - ${clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Backdrop Selection Received</h2>
        <p>A client has selected a backdrop for their event:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Client Details</h3>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Event Date:</strong> ${formattedDate}</p>
          <p><strong>Selected Backdrop:</strong> ${backdropName}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          This selection was made through your Photo Booth Backdrop Selection Tool.
        </p>
      </div>
    `,
  })
}

export async function sendClientConfirmation(
  clientEmail: string,
  clientName: string,
  eventDate: string,
  backdropName: string
) {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: clientEmail,
    subject: 'Your Backdrop Selection Confirmation - Photobooth Guys',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Backdrop Selection Confirmed!</h2>
        <p>Dear ${clientName},</p>
        
        <p>Thank you for selecting your backdrop! We've received your choice and are excited to help make your event special.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #1f2937;">Your Selection Details</h3>
          <p><strong>Event Date:</strong> ${formattedDate}</p>
          <p><strong>Selected Backdrop:</strong> ${backdropName}</p>
        </div>
        
        <p>We'll be in touch closer to your event date with any additional details. If you have any questions or need to make changes, please don't hesitate to contact us.</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          The Photobooth Guys Team
        </p>
      </div>
    `,
  })
}