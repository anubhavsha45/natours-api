# 🌍 Natours – Tour Booking Platform

🔗 **Live Demo:** https://natours-app-goux.onrender.com/  
📂 **GitHub Repository:** https://github.com/anubhavsha45/natours-api

---

## 📌 Overview

**Natours** is a full-stack tour booking web application that allows users to explore, book, and review tours around the world. It includes authentication, tour management, booking functionality, and secure payments.

The project focuses on building a **scalable backend architecture with Node.js and Express**, while also implementing production-level features such as authentication, security, payments, and email services.

---

## ✨ Features

### 👤 User Features

- User signup and login
- JWT-based authentication
- Password reset via email
- Update profile and upload profile photo
- Browse available tours
- Book tours
- Leave reviews and ratings

### 🛠 Admin Features

- Create, update, and delete tours
- Manage users
- Manage bookings
- Control access with role-based authorization

### 💳 Payments

- Secure payments using **Stripe integration**

### 🛡 Security Features

- Data sanitization
- Rate limiting
- HTTP security headers
- Password hashing with bcrypt
- JWT authentication

---

## 🧰 Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend

- Pug Template Engine
- HTML
- CSS
- Vanilla JavaScript

### Tools & Services

- Stripe (Payments)
- Multer (File uploads)
- Nodemailer (Emails)
- Render (Deployment)

---

## 🏗 Project Architecture

The application follows the **MVC (Model–View–Controller)** architecture.

```
Natours
│
├── controllers
├── models
├── routes
├── views
├── public
├── utils
├── config.env
└── server.js
```

This structure helps in maintaining clean and scalable backend code.

---

## 🔐 Authentication System

The authentication system includes:

- JWT-based login
- Protected routes
- Role-based authorization
- Password reset using email tokens

---

## 💳 Booking Workflow

1. User selects a tour
2. User clicks **Book Now**
3. Stripe checkout session is created
4. Payment is processed securely
5. Booking is stored in the database

---

## 🚀 Running Locally

Clone the repository

```bash
git clone https://github.com/yourusername/natours.git
```

Install dependencies

```bash
npm install
```

Create a **config.env** file

```
DATABASE=your_mongodb_connection
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_key
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
```

Run the project

```bash
npm run dev
```

---

## 🎯 What I Learned

While building this project I learned:

- Designing RESTful APIs
- Implementing authentication and authorization
- Integrating Stripe payments
- Handling file uploads with Multer
- Sending transactional emails with Nodemailer
- Securing Node.js applications
- Structuring scalable backend architecture

---

## 👨‍💻 Author

**Anubhav Sharma**

GitHub: https://github.com/anubhavsha45 

---

⭐ If you like this project, consider giving it a **star on GitHub**!
