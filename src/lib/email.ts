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

const RESEND_API_URL = 'https://api.resend.com/emails'

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    console.warn('⚠️  Resend is not configured. Email notifications disabled.')
    return null
  }

  return { apiKey, fromEmail }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendResendEmail({
  apiKey,
  fromEmail,
  to,
  subject,
  html,
}: {
  apiKey: string
  fromEmail: string
  to: string
  subject: string
  html: string
}) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Resend request failed (${response.status}): ${details}`)
  }

  return response.json()
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    const config = getResendConfig()
    if (!config) {
      console.log('📧 Email service not configured. Skipping notification.')
      return { success: false, reason: 'Email service not configured' }
    }

    const safeCustomerName = escapeHtml(data.customerName)
    const safeOrderId = escapeHtml(data.orderId)
    const safeProduct = escapeHtml(data.product)
    const safeQuantity = escapeHtml(data.quantity)
    const safeDetails = escapeHtml(data.details || 'N/A')
    const safePhone = escapeHtml(data.customerPhone)
    const safeEmail = escapeHtml(data.customerEmail)
    const safeTurnaround = escapeHtml(data.estimatedTurnaround)
    const safeDesignFileName = data.designFileName ? escapeHtml(data.designFileName) : null
    const safeDesignFileUrl = data.designFileUrl ? escapeHtml(data.designFileUrl) : null
    const adminEmailAddress = process.env.ADMIN_EMAIL || process.env.RESEND_TO_EMAIL || data.customerEmail

    const customerEmailHtml = `
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
                  <strong>Order code:</strong> <span style="font-family: monospace; color: #185fa5;">${safeOrderId}</span>
                </p>
                <p style="color: #666; margin: 0 0 16px;">
                  <strong>Product:</strong> ${safeProduct} (Qty: ${safeQuantity})
                </p>
                <p style="color: #666; margin: 0 0 16px;">
                  <strong>Details:</strong> ${safeDetails}
                </p>
                ${
                  safeDesignFileName
                    ? `<p style="color: #666; margin: 0 0 16px;">
                        <strong>Design file:</strong> ${
                          safeDesignFileUrl
                            ? `<a href="${safeDesignFileUrl}" style="color: #185fa5;">${safeDesignFileName}</a>`
                            : safeDesignFileName
                        }
                      </p>`
                    : ''
                }
                <p style="color: #666; margin: 0;">
                  <strong>Expected Turnaround:</strong> ${safeTurnaround}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 0;">
                <h3 style="color: #000; margin: 0 0 15px;">What happens next?</h3>
                <ol style="color: #666; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 10px;">We'll review your order details</li>
                  <li style="margin-bottom: 10px;">
                    <strong>We'll call you within 2-4 hours</strong> at <strong>${safePhone}</strong> to confirm design, colors, and specifications
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

    const adminEmailHtml = `
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
                    <td style="padding: 10px 0;"><strong style="color: #666;">Order code:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><span style="font-family: monospace; background: #185fa5; color: white; padding: 4px 8px; border-radius: 4px;">${safeOrderId}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Customer:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${safeCustomerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Phone:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><a href="tel:${safePhone}" style="color: #185fa5;">${safePhone}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Email:</strong></td>
                    <td style="text-align: right; padding: 10px 0;"><a href="mailto:${safeEmail}" style="color: #185fa5;">${safeEmail}</a></td>
                  </tr>
                  <tr style="border-top: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;"><strong style="color: #666;">Product:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${safeProduct}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Quantity:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${safeQuantity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;"><strong style="color: #666;">Details:</strong></td>
                    <td style="text-align: right; padding: 10px 0;">${safeDetails}</td>
                  </tr>
                  ${
                    safeDesignFileName
                      ? `<tr>
                          <td style="padding: 10px 0;"><strong style="color: #666;">Design file:</strong></td>
                          <td style="text-align: right; padding: 10px 0;">
                            ${
                              safeDesignFileUrl
                                ? `<a href="${safeDesignFileUrl}" style="color: #185fa5;">${safeDesignFileName}</a>`
                                : safeDesignFileName
                            }
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

    await sendResendEmail({
      apiKey: config.apiKey,
      fromEmail: config.fromEmail,
      to: data.customerEmail,
      subject: `Order Received! Your Order Code ${data.orderId}`,
      html: customerEmailHtml,
    })

    if (adminEmailAddress) {
      await sendResendEmail({
        apiKey: config.apiKey,
        fromEmail: config.fromEmail,
        to: adminEmailAddress,
        subject: `New Order ${data.orderId} from ${data.customerName}`,
        html: adminEmailHtml,
      })
    }

    console.log(`✅ Order confirmation emails sent for order ${data.orderId}`)
    return { success: true, orderId: data.orderId }
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export default { sendOrderConfirmation }
