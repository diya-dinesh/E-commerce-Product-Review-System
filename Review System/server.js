// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to MongoDB (adjust the connection URL)
mongoose.connect('mongodb://localhost:27017/reviews', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Review Schema
const reviewSchema = new mongoose.Schema({
    userName: String,
    userRating: Number,
    userReview: String,
});

// Create Review Model
const Review = mongoose.model('Review', reviewSchema);

// Routes
app.post('/submit-review', async (req, res) => {
    try {
        const { userName, userRating, userReview } = req.body;
        const newReview = new Review({
            userName,
            userRating,
            userReview,
        });
        await newReview.save();
        res.redirect('/display.html'); // Redirect to display page
    } catch (error) {
        res.status(500).send('Error saving review');
    }
});

app.get('/get-reviews', async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.json(reviews);
    } catch (error) {
        res.status(500).send('Error fetching reviews');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
