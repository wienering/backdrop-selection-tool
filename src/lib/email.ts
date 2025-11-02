import nodemailer from 'nodemailer'
import { formatEventDateForEmail } from './dateUtils'

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
    subject: '🔐 Your Admin Login Link - Photobooth Guys',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <!-- Header with gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #adadad 0%, #9a9a9a 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Photobooth Guys</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Backdrop Selection Admin</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome Back! 👋</h2>
                    
                    <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                      You requested access to your admin dashboard. Click the button below to securely log in:
                    </p>
                    
                    <!-- CTA Button -->
                    <table role="presentation" style="width: 100%; margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${magicLink}" style="display: inline-block; padding: 16px 40px; background-color: #F5A623; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(245, 166, 35, 0.3);">
                            🔐 Login to Admin Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      Or copy and paste this link into your browser:<br>
                      <a href="${magicLink}" style="color: #F5A623; word-break: break-all;">${magicLink}</a>
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong> This link will expire in 24 hours and can only be used once. If you didn't request this login link, please ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                      <strong>Photobooth Guys</strong>
                    </p>
                    <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 12px;">
                      <a href="mailto:info@photoboothguys.ca" style="color: #F5A623; text-decoration: none;">info@photoboothguys.ca</a>
                    </p>
                    <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 12px;">
                      <a href="tel:+16473785332" style="color: #F5A623; text-decoration: none;">(647) 378-5332</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer Text -->
              <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Photobooth Guys. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
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
  const formattedDate = formatEventDateForEmail(eventDate)

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
  const formattedDate = formatEventDateForEmail(eventDate)

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