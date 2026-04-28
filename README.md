Murugs Sarees - Retailing Web Application (Admin + User App)

A complete saree retailing web application consisting of a User Shopping Interface and an Admin Dashboard, built to manage products, track orders, and enable seamless ordering through WhatsApp.


---

🌐 Overview

Designed for small businesses to manage orders through WhatsApp instead of complex payment gateways.

Customers can browse products and place orders via WhatsApp, while the admin can monitor and control the entire system.

---

✨ Key Features

👩‍🛍️ User Application

- 🏠 Home page with featured sarees
- 📂 Browse sarees by category
- 🧵 Detailed product view 
- 🛒 Add to Cart functionality
- 🧾 Cart page + Cart drawer
- 📲 WhatsApp-based order placement
- 🔘 Floating WhatsApp contact button
- 📞 Contact page integration
- 🔐 Order popup to collect:
  - Username
  - Phone number
- 📦 Basic order tracking (via popup flow)

---

🧑‍💼 Admin Application

- 📊 Dashboard with order analytics (charts)
- 📦 Order Management (view list of orders)
- 🧵 Inventory Management:
  - Add sarees
  - Edit sarees
  - Delete sarees
- 📂 Category Management:
  - Add categories with images
- ⭐ Reviews Management:
  - Admin-controlled review entries
- 🔐 Admin Authentication (secure login)

---

🛠️ Tech Stack

Frontend:

- React.js
- CSS3 (Fully separate CSS files for styling)

Backend / Services:

- Firebase (Authentication, Database)
- Cloudinary (Image storage)

---

📲 Order Workflow

1. User browses products and adds items to cart
2. On "Buy Now" or "Proceed to Cart", a popup collects user details
3. Order details (products + user info) are sent via WhatsApp
4. Admin receives and processes the order
5. Orders are tracked and visualized in the admin dashboard

---

📂 Project Structure

```
/user-app
┣ src/
┃ ┣ components/
┃ ┣ pages/
┃ ┣ styles/
┃ ┗ App.js

/admin-app
┣ src/
┃ ┣ components/
┃ ┣ pages/
┃ ┣ dashboard/
┃ ┣ AdminLayout/
┃ ┗ App.js
```

---


⚙️ Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the app
   ```bash
   npm run dev
   ```

---


📌 Future Enhancements

- 💳 Online payment integration
- 📦 Advanced order tracking system
- 👤 Customer login system
- 🔍 Product filtering & search
- 📊 Advanced analytics

---

🤝 Client Note

This application is designed to provide a modern online presence for saree retail businesses while keeping the ordering process simple through WhatsApp integration.
It can be further scaled with payment gateways and full e-commerce features.

---

📞 Contact

For further improvements, feature requests, or support, feel free to reach out.
