# ⚡ Input Gears - Premium Gear for Productivity

Welcome to **Input Gears**, a high-performance e-commerce platform built for tech enthusiasts. Experience a seamless shopping journey with a stunning, modern interface, robust back-office management, and state-of-the-art technology.

---

## 📸 Visual Preview

![Input Gears Homepage](file:///C:/Users/rakib/.gemini/antigravity/brain/4720586d-7d83-432f-850a-7ce1ad9533f8/homepage_high_quality_final_1768321348526.png)

---

## 🚀 Core Features

### 🛒 E-Commerce Excellence

- **Dynamic Product Catalog**: Browse premium peripherals with lightning-fast search and filtering.
- **Seamless Cart Experience**: Real-time updates with synchronized glassmorphism toast notifications.
- **Smart Checkout**: Integrated Stripe payment processing for secure and fast transactions.
- **Order Management**: Track your productivity upgrades from "Pending" to "Delivered".

### 🔐 Multi-Role Authentication

- **Secure Auth**: Powered by **Better Auth** for robust session management and data security.
- **User Dashboard**: Manage profiles, shipping addresses, and order history effortlessly.

### 🛠️ Professional Admin Suite

- **Inventory Control**: Real-time product management (Create, Update, Delete) with Cloudinary integration for lightning-fast image delivery.
- **Dynamic Content**: CMS-style control over hero slides and site-wide marketing banners.
- **Order Oversight**: Comprehensive dashboard to process and monitor all customer orders.

### 🎨 Premium Aesthetics

- **Tailwind 4 & CSS Modules**: Utilizing the latest in styling technology for a fluid, responsive, and high-performance UI.
- **Glassmorphism Design**: Elegant blur effects and semi-transparent elements for a premium feel.
- **Dark Mode Support**: Native dark mode integration for late-night productivity sessions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Image Hosting**: [Cloudinary](https://cloudinary.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📥 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance
- Stripe Account (for payments)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rakibhassan01/input-gears.git
   cd input-gears
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Create a `.env` file in the root directory and add the following:

   ```env
   DATABASE_URL="your_postgresql_url"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_key"
   STRIPE_SECRET_KEY="your_stripe_secret"
   BETTER_AUTH_SECRET="your_auth_secret"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Database Initialization:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```text
├── app/          # Next.js App Router (Admin & Home routes)
├── components/   # UI Components (Radix UI, Shared components)
├── context/      # React Context (Cart, Auth)
├── lib/          # Utilities, Prisma client, Auth configuration
├── prisma/       # Database Schema and Seeds
└── public/       # Static Assets
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by the Input Gears Team**
