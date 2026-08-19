# 🚀 LapakRo - Quick Start Guide

**Last Updated:** July 1, 2026

## ⚡ 5-Minute Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan database credentials
npm run migration:run
npm run start:dev
```

**Backend Running at:** `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

**Frontend Running at:** `http://localhost:3000`

---

## 📋 What's New (This Implementation)

| Feature | Type | Effort | Status |
|---------|------|--------|--------|
| Database Migrations | Infrastructure | ✅ Done | Production-ready |
| Logging System | Infrastructure | ✅ Done | Production-ready |
| Exception Handling | Infrastructure | ✅ Done | Production-ready |
| Email Notifications | Feature | ✅ Done | 13 templates ready |
| Seller Ratings | Feature | ✅ Done | 5 API endpoints |
| Rate Limiting | Security | ✅ Done | Per-user configured |

---

## 📚 Documentation

### Must Read (15 mins)
1. **`backend/SETUP_GUIDE.md`** - Backend setup & deployment
2. **`backend/FEATURES_IMPLEMENTED.md`** - What was added
3. **This file** - Quick reference

### Recommended (30 mins)
1. **`IMPLEMENTATION_REPORT.md`** - Complete overview
2. **`frontend/ENHANCEMENT_GUIDE.md`** - Frontend improvements
3. **Analysis reports** in temp folder

---

## 🔧 Common Commands

### Backend
```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug mode

# Database
npm run migration:run      # Run migrations
npm run migration:revert   # Undo last migration
npm run db:sync           # Sync schema (dev only)
npm run seed              # Seed data

# Quality
npm test                  # Run tests
npm run lint              # Check code
npm run format            # Format code
npm run build             # Production build
```

### Frontend
```bash
# Development
npm run dev               # Development server

# Production
npm run build             # Build for production
npm start                 # Run production build

# Quality
npm run lint              # Check code
npm run type-check        # Check types
npm test                  # Run tests (to add)
```

---

## 🏗️ Architecture Overview

```
Frontend (Next.js 16)
    ↓ (API calls)
Backend (NestJS 11)
    ↓ (Queries)
Database (MySQL)
    ↓ (Real-time)
WebSocket (Socket.io)
```

### Key Components

**Backend Modules:**
- `auth/` - Authentication & JWT
- `users/` - User management
- `products/` - Product catalog
- `transactions/` - Orders & escrow
- `payment/` - Payment processing
- `wallet/` - Wallet system
- `reviews/` - Reviews & ratings (now includes seller ratings)
- `disputes/` - Dispute resolution
- `chat/` - Real-time messaging
- `admin/` - Admin dashboard
- `common/` - Shared utilities (logger, email, guards, filters)

