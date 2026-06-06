# Gandaki Graphics - Order Management & Admin Panel

This document describes the newly added order database and admin panel functionality.

## Features Implemented

### 1. **Order Database**
- PostgreSQL database with Prisma ORM
- Order table stores: name, phone, product type, size, color, quantity, design notes, deadline, status, timestamps
- Admin table for authentication credentials
- Automated migrations with Prisma

### 2. **Order Form Enhancement**
- OrderForm component now saves orders to database before opening WhatsApp
- Shows loading state while saving
- Displays error messages if save fails
- Orders persist in database even if user doesn't complete WhatsApp conversation

### 3. **Admin Dashboard** (`/admin`)
- **Login Page**: Secure admin login with email/password
- **Order Management**: View all orders in a sortable, filterable table
- **Status Updates**: Change order status (pending → confirmed → completed/cancelled)
- **Real-time Filtering**: Filter orders by status
- **Order Details**: See customer info, product details, dates, and more

### 4. **RESTful API Endpoints**
- `POST /api/orders/create` - Save new order to database
- `GET /api/orders` - Fetch orders (requires authentication)
- `PATCH /api/orders/update` - Update order status
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon, AWS RDS, local, etc.)

### Installation

1. **Environment Setup**
   Create or update `.env.local`:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   ADMIN_EMAIL="admin@gandaki-graphics.com"
   ADMIN_PASSWORD="your_secure_password"
   SESSION_SECRET="your_session_secret_key"
   ```

2. **Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```
   This creates tables and seeds the admin account.

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the App**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - Admin Login: Use credentials from `.env.local`

## Architecture

### Database Schema

**Orders Table**
```
id: Int (primary key)
name: String
phone: String (optional)
product: String (T-shirt, Hoodie, Cup)
size: String (optional, not for Cup)
color: String (optional)
quantity: Int
designNotes: String (optional)
deadline: String (optional)
status: String (pending, confirmed, completed, cancelled)
createdAt: DateTime
updatedAt: DateTime
```

**Admin Table**
```
id: Int (primary key)
email: String (unique)
passwordHash: String (bcrypt hashed)
createdAt: DateTime
```

### Authentication Flow

1. Admin enters email/password on `/admin`
2. Credentials sent to `/api/auth/login`
3. Server validates against Admin table, hashes password with bcryptjs
4. On success, sets secure HTTP-only session cookie
5. Subsequent requests include session cookie for authentication
6. `/api/orders` endpoint checks session before returning data

### Order Flow

1. Customer fills order form at `/order`
2. Form validates required fields (name, product, quantity)
3. Submits to `/api/orders/create` with order data
4. Server saves to database
5. On success, opens WhatsApp with pre-filled message
6. Admin can view order in `/admin` dashboard

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── orders/
│   │       ├── create/route.ts
│   │       ├── route.ts       # GET orders list
│   │       └── update/route.ts
│   └── ...                     # Existing pages
├── components/
│   ├── AdminLogin.tsx         # Login form component
│   ├── AdminOrders.tsx        # Orders table component
│   ├── OrderForm.tsx          # Enhanced order form
│   └── ...
└── lib/
    ├── auth.ts                # Authentication utilities
    └── prisma.ts              # Prisma client instance
prisma/
├── schema.prisma              # Database schema
├── seed.js                    # Database seeder
└── migrations/                # Migration files
```

## Security Considerations

1. **Session Management**: Uses secure HTTP-only cookies
2. **Password Hashing**: bcryptjs with 10 salt rounds
3. **API Authentication**: Session verification on protected endpoints
4. **Environment Variables**: Sensitive data in `.env.local` (git-ignored)
5. **SSL/TLS**: Enabled in production (secure: true on cookies)

## Customization

### Change Default Admin Credentials
Update `.env.local`:
```
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Then reseed:
```bash
npx prisma migrate reset  # ⚠️ Clears all data!
# Or manually update in database
```

### Add More Status Values
Edit `prisma/schema.prisma` Order model and add statuses. Update:
- `src/components/AdminOrders.tsx` - STATUS_COLORS object
- `src/app/api/orders/update/route.ts` - validStatuses array

### Customize Admin Panel UI
- Edit `src/components/AdminLogin.tsx` for login styling
- Edit `src/components/AdminOrders.tsx` for dashboard layout
- Uses Tailwind CSS (matches website design)

## Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Setup (Production)
1. Set production DATABASE_URL in deployment environment
2. Update ADMIN credentials
3. Set secure SESSION_SECRET
4. Enable HTTPS/SSL

### Database
- Ensure PostgreSQL is accessible from production server
- Run migrations: `npx prisma migrate deploy`
- Keep backups of production database

## Troubleshooting

### Admin Login Not Working
- Check `.env.local` DATABASE_URL is correct
- Verify admin account exists: `npx prisma studio`
- Check email/password match

### Orders Not Saving
- Verify DATABASE_URL connection
- Check network/CORS issues
- Look at browser console and server logs

### Migration Issues
```bash
# View migration status
npx prisma migrate status

# Resolve failed migrations
npx prisma migrate resolve --rolled-back <migration_name>

# Reset database (clears all data)
npx prisma migrate reset
```

## Future Enhancements

- [ ] Order search and advanced filtering
- [ ] Export orders to CSV/PDF
- [ ] Email notifications for order updates
- [ ] Admin user management (multiple admins)
- [ ] Order notes/internal comments
- [ ] File upload for customer designs
- [ ] Analytics dashboard (orders by product, revenue, etc.)
- [ ] Automatic email to customer on status update

## Support

For issues or questions, check:
1. Server console logs (`npm run dev` output)
2. Browser developer console (Network tab for API errors)
3. Database connection: `npx prisma db push`
