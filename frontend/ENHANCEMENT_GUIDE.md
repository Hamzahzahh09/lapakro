# LapakRo Frontend - Enhancement Guide

Date: July 1, 2026

## 📋 Overview

Panduan lengkap untuk meningkatkan frontend aplikasi Roblox Store menjadi standar global e-commerce.

## ✅ Current Frontend Status

- Framework: Next.js 16.2.9 + React 19
- Styling: Tailwind CSS 4 + Radix UI
- State Management: Zustand
- TypeScript: Full coverage
- Pages: 23
- Components: 28+
- Grade: A- (90%)

## 🎯 Recommended Improvements

### Priority 1: Critical (Week 1-2)

#### 1. Enhanced Error Handling & Toast System
**Status:** Partially implemented

Add sophisticated error handling UI:

```typescript
// lib/errors.ts
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

// hooks/useErrorHandler.ts
export function useErrorHandler() {
  return {
    handle: (error: unknown) => ApiError,
    retry: (fn: () => Promise<any>) => Promise<any>,
  };
}
```

#### 2. Loading States & Skeleton Components
**Status:** Partially implemented

Improve UX dengan skeleton loaders:

```typescript
// components/skeletons/ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-lg" />
      <div className="bg-gray-200 h-4 mt-2 rounded w-3/4" />
      <div className="bg-gray-200 h-4 mt-2 rounded w-1/2" />
    </div>
  );
}
```

#### 3. Form Validation & Feedback
**Status:** Basic implementation

Upgrade form handling:

```typescript
// hooks/useForm.ts
export function useForm<T>(onSubmit: (data: T) => Promise<void>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);
      setErrors({});
      await onSubmit(data);
    } catch (error) {
      // Handle errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return { errors, isSubmitting, handleSubmit, setErrors };
}
```

#### 4. API Error Response Handling
**Status:** Need improvement

Standardize API error handling:

```typescript
// lib/api-client.ts
export class ApiClient {
  async fetch<T>(
    url: string,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(
          error.message,
          error.error,
          response.status,
          error.context,
        );
      }
      
      return response.json();
    } catch (error) {
      // Handle and transform error
      throw this.transformError(error);
    }
  }

  private transformError(error: unknown): ApiError {
    // Transform to standardized format
  }
}
```

### Priority 2: High (Week 2-3)

#### 1. Advanced Search & Filters
**Status:** Backend ready, frontend partial

Complete the UI:

```typescript
// components/ProductFilters.tsx
interface FilterOptions {
  category: string[];
  priceRange: [number, number];
  rating: number;
  deliveryMethod: string[];
  sortBy: 'newest' | 'price' | 'rating' | 'sales';
}

export function ProductFilters() {
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 1000000],
    rating: 0,
    deliveryMethod: [],
    sortBy: 'newest',
  });

  return (
    <div className="space-y-4">
      {/* Category checkboxes */}
      {/* Price range slider */}
      {/* Rating filter */}
      {/* Sort options */}
    </div>
  );
}
```

#### 2. Product Recommendations
**Status:** Not implemented

Add AI-powered recommendations:

```typescript
// components/RecommendedProducts.tsx
export function RecommendedProducts({ productId }: { productId: string }) {
  const { data: recommendations } = useQuery(
    ['recommendations', productId],
    () => api.getRecommendations(productId),
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {recommendations?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### 3. Wishlist/Favorites
**Status:** Not implemented

Add wishlist functionality:

```typescript
// hooks/useWishlist.ts
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToWishlist = (productId: string) => {
    setWishlist([...wishlist, productId]);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => 
    wishlist.includes(productId);

  return { addToWishlist, removeFromWishlist, isInWishlist };
}
```

#### 4. Two-Factor Authentication UI
**Status:** Backend ready, frontend not implemented

Add 2FA setup page:

```typescript
// app/settings/security/page.tsx
export default function SecuritySettings() {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string>();

  const handleEnable2FA = async () => {
    const response = await api.setup2FA();
    setQrCode(response.qrCode);
  };

  return (
    <div className="space-y-4">
      <h2>Two-Factor Authentication</h2>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <button onClick={handleEnable2FA}>Enable 2FA</button>
    </div>
  );
}
```

### Priority 3: Medium (Week 3-4)

#### 1. Real-Time Notifications
**Status:** Chat ready, notifications not implemented

Add notification system:

```typescript
// hooks/useNotifications.ts
export function useNotifications() {
  const socket = useSocket();

  useEffect(() => {
    socket.on('order:updated', (order) => {
      toast.success(`Order ${order.id} updated`);
    });

    socket.on('message:new', (message) => {
      toast.info(`New message from ${message.senderName}`);
    });

    return () => {
      socket.off('order:updated');
      socket.off('message:new');
    };
  }, [socket]);
}
```

#### 2. Analytics Dashboard
**Status:** UI ready, data not connected

Connect analytics data:

```typescript
// app/dashboard/analytics/page.tsx
export default function AnalyticsDashboard() {
  const { data: stats } = useQuery(
    ['analytics'],
    () => api.getAnalytics(),
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Sales" value={stats.totalSales} />
      <StatCard label="Total Orders" value={stats.totalOrders} />
      <StatCard label="Avg Rating" value={stats.averageRating} />
      <StatCard label="Conversion Rate" value={stats.conversionRate} />
      
      <LineChart data={stats.dailySales} />
      <BarChart data={stats.categoryBreakdown} />
    </div>
  );
}
```

#### 3. Order Timeline & Status
**Status:** Basic implementation

Enhance order tracking:

```typescript
// components/OrderTimeline.tsx
interface TimelineStep {
  status: string;
  timestamp: Date;
  description: string;
}