**Frontend Pages:**
- `/` - Home/marketplace
- `/products` - Product listing
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/dashboard` - User dashboard
- `/seller` - Seller dashboard
- `/admin` - Admin panel
- `/auth/*` - Authentication pages

---

## 📦 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=roblox_store

# Application
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h

# Email
MAILTRAP_HOST=live.smtp.mailtrap.io
MAILTRAP_PORT=587
MAILTRAP_USER=user@mailtrap.io
MAILTRAP_PASS=password
MAILTRAP_FROM_EMAIL=noreply@lapakro.com

# URLs
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=LapakRo
```

---

## 🎯 API Endpoints Summary

### Seller Ratings (NEW)
```
POST   /seller-ratings                    - Create rating
GET    /seller-ratings/seller/:id/stats   - Get seller stats
GET    /seller-ratings/seller/:id         - List seller ratings
PUT    /seller-ratings/:id                - Update rating
DELETE /seller-ratings/:id                - Delete rating
```

### Authentication
```
POST   /auth/register            - Register
POST   /auth/login              - Login
POST   /auth/oauth              - OAuth login
POST   /auth/verify-otp         - Verify OTP
```

### Products
```
GET    /products                - List products
POST   /products                - Create product
GET    /products/:id            - Get product
PUT    /products/:id            - Update product
DELETE /products/:id            - Delete product
```

### Orders (Transactions)
```
POST   /transactions            - Create order
GET    /transactions            - List orders
GET    /transactions/:id        - Get order detail
PUT    /transactions/:id        - Update order
POST   /transactions/:id/confirm - Confirm order
```

### Admin (16 endpoints)
```
GET    /admin/users             - List users
PUT    /admin/users/:id/ban     - Ban user
GET    /admin/products          - Manage products
GET    /admin/disputes          - Manage disputes
```

**Full API documentation** in backend code with JSDoc comments.

---

## 🧪 Testing

### Backend Tests
```bash
# Unit tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:cov
```

**Example test:** `src/reviews/services/seller-rating.service.spec.ts`

### Frontend Tests
To be implemented (guide in `ENHANCEMENT_GUIDE.md`)

---

## 📊 Database Schema

**10 Tables:**
1. `users` - User accounts (email, password, profile, KYC)
2. `products` - Product listings (title, price, stock, images)
3. `transactions` - Orders (buyer, seller, product, status)
4. `payments` - Payment records (amount, method, status)
5. `wallet` - User wallets (balance, total deposited/withdrawn)
6. `wallet_transactions` - Wallet history (deposits, withdrawals, refunds)
7. `reviews` - Product reviews (rating, content, images)
8. `disputes` - Dispute/claims (reason, evidence, resolution)
9. `chat_messages` - Messages (transaction-based, text/image/file)
10. `seller_ratings` - Seller ratings (NEW - rating, aspects, comments)

**All tables with:**
- Primary keys
- Foreign key relationships
- Indexes on search fields
- Timestamps (createdAt, updatedAt)
- Proper constraints

---

## 🔐 Security Features

✅ **Authentication**
- JWT tokens (HS256)
- Bcrypt password hashing (10 rounds)
- Google OAuth integration
- Email OTP verification

✅ **Authorization**
- Role-based access control (user, seller, admin, owner)
- Route guards
- Resource ownership checks

✅ **Protection**
- CORS configuration
- Helmet security headers
- Input validation with class-validator
- Rate limiting (global + per-user)
- SQL injection prevention (TypeORM)

⚠️ **TODO**
- Two-factor authentication (backend ready)
- CSRF protection
- Secrets vault
- API key management

---

## 🚀 Deployment Steps

### Local Development
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Staging
```bash
# Prepare
npm run build
npm run migration:run

# Run
NODE_ENV=staging npm run start:prod
```

### Production
```bash
# Build
npm run build

# Run migrations
NODE_ENV=production npm run migration:run

# Start
NODE_ENV=production npm run start:prod

# Monitor
# Setup Sentry, New Relic, or similar
```

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:**
- Check MySQL is running
- Verify credentials in `.env`
- Check database exists

### Port Already in Use
```
Error: listen EADDRINUSE :::3001
```
**Solution:**
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>

# Or use different port
PORT=3002 npm run start:dev
```

### Migration Failed
```
Error: Migration table doesn't exist
```
**Solution:**
```bash
# Reset database
npm run db:sync

# Or manually delete and recreate DB
mysql -u root -p -e "DROP DATABASE roblox_store; CREATE DATABASE roblox_store;"
npm run migration:run
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Rebuild
npm run build
```

---

## 📈 Performance Tips

1. **Database**
   - Indexes created on foreign keys
   - Use pagination (limit 10-50)
   - Avoid N+1 queries

2. **API**
   - Response compression (gzip)
   - Caching headers
   - Rate limiting enabled

3. **Frontend**
   - Image optimization
   - Code splitting
   - Lazy loading
   - CSS-in-JS optimization

---

## 🎓 Learning Path

### Day 1
- [ ] Read this Quick Start Guide
- [ ] Setup local development environment
- [ ] Run database migrations
- [ ] Start both frontend and backend

### Day 2
- [ ] Read `backend/SETUP_GUIDE.md`
- [ ] Explore backend folder structure
- [ ] Test API endpoints (use Postman/Insomnia)
- [ ] Review database schema

### Day 3
- [ ] Read `frontend/ENHANCEMENT_GUIDE.md`
- [ ] Explore frontend components
- [ ] Test user workflows
- [ ] Review state management

### Day 4
- [ ] Read `IMPLEMENTATION_REPORT.md`
- [ ] Review new features (seller ratings, email, logging)
- [ ] Plan testing strategy
- [ ] Setup CI/CD pipeline

### Day 5
- [ ] Run test suite
- [ ] Performance testing
- [ ] Security review
- [ ] Plan production deployment

---

## 📞 Getting Help

### Documentation
1. **Setup Issues** → `backend/SETUP_GUIDE.md`
2. **Feature Details** → `backend/FEATURES_IMPLEMENTED.md`
3. **Frontend Ideas** → `frontend/ENHANCEMENT_GUIDE.md`
4. **Complete Overview** → `IMPLEMENTATION_REPORT.md`

### Code
- **Error Handling** → `src/common/exceptions/`
- **Logging** → `src/common/logger/`
- **Email** → `src/common/email/`
- **Example Feature** → `src/reviews/`

### External Resources
- NestJS Docs: https://docs.nestjs.com
- Next.js Docs: https://nextjs.org/docs
- TypeORM Docs: https://typeorm.io
- Tailwind Docs: https://tailwindcss.com

---

## ✅ Pre-Launch Checklist

### Backend
- [ ] All migrations run successfully
- [ ] Logging system working
- [ ] Email service tested
- [ ] Rate limiting verified
- [ ] Error handling tested
- [ ] Tests passing (70%+)
- [ ] No console errors
- [ ] Secrets not exposed

### Frontend
- [ ] Build successful
- [ ] No TypeScript errors
- [ ] Responsive design verified
- [ ] Performance acceptable
- [ ] All pages loading
- [ ] No console errors

### Operations
- [ ] Database backup ready
- [ ] Monitoring configured
- [ ] Alert rules set
- [ ] Deployment plan ready
- [ ] Rollback plan ready

---

## 🎉 You're Ready!

Everything is set up and ready for:
1. ✅ Local development
2. ✅ Testing
3. ✅ Staging deployment
4. ✅ Production deployment (after testing)

**Next Step:** Start with Day 1 of the Learning Path or jump to `backend/SETUP_GUIDE.md`

---

**Questions?** Check the full documentation or review the code comments.

**Status:** 🟢 READY TO USE
