
<div align="center"> <img src="https://cdn-icons-png.flaticon.com/512/3514/3514491.png" alt="ShopNest Logo" width="80" /> <h1>ShopNest - Full-Stack MERN E-Commerce App</h1> <p>A full-stack e-commerce platform with email OTP sign-up, a Redux-powered cart, Razorpay payments, Cloudinary image uploads and an admin dashboard.</p> </div>
📖 About the Project

ShopNest is an end-to-end online store built on the MERN stack (MongoDB, Express.js, React, Node.js). It covers the whole shopping journey: a customer registers and verifies their email with a one-time password, browses and searches the catalogue, fills a cart, pays through Razorpay and later reviews their order history on a personal profile page.

Store owners get a protected admin area where they can track revenue and orders, add or edit products with image uploads, update order status and view registered users.

The project is organised as a simple monorepo (backend/ and frontend/) with a root package.json that starts both servers with a single command. In production the Express server also serves the compiled React app, so the whole application can be hosted as one Node service.

✨ Features
Customer experience
Secure registration with email OTP: new accounts are verified with a one-time password sent by email (Nodemailer + Gmail).
JWT authentication: stateless login, with user sessions managed on the client through React's Context API.
Product browsing: home page, shop listing and detailed product pages.
Shopping cart: state managed with Redux Toolkit.
Checkout with shipping address: full name, street, city, postal code and country are stored with each order.
Razorpay payments: server-side order creation followed by payment signature verification.
User profile: personal details and complete order history.
Product reviews and ratings: a review model with 1–5 star ratings and comments.
Informational pages: About, Return Policy and Disclaimer.
Admin dashboard
Analytics: total orders, total products, total customers and total revenue at a glance.
Product management: create, edit and delete products; images are uploaded through Multer and stored on Cloudinary.
Order management: view all orders and move them through Pending → Shipped → Delivered.
User management: list registered users.
Role-based access: admin routes are protected by both an authentication and an admin middleware.
🛠 Tech Stack
Layer	Technologies
Frontend	React 18 (Create React App), React Router v6, Redux Toolkit, Context API
Backend	Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer, Nodemailer
Database	MongoDB (local or Atlas)
Payments	Razorpay
Media storage	Cloudinary
Tooling	concurrently, nodemon, Postman collection
📁 Project Structure
shopnest/
├── backend/
│   ├── config/          # MongoDB and Cloudinary setup
│   ├── controllers/     # auth, products, orders, payment, analytics logic
│   ├── middleware/      # JWT auth + admin-only guards
│   ├── models/          # User, Product, Order, Review schemas
│   ├── routes/          # Express route definitions
│   ├── utils/           # sendEmail helper (OTP emails)
│   ├── seed.js          # sample data + admin account
│   └── server.js        # app entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── admin/       # dashboard, products, orders, users pages
│       ├── components/  # Navbar, Footer, ProductCard
│       ├── context/     # AuthContext
│       ├── pages/       # Home, Shop, Cart, Checkout, Profile, ...
│       ├── redux/       # store and cart slice
│       └── styles/
├── ShopNest_Postman_Collection.json
└── package.json         # root scripts
🚀 Getting Started
Prerequisites
Node.js 18 or newer
MongoDB running locally, or a free MongoDB Atlas connection string
Optional for full functionality: Cloudinary, Razorpay (test mode) and Gmail app-password credentials
1. Clone the repository
bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
2. Configure environment variables

Create backend/.env:

env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/shopnest
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_URL=http://localhost:3000

# Cloudinary (product image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (use test keys)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Gmail (OTP emails - use an App Password, not your login password)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password
Variable	Purpose
MONGO_URI	Database connection string
JWT_SECRET	Secret used to sign login tokens
FRONTEND_URL	Allowed CORS origin in production
CLOUDINARY_*	Product image uploads
RAZORPAY_*	Payment order creation and verification
GMAIL_USER / GMAIL_PASS	Sending OTP emails

⚠️ Never commit your .env file. It is already listed in .gitignore.

3. Install dependencies

From the project root:

bash
npm run install-all

This installs the root, backend and frontend packages.

4. Seed the database (optional)

Adds sample products and an admin account:

bash
npm run seed

Admin login: admin@shopnest.com / password123 — change this password before any real deployment.

5. Start the app
bash
npm run dev
Service	URL
Frontend	http://localhost:3000
Backend API	http://localhost:5000
🔌 API Overview
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register a user and send an OTP
POST	/api/auth/verify-otp	Public	Verify email with OTP
POST	/api/auth/login	Public	Log in and receive a JWT
GET	/api/auth/users	Admin	List all users
GET	/api/products	Public	List products
GET	/api/products/:id	Public	Get a single product
POST	/api/products	Admin	Create a product (with image)
PUT	/api/products/:id	Admin	Update a product
DELETE	/api/products/:id	Admin	Delete a product
POST	/api/orders	User	Place an order
GET	/api/orders/myorders	User	Current user's orders
GET	/api/orders	Admin	All orders
PUT	/api/orders/:id/status	Admin	Update order status
POST	/api/payment/order	—	Create a Razorpay order
POST	/api/payment/verify	—	Verify a Razorpay payment
GET	/api/analytics	Admin	Dashboard statistics

Protected routes expect an Authorization: Bearer <token> header.

Postman

Import ShopNest_Postman_Collection.json into Postman. It uses a {{token}} variable so you can quickly test user and admin endpoints.

🗄 Data Models
User: name, email (unique), hashed password, role (user / admin), OTP and expiry, verified flag, timestamps.
Product: name, description, price, category, stock, image URL, average rating, review count.
Order: user reference, line items (product, quantity, price), total amount, shipping address, payment ID, status (Pending, Shipped, Delivered).
Review: product and user references, reviewer name, rating (1–5), comment.
☁️ Deployment (Render)

In production (NODE_ENV=production) the Express server serves the built React app from frontend/build, so one web service is enough.

Push this repository to GitHub.
In the Render Dashboard, create a new Web Service and connect the repo.
Build Command:
bash
   npm run install-all && npm run build
Start Command:
bash
   npm start
Under Environment Variables, add every variable from your .env, with NODE_ENV=production and FRONTEND_URL set to your Render URL.
Use a hosted database such as MongoDB Atlas for MONGO_URI, and allow Render's IPs in Atlas network access.
Deploy.
🔒 Security Notes
Passwords are hashed with bcrypt, and API access uses signed JWTs.
Keep all secrets in environment variables and rotate any key that has ever been exposed.
Use Razorpay test keys while developing.
Change the seeded admin password before going live.
🧭 Possible Improvements
Protect the payment endpoints with the authentication middleware.
Add search, filters and pagination to the shop page.
Add automated tests and a CI workflow.
Add Docker support for one-command setup.
