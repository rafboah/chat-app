require('dotenv').config();

const express = require('express');

// const test = require('./server.js')
const app = express();

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log('Port from .env', process.env.PORT);
    console.log(`Server running on port ${PORT}`);
});

// module.exports = test;