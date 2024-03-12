const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
let db;
client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }
    console.log('Connected to MongoDB');
    db = client.db('mydatabase'); // Replace 'mydatabase' with your database name
});

// POST route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, password } = req.body;

    // Insert form data into MongoDB collection
    const collection = db.collection('users'); // Replace 'users' with your collection name
    collection.insertOne({ name, email, password }, (err, result) => {
        if (err) {
            console.error('Error inserting document:', err);
            res.status(500).send('Error submitting form');
            return;
        }
        console.log('Form data inserted successfully:', result.insertedId);
        res.send('Form submitted successfully!');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
