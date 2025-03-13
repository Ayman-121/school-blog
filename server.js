const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Parse JSON bodies

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Function to read posts from the JSON file
const readPostsFromFile = () => {
    const data = fs.readFileSync('data.json');
    return JSON.parse(data);
};

// Function to write posts to the JSON file
const writePostsToFile = (posts) => {
    fs.writeFileSync('data.json', JSON.stringify(posts, null, 2));
};

// Handle new post submission
app.post('/posts', (req, res) => {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date()
    };

    // Read existing posts
    const posts = readPostsFromFile();
    posts.push(newPost); // Add the new post to the array

    // Write updated posts back to the file
    writePostsToFile(posts);

    res.json(posts); // Send the updated posts back to the client
});

// Serve posts on the home page
app.get('/posts', (req, res) => {
    const posts = readPostsFromFile();
    res.json(posts); // Send posts as JSON
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});