export function OrderTimeline({ 
  steps 
}: { 
  steps: TimelineStep[] 
}) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="w-2 h-2 bg-gold rounded-full mt-2" />
          <div>
            <p className="font-semibold">{step.status}</p>
            <p className="text-sm text-gray-600">{step.description}</p>
            <p className="text-xs text-gray-400">
              {formatDate(step.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 4. Mobile Responsiveness
**Status:** Partially implemented

Optimize for mobile:

```typescript
// Tailwind breakpoints usage
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Priority 4: Polish (Week 4+)

#### 1. Accessibility (WCAG 2.1)
- Add ARIA labels
- Keyboard navigation
- Screen reader testing
- Color contrast compliance

#### 2. Performance Optimization
- Image optimization & lazy loading
- Code splitting
- Bundle analysis
- SEO optimization

#### 3. Dark Mode
- Theme switching
- Local storage persistence
- Smooth transitions

#### 4. Internationalization (i18n)
- Multi-language support
- Indonesian as default
- English as alternative
- Currency localization

## 📦 Recommended Packages to Add

```json
{
  "dependencies": {
    "react-query": "^3.39.3",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4",
    "axios": "^1.6.0",
    "dayjs": "^1.11.10",
    "zustand": "^4.5.0",
    "next-international": "^1.0.0",
    "next-themes": "^0.2.1"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "vitest": "^1.0.4",
    "@storybook/react": "^7.6.3"
  }
}
```

## 🎨 UI/UX Improvements

### Color Scheme
- Primary: #FFD700 (Gold - Robux color)
- Secondary: #1A1A2E (Dark blue)
- Accent: #16C784 (Green - success)
- Warning: #FF6B6B (Red)
- Background: #0F0F1E (Very dark)

### Typography
```css
/* Heading styles */
h1: font-size: 32px, weight: 700
h2: font-size: 24px, weight: 700
h3: font-size: 20px, weight: 600
body: font-size: 16px, weight: 400
caption: font-size: 12px, weight: 500
```

### Spacing System
```
4px (xs), 8px (sm), 12px (md), 16px (lg), 
24px (xl), 32px (2xl), 48px (3xl), 64px (4xl)
```

## 📱 Responsive Breakpoints

```typescript
// Mobile First Approach
xs: 320px   // Extra small devices
sm: 640px   // Small devices
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Large screens
2xl: 1536px // Extra large screens
```

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Integration Tests
```bash
npm run test:e2e
```

### Targets
- Components: 80% coverage
- Hooks: 90% coverage
- Utils: 95% coverage

## 📊 Performance Budgets

- Initial JS: < 150KB
- Initial CSS: < 50KB
- Images: < 200KB (above fold)
- Total: < 400KB

## 🚀 Deployment Checklist

- [ ] Run all tests
- [ ] Check Lighthouse scores
- [ ] Verify responsive design
- [ ] Test on real devices
- [ ] Set up Sentry error tracking
- [ ] Configure CDN
- [ ] Enable gzip compression
- [ ] Set up caching headers

## 📚 Implementation Order

1. Week 1: Error handling, form validation, loading states
2. Week 2: Advanced filters, wishlist, 2FA setup
3. Week 3: Notifications, analytics, order timeline
4. Week 4: Mobile optimization, accessibility
5. Week 5+: Dark mode, i18n, performance tuning

## 🔗 Related Backend Endpoints

All new frontend features are supported by backend endpoints:

```
GET  /seller-ratings/seller/:id/stats     - Seller ratings
POST /seller-ratings                       - Create rating
GET  /products?filters=...                 - Advanced search
GET  /products/:id/recommendations         - Recommendations
GET  /auth/2fa/setup                       - 2FA setup
POST /wishlist                             - Add to wishlist
GET  /notifications                        - Get notifications
```

## 📞 Support & Resources

- Frontend setup: `frontend/README.md`
- Component library: `components/` directory
- Hooks: `hooks/` directory
- Types: `lib/types.ts`
- Constants: `lib/constants.ts`

---

**Next Step:** Start with Priority 1 implementations to ensure smooth user experience before moving to advanced features.
