# Business configuration

All operational facts are **owner-provided**. The app does not ship with real phone numbers, addresses, or marketplace URLs.

## Configure in Supabase (`business_settings`)

| Field | Purpose |
|-------|---------|
| `contact_email`, `contact_phone` | Contact page |
| `whatsapp_url` | WhatsApp CTA (link only — not an order channel) |
| `instagram_url`, `zomato_url`, `swiggy_url` | Optional discovery buttons when set |
| `pickup_enabled`, `delivery_enabled` | Checkout fulfilment |
| `delivery_fee_paise`, `min_order_paise` | Server-side totals |
| `pay_on_delivery_enabled` | Default payment method |
| `ordering_paused` | Emergency stop |
| `direct_ordering_enabled` | Master switch |
| `operating_hours` | JSON — future enforcement with FR-011 |
| `membership_enabled` | Gates `/membership` |

## Brand

Defaults: Mom's Curry Co., tagline *A little taste of home.*, timezone `Asia/Kolkata`, currency INR.

## Product examples (when you seed data)

Royal Shahi Paneer, Jeera Rice, combos, Aloo Paratha Combo — use your own descriptions, photos, and **verified** dietary labels only.
