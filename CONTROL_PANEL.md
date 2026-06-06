# 🎛️ Control Panel: Managing Spam & Security

**Your Command Center for Anti-Spam Controls**

---

## 🚨 Emergency Controls

### IMMEDIATE: Block All Orders
```typescript
// File: src/components/OrderForm.tsx
// Line 164 - Replace entire return with:

return (
  <section className="max-w-2xl mx-auto px-6 py-24 text-center">
    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <span className="text-2xl">🔒</span>
    </div>
    <h2 className="font-display text-3xl font-normal mb-3">Orders Temporarily Closed</h2>
    <p className="text-sm font-light text-gray-500 mb-6">
      We're performing maintenance. Please contact us directly.
    </p>
    <a href="mailto:gandakigraphicshome@gmail.com" className="btn-primary">
      Email us →
    </a>
  </section>
)
```
**Effect**: No new orders can be submitted

---

## 🎚️ Rate Limit Controls

### Adjust How Many Orders Are Allowed

**File**: `src/app/api/orders/create/route.ts` (line 10-13)

```typescript
// CURRENT (Default)
const orderRateLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000,  // 24 hours
  maxRequests: 10,                 // 10 orders max
})

// ↓ CHANGE TO: ↓

// FOR STRICT MODE (prevent spam)
const orderRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,        // 1 hour
  maxRequests: 3,                  // Only 3 orders/hour
})

// FOR LOOSE MODE (trusted period)
const orderRateLimiter = createRateLimiter({
  windowMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
  maxRequests: 100,                    // 100 orders/week
})

// FOR PROMOTION (temporary)
const orderRateLimiter = createRateLimiter({
  windowMs: 30 * 24 * 60 * 60 * 1000,  // 30 days
  maxRequests: 1000,                    // Unlimited basically
})
```

---

## 🔍 Monitor Activity in Real-Time

### Check Security Logs (Admin Only)

**Option 1: Using curl**
```bash
# Get last 50 suspicious activities
curl -H "Cookie: session=YOUR_SESSION_COOKIE" \
  "http://localhost:3000/api/admin/security/logs?limit=50"
```

**Option 2: Using browser console**
```javascript
fetch('/api/admin/security/logs?limit=100', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.table(data.logs))
```

**Response example:**
```json
{
  "count": 3,
  "logs": [
    {
      "timestamp": "2024-06-06T10:35:22.123Z",
      "type": "rate_limit",
      "ip": "192.168.1.1",
      "email": "spam@test.com",
      "reason": "Rate limit exceeded: 3600s remaining"
    },
    {
      "timestamp": "2024-06-06T10:33:15.456Z",
      "type": "suspicious_pattern",
      "ip": "192.168.1.2",
      "email": "admin@test.com",
      "reason": "Suspicious patterns detected: Suspicious name pattern"
    }
  ]
}
```

---

## 🛑 Block Specific IPs

### Temporary Block (Code Changes)

**File**: `src/lib/security.ts` (add near top)

```typescript
// Manually blocked IPs
const BLOCKED_IPS = new Set([
  '192.168.1.1',
  '10.0.0.1',
  // Add more IPs as needed
])

// Update isIPFlagged() function:
export function isIPFlagged(ip: string): boolean {
  if (BLOCKED_IPS.has(ip)) return true  // ← Add this line
  
  const recentAttempts = activityLogs.filter(...)
  return recentAttempts.length > 5
}
```

---

## 📊 View Real-Time Stats

### Create a monitoring script:

**File**: `scripts/monitor-security.js`

```javascript
const fs = require('fs')
const path = require('path')

async function monitorSecurity() {
  const response = await fetch('http://localhost:3000/api/admin/security/logs', {
    headers: {
      'Cookie': 'session=YOUR_SESSION'
    }
  })
  
  const data = await response.json()
  
  // Count by type
  const byType = {}
  data.logs.forEach(log => {
    byType[log.type] = (byType[log.type] || 0) + 1
  })
  
  // Count by IP
  const byIP = {}
  data.logs.forEach(log => {
    byIP[log.ip] = (byIP[log.ip] || 0) + 1
  })
  
  console.log('Security Stats:')
  console.log('===============')
  console.log('By Type:', byType)
  console.log('By IP:', byIP)
  console.log('')
  console.log('Most Recent:')
  data.logs.slice(-5).forEach(log => {
    console.log(`  [${log.type}] ${log.ip} - ${log.reason}`)
  })
}

monitorSecurity()
```

**Run it:**
```bash
node scripts/monitor-security.js
```

---

## ✏️ Customize Validation Rules

### Make Email Optional

**File**: `src/lib/security.ts` (validateOrderSubmission function)

