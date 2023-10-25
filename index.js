const express = require('express');

// Creat an Express App
const app = express();

// Parse incoming requests to JSON
app.use(express.json);

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({extended: true}));

// '/' API Route
app.get('/', (req,res) => {
    res.status(200).json({message: "API is Running!"});
});

// PORT
const port = process.env.PORT || 8082;

// Listen for Connection
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});