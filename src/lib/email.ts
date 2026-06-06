import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key from environment
const initializeSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    console.warn('⚠️  SendGrid API key not configured. Email notifications disabled.')
    return null
  }
  sgMail.setApiKey(apiKey)
  return sgMail
}

interface OrderEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  orderId: string
  product: string
  quantity: string
  details: string
  estimatedTurnaround: string
  designFileName?: string
  designFileUrl?: string
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    const client = initializeSendGrid()
    if (!client) {
      console.log('📧 Email service not configured. Skipping notification.')
      return { success: false, reason: 'Email service not configured' }
    }

    const customerEmail = `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 40px 0;">
                <h1 style="color: #000; margin: 0; font-size: 28px;">Order Received! 🎉</h1>
                <p style="color: #666; margin: 10px 0 30px; font-size: 16px;">
                  We've received your order and we're excited to get started.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background: #f9fafb; border-radius: 8px; padding: 24px;">
                <p style="color: #666; margin: 0 0 16px;">
                  <strong>Order ID:</strong> <span style="font-family: monospace; color: #185fa5;">#${data.orderId}</span>
                </p>
                <p style="color: #666; margin: 0 0 16px;">
                  <strong>Product:</strong> ${data.product} (Qty: ${data.quantity})
                </p>
                <p style="color: #666; margin: 0 0 16px;">
                  <strong>Details:</strong> ${data.details || 'N/A'}
                </p>
                ${
                  data.designFileName
                    ? `<p style="color: #666; margin: 0 0 16px;">
                        <strong>Design file:</strong> ${data.designFileName}
                      </p>`
                    : ''
                }
                <p style="color: #666; margin: 0;">
                  <strong>Expected Turnaround:</strong> ${data.estimatedTurnaround}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 0;">
                <h3 style="color: #000; margin: 0 0 15px;">What happens next?</h3>
                <ol style="color: #666; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">We'll review your order details</li>
                  <li style="margin-bottom: 10px;">
                    <strong>We'll call you within 2-4 hours</strong> at <strong>${data.customerPhone}</strong> to confirm design, colors, and specifications
                  </li>
                  <li style="margin-bottom: 10px;">Once confirmed, we'll start printing</li>
                  <li style="margin-bottom: 10px;">Quality check and preparation for pickup</li>
                  <li>We'll notify you when it's ready!</li>
                </ol>
              </td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #e5e7eb; padding: 30px 0; text-align: center;">
                <p style="color: #666; margin: 0 0 15px; font-size: 14px;">
                  <strong>Have questions?</strong>
                </p>
                <p style="color: #999; margin: 0; font-size: 13px;">
                  📞 Call: +977-9769499307<br/>
                  📧 Email: gandakigraphicshome@gmail.com<br/>
                  💬 WhatsApp: Chat with us directly
                </p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2026 Gandaki Graphics. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const adminEmail = `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 20px 0; background: #185fa5; color: white; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0; font-size: 24px;">📋 New Order Received</h2>
              </td>
            </tr>
            <tr>
              <td style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Order ID:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><span style="font-family: monospace; background: #185fa5; color: white; padding: 4px 8px; border-radius: 4px;">#${data.orderId}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Customer:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${data.customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Phone:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><a href="tel:${data.customerPhone}" style="color: #185fa5;">${data.customerPhone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Email:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><a href="mailto:${data.customerEmail}" style="color: #185fa5;">${data.customerEmail}</a></td>
                  </tr>
                  <tr style="border-top: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;"><strong style="color: #666;">Product:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${data.product}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Quantity:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${data.quantity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Details:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${data.details || 'N/A'}</td>
                  </tr>
                  ${
                    data.designFileName
                      ? `<tr>
                          <td style="padding: 10px 0;"><strong style="color: #666;">Design file:</strong></td>
                          <td style="text-align: right; padding: 10px 0;">
                            ${data.designFileUrl ? `<a href="${data.designFileUrl}" style="color: #185fa5;">${data.designFileName}</a>` : data.designFileName}
                          </td>
                        </tr>`
                      : ''
                  }
                </table>
                <p style="color: #666; margin: 20px 0 0; text-align: center; font-size: 14px;">
                  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin" style="color: #185fa5; text-decoration: none; font-weight: 600;">
                    → View in Admin Dashboard
                  </a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    // Send to customer
    await client.send({
      to: data.customerEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'gandakigraphicshome@gmail.com',
      subject: `Order Received! Your Order #${data.orderId}`,
      html: customerEmail,
    })

    // Send to admin
    const adminEmailAddress = process.env.ADMIN_EMAIL || 'gandakigraphicshome@gmail.com'
    if (adminEmailAddress) {
      await client.send({
        to: adminEmailAddress,
        from: process.env.SENDGRID_FROM_EMAIL || 'gandakigraphicshome@gmail.com',
        subject: `📋 New Order #${data.orderId} from ${data.customerName}`,
        html: adminEmail,
      })
    }

    console.log(`✅ Order confirmation emails sent for order #${data.orderId}`)
    return { success: true, orderId: data.orderId }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export default { sendOrderConfirmation }
