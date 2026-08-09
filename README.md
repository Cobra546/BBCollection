# BB Collection

Premium streetwear storefront for GitHub Pages + Supabase.

## Current features
- Responsive BB Collection storefront
- Product catalog and category filtering
- Product detail pages
- Local cart and wishlist
- Checkout form with Cash on Delivery
- Supabase order storage
- Secure admin-only order dashboard
- Order statuses: pending, processing, shipped, delivered, cancelled
- Order number and tracking number support

## 1. Create the Supabase database
Open your Supabase project's SQL Editor and run `supabase/schema.sql`.

## 2. Create the admin account
In Supabase Authentication, create an email/password user for the store owner. Copy that user's UUID and run the final INSERT shown in `supabase/schema.sql`.

## 3. Add the public Supabase configuration
Open `js/supabase.js` and set:

```js
window.BB_SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
window.BB_SUPABASE_ANON_KEY = 'YOUR_PUBLISHABLE_KEY';
```

Only use the project's publishable/anon key in browser code. Never put a service-role or secret key in this repository.

## 4. Publish on GitHub Pages
In GitHub: Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

## Order flow
Customer → Checkout → Supabase `orders` table → Admin login → Admin dashboard → Update order status/tracking.

The customer-facing site intentionally cannot read the complete orders table. RLS restricts order reads and updates to users listed in `admin_users`.

## Notes
Product images are intentionally represented by CSS artwork for the initial build, so the store works immediately without broken image links. Replace the artwork with your own product photography later.
