# ExoCart 🛒

ExoCart is a full-stack grocery e-commerce web application built with **React, Vite, Tailwind CSS, Spring Boot, Spring Security, JWT, JPA/Hibernate, and MySQL**.

It provides a complete shopping experience for customers and a dedicated admin dashboard for managing products, orders, users, reports, notifications, and store settings.

## ✨ Features

### 👤 Customer Features

- User registration and login
- JWT authentication
- Forgot password with OTP verification
- Browse products
- Product search
- Category filtering
- Product filtering and sorting
- Product details
- Shopping cart
- Quantity management
- Wishlist
- Delivery address management
- Minimum order validation
- Configurable delivery fee
- Checkout
- Cash on Delivery, UPI, and Card payment options
- Order history
- Order cancellation
- Account management

### 🔐 Admin Features

- Admin authentication and role-based access
- Dashboard with product, order, user, and revenue statistics
- Add, update, and delete products
- Local and remote product images
- Order management
- Order status updates
- User management
- Reports and analytics
- Payment-method statistics
- Delivery and cancellation statistics
- Notifications
- Low-stock notifications
- Store settings
- Configurable delivery fee
- Configurable minimum order amount

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios / Fetch API
- Lucide React
- React Toastify

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- REST APIs

### Database

- MySQL

## 📁 Project Structure

```text
ExoCart/
│
├── exocart-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── exocart-backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       └── resources/
    └── pom.xml
```

# 🚀 Getting Started

Follow the steps below to run **ExoCart** locally.

## 1. Prerequisites

Make sure the following software is installed:

* **Java JDK**
* **Maven**
* **Node.js**
* **npm**
* **MySQL**
* **Git**

You can verify the installations using:

```bash
java -version
mvn -version
node -v
npm -v
mysql --version
git --version
```

---

## 2. Clone the Repository

Clone the project from GitHub:

```bash
git clone <your-github-repository-url>
```

Move into the project directory:

```bash
cd ExoCart
```

---

## 3. Database Configuration

Create a MySQL database for ExoCart.

Open the Spring Boot configuration file:

```text
exocart-backend/src/main/resources/application.properties
```

Configure your MySQL database:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/exocart
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace:

```text
your_password
```

with your MySQL password.

> **Note:** Do not commit your actual database password to GitHub. For a public repository, use environment variables or a separate local configuration file.

---

## 4. Run the Backend

Open a terminal inside the backend directory:

```bash
cd exocart-backend
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will start on:

```text
http://localhost:8080
```

---

## 5. Run the Frontend

Open a **new terminal** and move into the frontend directory:

```bash
cd exocart-frontend
```

Install the required dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may start the application on another port, such as:

```text
http://localhost:5174
```

---

# 🔑 Authentication

ExoCart uses **JWT-based authentication** with **Spring Security**.

After successful login, the JWT token is used for protected API requests.

Protected requests use:

```http
Authorization: Bearer <token>
```

## User Roles

The application supports the following roles:

```text
CUSTOMER
ADMIN
```

Administrative APIs require the `ADMIN` role.

---

# 🛒 Customer Order Flow

The customer shopping flow is:

```text
Register
   ↓
Login
   ↓
Browse Products
   ↓
Search / Filter
   ↓
Add to Cart
   ↓
Checkout
   ↓
Enter Delivery Details
   ↓
Choose Payment Method
   ↓
Place Order
   ↓
Order Confirmation
   ↓
My Orders
```

## Order Status

Orders follow the following status flow:

```text
Placed
   ↓
Processing
   ↓
Out for Delivery
   ↓
Delivered
```

Eligible orders can also be cancelled by the customer.

---

# 💰 Cart and Delivery

ExoCart supports configurable:

* Minimum order amount
* Delivery fee

### Example

```text
Subtotal        ₹250
Delivery Fee     ₹40
--------------------
Final Total     ₹290
```

If the subtotal is below the configured minimum order amount, checkout is disabled until the required amount is reached.

---

# 🔒 Security

The backend uses:

* **Spring Security**
* **JWT authentication**
* **Role-based authorization**
* **CORS configuration**
* **Stateless sessions**

Protected APIs require authentication, while administrative APIs additionally require the `ADMIN` role.

---

# 📊 Admin Dashboard

The admin dashboard provides an overview of:

* Total products
* Total orders
* Total users
* Revenue
* Recent orders
* Order management
* User management
* Reports
* Notifications
* Store settings

---

# 🧪 Testing Checklist

Use the following checklist to verify the application.

## Customer Testing

* [ ] Register a customer account
* [ ] Log in
* [ ] Browse products
* [ ] Search for products
* [ ] Filter products by category
* [ ] Filter and sort products
* [ ] View product details
* [ ] Add products to cart
* [ ] Update product quantities
* [ ] Add/remove products from wishlist
* [ ] Update delivery address
* [ ] Verify minimum order amount
* [ ] Verify delivery fee
* [ ] Complete checkout
* [ ] Test Cash on Delivery
* [ ] Test UPI option
* [ ] Test Card option
* [ ] Verify order confirmation
* [ ] Verify order in My Orders
* [ ] Cancel an eligible order

## Admin Testing

* [ ] Log in as Admin
* [ ] View Admin Dashboard
* [ ] Add a product
* [ ] Update a product
* [ ] Delete a product
* [ ] View all products
* [ ] View all orders
* [ ] Update order status
* [ ] View users
* [ ] View reports
* [ ] Check notifications
* [ ] Check low-stock notifications
* [ ] Update store settings

---

# 📌 Future Improvements

Possible future enhancements include:

* Online payment gateway integration
* Product reviews and ratings
* Coupon and discount system
* Email/SMS order notifications
* Real-time order tracking
* Cloud image storage
* Production deployment
* Advanced analytics
* Automatic inventory management

---

# 👩‍💻 Author

**Rajeswari Ankem**

ExoCart is a full-stack grocery e-commerce project developed using:

* **React**
* **Vite**
* **Tailwind CSS**
* **Spring Boot**
* **Spring Security**
* **JWT**
* **Spring Data JPA**
* **Hibernate**
* **MySQL**

---

# 📄 License

This project is intended for **educational and portfolio purposes**.
