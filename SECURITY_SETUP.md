# 🔒 Security Setup & Anti-Spam Guide

**Quick Reference**: How to protect your website from spam & attacks

---

## 🎯 What's Protected?

Your order system now has **multi-layer security**:

### ✅ Automatically Protected Against:
- ✓ Bot spam attacks (rate limiting)
- ✓ SQL injection (Prisma ORM)
- ✓ XSS attacks (Next.js auto-escape)
- ✓ Invalid data (comprehensive validation)
- ✓ Suspicious patterns (AI detection)
- ✓ IP-based spam (tracking & flagging)
- ✓ DoS attacks (rate limiter)

---

## 🚀 Quick Start: Testing Security

### 1. Test Rate Limiting (10 orders max per 24h)
```bash
# Try submitting 11 orders from same IP
# Order 1-10: Success ✅
# Order 11: Blocked with 429 error ⚠️
```

### 2. Test Input Validation
```bash
# Try these & see what happens:
❌ Name: "" (empty)
❌ Email: "invalid-email" (no @)
❌ Phone: "123" (only 3 digits)
❌ Quantity: "0" or "50000" (out of range)
❌ Product: "Shoes" (not a valid product)

✅ All blocked automatically
```

### 3. Test Suspicious Pattern Detection
```bash
# Try these suspicious names:
❌ "click here"
❌ "buy now"
❌ "casino"
❌ "admin"

✅ Flagged & logged for your review
```

---

## 📊 Monitor Security from Admin Dashboard

### Check Suspicious Activity:
1. Go to `/admin` (login required)
2. Look for security monitoring section (coming soon)
3. See all flagged orders & IPs

### Or Use API:
```bash
curl -H "Cookie: session=YOUR_SESSION" \
  http://localhost:3000/api/admin/security/logs?limit=50
```

---

## 🔧 Configuration Options

### Rate Limit Settings
**File**: `src/app/api/orders/create/route.ts`

Current: **10 orders per IP per 24 hours**

**To change**, edit:
```typescript
const orderRateLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000,  // ← Change this (in milliseconds)
  maxRequests: 10,                 // ← Or change this (max orders)
})
```

**Examples:**
```typescript
// Stricter (for high traffic):
windowMs: 60 * 60 * 1000,    // 1 hour
maxRequests: 5,               // 5 orders max

// Looser (for low traffic):
windowMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
maxRequests: 50,                    // 50 orders max
```

---

## 📋 Validation Rules (Enforced)

| Field | Rule | Example |
|-------|------|---------|
| **Name** | 2-100 chars, no HTML | ✅ "Asha Gurung" |
| **Email** | Valid format, max 254 chars | ✅ "asha@example.com" |
| **Phone** | Exactly 10 digits | ✅ "9800000000" |
| **Product** | T-shirt, Hoodie, or Cup | ✅ "T-shirt" |
| **Quantity** | 1-10,000 units | ✅ "50" |
| **Size** | XS/S/M/L/XL/XXL/One Size | ✅ "M" |
| **Color** | Max 50 chars | ✅ "Red with blue stripes" |
| **Notes** | Max 1000 chars | ✅ Long descriptions OK |

---

## 🚨 Suspicious Pattern Detection

Automatically flagged & logged (but order still accepted):

```
⚠️  Spam emails:
   - test@, spam@, temp@, bot@
   - Example: test123@gmail.com

⚠️  Spam names:
   - "click here", "buy now", "free", "promo", "admin"

⚠️  Suspicious orders:
   - Quantity > 1000 units
   - Past deadlines
   - Spam keywords in notes: "casino", "click", "buy now"
```

**What happens?** → Logged in security logs for your review

---

## 🎯 Real-World Attack Examples

### Attack #1: 100 Spam Orders in 1 Hour
```
Attacker: Submits 100 orders rapidly
System Response:
  ✓ Orders 1-10: Created normally
  ✓ Order 11+: Rejected (Rate limit)
  ✓ IP flagged: Blocked after 5+ flags
  ✓ Logged: All attempts recorded
  ✓ You notified: Can review in admin
```

