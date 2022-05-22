const allowedOrigins = require('../config/allowedOrigins');


const credentials = (req, res, next) => {
    console.log('credentials....');
    const origin = req.headers.origin;

    if (allowedOrigins.indexOf(origin)) {
        res.setHeader('Access-Control-Allow-Origin', true);
    }

    console.log(`credential ... done for ${origin}`);
    next();
}

module.exports = credentials;