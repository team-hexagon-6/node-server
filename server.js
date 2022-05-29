require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const client = require('./config/client');

// middlewares
const credentials = require('./middlewares/credentials');
const cors = require('cors');
const coresOptions = require('./config/corsOptions');
const verifyJWT = require('./middlewares/verifyJWT');
const verifyComProf = require('./middlewares/verifyComProf');

const multer = require('multer');

const PORT = process.env.PORT || 3500;


// parsing the incoming data
app.use(credentials);
app.use(cors(coresOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie parser middleware
app.use(cookieParser());


// routes
app.use('/', require('./routes/site'));
app.use('/auth', require('./routes/auth'));

// Routes with verifyJWT
app.use('/api/user', verifyJWT, require('./routes/api/user'));
// routes with verifyComProf complete proifile
app.use('/api/patient', verifyJWT, verifyComProf, require('./routes/api/patient'));
// add multipart file access
app.use(multer().array())
app.use('/api/test', verifyJWT, verifyComProf, require('./routes/api/_test'));


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
