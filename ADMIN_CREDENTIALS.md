# 🔐 Admin Credentials

This file is for reference. **DO NOT commit to git!**

## Login Credentials

- **Email**: admin@gandaki-graphics.com
- **Password**: admin123
- **URL**: http://localhost:3000/admin

## ⚠️ SECURITY WARNINGS

Before deploying to production:

1. **Change the password immediately**
   - Edit `.env.local`
   - Update `ADMIN_PASSWORD` to a strong, unique password
   - Reseed: `node prisma/seed.js`

2. **Change the session secret**
   - Update `SESSION_SECRET` in `.env.local`
   - Use a long random string (32+ characters)

3. **Environment Variables**
   - `.env.local` is in `.gitignore` - DO NOT COMMIT
   - For production, use your deployment platform's secrets manager
   - Never hardcode credentials in code

4. **Database Credentials**
   - Your DATABASE_URL contains your Neon credentials
   - Keep this private - DO NOT SHARE
   - Rotate credentials periodically

## 📝 How to Change Admin Credentials

### Option 1: Update Environment & Reseed
```bash
# 1. Edit .env.local
ADMIN_EMAIL="newemail@example.com"
ADMIN_PASSWORD="NewSecurePassword123!"

# 2. Reseed database
node prisma/seed.js
```

### Option 2: Use Prisma Studio
```bash
# Open database UI
npx prisma studio

# Find Admin table, click on existing admin
# Update email/password directly

# To hash a new password:
node -e "require('bcryptjs').hash('newpassword', 10).then(console.log)"
```

## 🔄 Password Reset

If you forget the admin password:

1. Open Prisma Studio: `npx prisma studio`
2. Navigate to Admin table
3. Click on admin user
4. Update password hash with bcrypt hash

To generate a bcrypt hash:
```bash
node -e "require('bcryptjs').hash('YourNewPassword', 10).then(h => console.log(h))"
```

## 🛡️ Security Checklist

- [ ] Password changed from default
- [ ] Session secret changed from default
- [ ] `.env.local` added to `.gitignore`
- [ ] No credentials hardcoded in code
- [ ] HTTPS/SSL enabled in production
- [ ] Database firewall configured
- [ ] Regular backups of database
- [ ] Reviewed API security
- [ ] Session timeout configured
- [ ] Rate limiting on login endpoint

## 📞 Support

If you lose access:
1. Reset database: `npx prisma migrate reset`
2. Run seed: `node prisma/seed.js`
3. Use default credentials from QUICK_START.md
