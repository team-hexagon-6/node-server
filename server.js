require('dotenv').config();
const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());


// routes


// start the server