```typescript
// Line 60 - Change:
// FROM:
if (!isValidEmail(data.email)) {
  errors.push('Invalid email address')
}

// TO:
if (data.email && !isValidEmail(data.email)) {
  errors.push('Invalid email address')
}
```

### Increase Name Length Limit

**File**: `src/lib/security.ts`

```typescript
// Line 40 - Change:
// FROM:
if (data.name.length > 100) {
  errors.push('Name too long (max 100 characters)')
}

// TO:
if (data.name.length > 200) {  // ← Increase to 200
  errors.push('Name too long (max 200 characters)')
}
```

### Add More Spam Keywords

**File**: `src/lib/security.ts` (detectSuspiciousOrder function)

```typescript
// Add to spam name check:
if (
  name.includes('click') ||
  name.includes('buy') ||
  name.includes('free') ||
  name.includes('promo') ||
  name.includes('admin') ||
  name.includes('penis') ||      // ← Add new
  name.includes('viagra') ||     // ← Add new
  name === 'test'
) {
  warnings.push('Suspicious name pattern')
}
```

---

## 📈 Analyze Attack Patterns

### Look for Patterns

**Questions to ask:**
1. **Same IP, different emails?** → Bot network
2. **Different IPs, same email domain?** → Distributed attack
3. **Same product/quantity combo?** → Targeted spam
4. **During specific hours?** → Scheduled attacks
5. **Pattern of increasing quantities?** → Testing limits

### Export & Analyze

```javascript
// In browser console:
fetch('/api/admin/security/logs?limit=500', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => {
  // Export as CSV
  const csv = data.logs.map(log => 
    `"${log.timestamp}","${log.type}","${log.ip}","${log.email}","${log.reason}"`
  ).join('\n')
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv]))
  link.download = 'security-logs.csv'
  link.click()
})
```

---

## 🚀 Deployment Controls

### Increase Limits for Production

**Before deploying to production:**

1. **Increase rate limit window** (current: 24h)
   ```typescript
   windowMs: 7 * 24 * 60 * 60 * 1000,  // 7 days instead
   ```

2. **Increase max requests** (current: 10)
   ```typescript
   maxRequests: 50,  // 50 orders per week
   ```

3. **Switch to Redis** (instead of memory)
   - Better for distributed systems
   - Survives server restarts
   - Shared across instances

### Minimal Production Setup

```env
# .env.local
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=SG.xxx...
SESSION_SECRET=very-long-random-string-min-32-chars
ADMIN_PASSWORD=strong-password-here
ADMIN_EMAIL=admin@example.com
```

---

## 📞 Respond to Attacks

### If You See Spam:
1. **Check security logs**: GET `/api/admin/security/logs`
2. **Identify pattern**: Same IP? Same email domain?
3. **Block IP** (if needed): Add to BLOCKED_IPS set
4. **Review orders**: Delete suspicious ones from database
5. **Adjust settings**: Change rate limit if needed
6. **Monitor**: Keep checking logs

### If System Slow:
1. **Check rate limiter**: Is it blocking requests?
2. **Check database**: Performance OK?
3. **Check logs**: Spam spike?
4. **Increase resources**: If legitimate traffic surge

### If You're Unsure:
1. **Keep order but flag**: Don't auto-delete
2. **Call customer**: Verify legitimate?
3. **Adjust validation**: If too strict
4. **Consult logs**: What triggered flag?

---

## 🎯 Recommended Workflow

### Daily
- [ ] Check admin dashboard (if you add security tab)
- [ ] Quick review of security logs
- [ ] Delete any obvious spam orders

### Weekly
- [ ] Export & analyze security logs
- [ ] Look for new attack patterns
- [ ] Adjust spam keywords if needed
- [ ] Update admin password (optional but good)

### Monthly
- [ ] Review rate limit effectiveness
- [ ] Check for new spam techniques
- [ ] Update documentation
- [ ] Test incident response

---

## 🆘 Quick Reference Cheat Sheet

```
SITUATION              → ACTION
────────────────────────────────────────────────────
Website flooded        → Increase rate limit strictness
Too many false flags   → Review spam keywords
Specific IP attacking  → Add to BLOCKED_IPS
Email spam detected    → Add domain to spam list
Bot attack pattern     → Change rate limit window
New attack type        → Add to suspicious detection
```

---

## 📚 Files to Keep Handy

```
Core Security:
  ✓ src/lib/security.ts (all logic)
  ✓ src/app/api/orders/create/route.ts (integration)
  ✓ SECURITY_GUIDE.md (reference)
  ✓ SECURITY_SETUP.md (quick start)

Monitoring:
  ✓ /api/admin/security/logs (endpoint)
  ✓ .env.local (config)

Control:
  ✓ This file! (Control Panel)
```

---

**You're in control! Use these tools to keep your website safe.** 🛡️
