# NOSQL-group-3

📖 Library Management System
A web-based Library Management System built with Node.js, Express, and MongoDB (NoSQL). Supports full CRUD operations for books, a borrow/return loan system, and an analytics report dashboard.

Built as a NoSQL Database Assignment — demonstrating document-oriented database design with MongoDB Atlas.

⚙️ Prerequisites
Make sure the following are installed before running the project:

Node.js v18+ → nodejs.org
npm (bundled with Node.js)
MongoDB Atlas free account → mongodb.com/atlas

Verify installation:
bashnode -v   # e.g. v20.11.0
npm -v    # e.g. 10.x.x

🚀 Getting Started
Step 1 — Install Dependencies
bashnpm install
Step 2 — Install nodemon (recommended for development)
nodemon auto-restarts the server every time you save a file — no need to stop and re-run manually.
bashnpm install -g nodemon

Without nodemon: you can still run the app with node app.js, but you'll need to restart it manually after every code change.

Step 3 - Set Up MongoDB Atlas

Go to mongodb.com/atlas → Try Free → Sign up
Create a free M0 cluster → Region: AWS / Singapore
Database Access → Add New User → set username & password
Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
Click Connect → Drivers → copy the connection string


Step 4 — Run the App
bashnodemon app.js
Expected output:
Connected to MongoDB Atlas
Server running on http://localhost:3000


Step 5 — Open in Browser
http://localhost:3000
The web interface will load.

✨ Features
📚 Book Management (CRUD)

Add books with ISBN, Title, Genre, and Author(s)
View all books in a table
Search by title, author, or genre
Edit or delete any book
Real-time availability status (Available / Borrowed)

🔖 Loan System

Borrow a book — select from available books, enter borrower name and due date
Already-borrowed books are automatically disabled in the dropdown
Return a book with one click
Overdue loans are highlighted in red automatically
Filter loans by: All / Borrowed / Returned

📊 Reports

Busiest Borrow Days — bar chart of top 10 dates with most borrow activity
Borrows by Genre — cards showing total borrows, active loans, and Most/Least Borrowed genre