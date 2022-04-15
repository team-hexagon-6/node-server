require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const client = require('./database/client');
// const client = PrismaClient()

const PORT = process.env.PORT || 3500;

// prisma.connect();


// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());


// routes
app.use('/', require('./routes/site'));
app.use('/auth', require('./routes/auth'));

// Routes with verifyJWT
// app.use(verifyJWT)
app.use('/api', require('./routes/api/user'));



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