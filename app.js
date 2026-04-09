require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── SCHEMAS ──────────────────────────────────────────────────

const bookSchema = new mongoose.Schema({
    ISBN:    { type: String, required: true, unique: true },
    name:    { type: String, required: true },
    genre:   { type: String, required: true },
    authors: { type: String, required: true }
});
const Book = mongoose.model("Book", bookSchema);

const loanSchema = new mongoose.Schema({
    bookId:       { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowerName: { type: String, required: true },
    borrowDate:   { type: Date, default: Date.now },
    dueDate:      { type: Date, required: true },
    returnDate:   { type: Date, default: null },
    status:       { type: String, enum: ["borrowed", "returned"], default: "borrowed" }
});
const Loan = mongoose.model("Loan", loanSchema);

// ─── BOOK ROUTES ──────────────────────────────────────────────

app.post('/books', async (req, res) => {
    try {
        const savedBook = await new Book(req.body).save();
        res.status(201).json(savedBook);
    } catch(err) { res.status(400).json({ message: err.message }); }
});

app.get('/books', async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let books;
        if (searchQuery) {
            const regex = new RegExp(searchQuery, 'i');
            books = await Book.find({
                $or: [{ name: regex }, { genre: regex }, { authors: regex }]
            });
        } else {
            books = await Book.find();
        }
        res.json(books);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: "Book not found" });
        res.json(updatedBook);
    } catch(err) { res.status(400).json({ message: err.message }); }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: "Book not found" });
        res.json({ message: "Book deleted successfully" });
    } catch(err) { res.status(500).json({ message: err.message }); }
});

// ─── LOAN ROUTES ──────────────────────────────────────────────

// ยืมหนังสือ
app.post('/loans', async (req, res) => {
    try {
        // เช็คว่าหนังสือมีอยู่มั้ย
        const book = await Book.findById(req.body.bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        // เช็คว่าหนังสือถูกยืมอยู่มั้ย
        const activeLoan = await Loan.findOne({ bookId: req.body.bookId, status: "borrowed" });
        if (activeLoan) return res.status(400).json({ message: "Book is already borrowed" });

        const loan = await new Loan(req.body).save();
        // populate ข้อมูลหนังสือกลับมาด้วย
        const populated = await loan.populate("bookId");
        res.status(201).json(populated);
    } catch(err) { res.status(400).json({ message: err.message }); }
});

// ดูรายการยืมทั้งหมด (filter by status ได้)
app.get('/loans', async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const loans = await Loan.find(filter)
            .populate("bookId")
            .sort({ borrowDate: -1 });
        res.json(loans);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

// คืนหนังสือ
app.put('/loans/:id/return', async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) return res.status(404).json({ message: "Loan not found" });
        if (loan.status === "returned") return res.status(400).json({ message: "Book already returned" });

        loan.status = "returned";
        loan.returnDate = new Date();
        await loan.save();

        const populated = await loan.populate("bookId");
        res.json(populated);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

// ─── REPORT ROUTES ────────────────────────────────────────────

// วันไหนมีคนยืมมากสุด
app.get('/reports/busiest-days', async (req, res) => {
    try {
        const result = await Loan.aggregate([
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$borrowDate" } },
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.json(result);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

// genre ไหนถูกยืมมากสุด/น้อยสุด
app.get('/reports/genre-borrow', async (req, res) => {
    try {
        const result = await Loan.aggregate([
            // join กับ books collection
            { $lookup: {
                from: "books",
                localField: "bookId",
                foreignField: "_id",
                as: "book"
            }},
            { $unwind: "$book" },
            { $group: {
                _id: "$book.genre",
                totalBorrows: { $sum: 1 },
                activeBorrows: { $sum: { $cond: [{ $eq: ["$status", "borrowed"] }, 1, 0] } }
            }},
            { $sort: { totalBorrows: -1 } }
        ]);
        res.json(result);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

// จำนวน book ต่อ genre (เดิม)
app.get('/reports/genre-count', async (req, res) => {
    try {
        const genreCount = await Book.aggregate([
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(genreCount);
    } catch(err) { res.status(500).json({ message: err.message }); }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));