### Attack #2: SQL Injection
```
Attacker: Sends name = `'; DROP TABLE orders; --`
System Response:
  ✗ Blocked: Contains invalid characters (< > " ')
  ✓ Validation fails: Returns error
  ✓ Not stored: Database never touched
  ✓ Logged: Suspicious attempt recorded
```

### Attack #3: XSS (Cross-Site Scripting)
```
Attacker: Sends name = `<script>alert('xss')</script>`
System Response:
  ✗ Blocked: HTML characters stripped
  ✓ Safe: Script never executes
  ✓ Sanitized: Stored as plain text
  ✓ Logged: Suspicious attempt recorded
```

---

## 📊 Security Logs

### What Gets Logged?
- ✓ Rate limit violations
- ✓ Validation failures
- ✓ Suspicious patterns detected
- ✓ IP addresses
- ✓ Email addresses
- ✓ Timestamps

### Access Security Logs:
```bash
# Admin API (requires authentication)
GET /api/admin/security/logs?limit=100

# Returns:
{
  "count": 45,
  "logs": [
    {
      "timestamp": "2024-06-06T10:30:00Z",
      "type": "rate_limit",
      "ip": "192.168.1.1",
      "email": "spam@test.com",
      "reason": "Rate limit exceeded: 3600s remaining"
    },
    ...
  ]
}
```

---

## 🛡️ Additional Security Tips

### 1. Change Default Admin Password
**File**: `.env.local`
```env
ADMIN_PASSWORD="change-this-to-something-strong!"
```

### 2. Use Strong Session Secret
**File**: `.env.local`
```env
SESSION_SECRET="generate-a-random-string-here-min-32-chars"
```

### 3. Monitor Orders Regularly
- Check admin dashboard daily
- Review flagged orders manually
- Adjust rate limits if needed
- Look for patterns in spam

### 4. Keep Software Updated
```bash
npm audit        # Check for vulnerabilities
npm update       # Update packages
npm run build    # Test build still works
```

### 5. Email Notifications
Enable SendGrid to receive order alerts:
1. Create SendGrid account: https://sendgrid.com
2. Get API key
3. Add to `.env.local`:
   ```env
   SENDGRID_API_KEY="SG.xxxx..."
   ```

---

## 🚨 Emergency: Website Flooded with Spam?

### Immediate Actions:
1. **Check rate limiter** is still active
2. **Review security logs** → See pattern
3. **Identify IP range** if possible
4. **Temporarily block** that IP/range
5. **Review database** for spam orders

### Temporary Disable Orders:
Edit `src/components/OrderForm.tsx`:
```tsx
return (
  <div className="text-center p-8">
    <p>⚠️ Orders temporarily disabled for maintenance.</p>
    <p>Please contact us at gandakigraphicshome@gmail.com</p>
  </div>
)
```

### Permanent Solution:
Migrate rate limiter to Redis (handles distributed attacks)

---

## 📞 Support & Questions

**Questions about security?**
- Read `SECURITY_GUIDE.md` for detailed info
- Check `src/lib/security.ts` for implementation details
- Review `src/app/api/orders/create/route.ts` for integration

**Issues?**
- Check security logs first
- Look for IP patterns
- Test locally before deploying changes

---

## ✅ Security Checklist

Before going to production:
- [ ] Changed admin password in `.env.local`
- [ ] Generated strong SESSION_SECRET
- [ ] Configured SendGrid API key
- [ ] Tested rate limiting works
- [ ] Reviewed security logs
- [ ] Understood validation rules
- [ ] Have backup & restore plan
- [ ] Know how to access security logs
- [ ] Team trained on security

---

**Your website is now protected! 🛡️**

Rest easy knowing:
- Spam bots are blocked automatically
- SQL injection attacks prevented
- XSS attacks neutralized
- All suspicious activity logged
- You can monitor & control everything

For detailed technical info, see `SECURITY_GUIDE.md`
