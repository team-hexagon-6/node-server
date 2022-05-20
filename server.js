require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const client = require('./config/client');

const credentials = require('./middlewares/credentials');
const cors = require('cors');
const coresOptions = require('./config/corsOptions');
const verifyJWT = require('./middlewares/verifyJWT');

const multer = require('multer');

const PORT = process.env.PORT || 3500;

// prisma.connect();



// parsing the incoming data
app.use(credentials);
app.use(cors(coresOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());


// routes
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/site'));

// Routes with verifyJWT
app.use(verifyJWT)
app.use('/api', require('./routes/api/user'));
// add multipart file access
app.use(multer().array())
app.use('/api/test', require('./routes/api/test'));



// 404
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) return res.send({ error: '404|not found' });
    res.send('404|not found');
})



// start the server
client.$connect(app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}));


// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// })

// try {
//     client.$connect();
//     app.listen(PORT, () => {
//         console.log(`Server started on port ${PORT}`);
//     });
// } catch (error) {
//     console.log(error.message);
// }