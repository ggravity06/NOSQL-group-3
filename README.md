# NOSQL-group-3

## 📖 Library Management System

A web-based Library Management System built with Node.js, Express, and MongoDB (NoSQL).  
This application supports full CRUD operations for books, a borrow/return loan system, and an analytics dashboard.

Developed as part of a NoSQL Database assignment, demonstrating document-oriented database design using MongoDB Atlas.

---

## ✨ Features

### 📚 Book Management (CRUD)
- Add books with ISBN, Title, Genre, and Author(s)
- View all books in a table
- Search by title, author, or genre
- Edit or delete books
- Real-time availability status (Available / Borrowed)

### 🔖 Loan System
- Borrow books with borrower name and due date
- Automatically disables unavailable books
- One-click return system
- Overdue loans highlighted automatically
- Filter by: All / Borrowed / Returned

### 📊 Reports Dashboard
- Busiest Borrow Days (Top 10 dates)
- Borrows by Genre
- Summary of active loans
- Most / Least borrowed categories

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account


step 1) Clone the Repository: Download the project from GitHub

step 2) Create a .env file in the root directory then put MONGODB_URI 

step 3) Install Node.js 

step 4) Install Dependencies: npm install

        Install nodemon (recommended): npm install -g nodemon

step 5) Allow IP Access in MongoDB Atlas

        Go to MongoDB Atlas:

        - Navigate to Network Access
        - Click Add IP Address
        - Add your IP Address

step 6) Run the Server
        
        Using Node: node app.js 

step 7) Open in Browser

        Go to: http://localhost:3000
        