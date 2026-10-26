# 🔄 Recurring Mandate & Subscription Self-Service Portal

> **Interactive Frontend Prototype tackling Razorpay Fix-My-Itch Problem Statement #3**  
> *Engineered by [Abhay Vinod](https://github.com/abhayvinod-web)*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![React 19](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)

---

## 🎯 The Problem
Over **30% of subscription cancellations are involuntary or accidental**, driven by:
1. **No pause option:** Customers needing a temporary hiatus are forced to cancel completely.
2. **Card expiration drop-offs:** Updating payment cards often requires destroying the active subscription and re-enrolling.
3. **Bill shock fear:** Lack of user-defined spending ceilings causes anxiety over variable cloud or usage fees.

---

## 💡 The Solution
A **self-service recurring mandate management portal** that gives subscribers fine-grained control:
- ⏸️ **1-Click Pause & Resume:** Freeze recurring billings for 1–3 months without losing grandfathered discounts.
- 🎚️ **Custom Spending Ceilings:** Set monthly auto-debit thresholds in accordance with RBI e-Mandate rules.
- 💳 **Zero-Downtime Instrument Swap:** Seamlessly transition between UPI Autopay and Credit Cards.
- ⚡ **Simulated Auto-Debit:** Test scheduled debits with live audit log feeds and confetti feedback.

---

## 🛠️ Tech Stack & Architecture
- **Frontend Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Micro-Animations:** Canvas Confetti
- **Build System:** Vite 6

---

## 🚀 Local Development

```bash
# 1. Clone repository
git clone https://github.com/abhayvinod-web/subscription-mandate-portal.git

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
