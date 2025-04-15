const jwt = require('jsonwebtoken');


const jwt_secret = 'UmairAhmed';

const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');

    if (!token) {
        return res.status(400).json({ error: "Please Login with right Credentials: " })
    }

    try {
        const data = jwt.verify(token, jwt_secret);
        //extract user id from data(above) since we have added user id in the jwt sign

        //appending user's id to reqest.user so that we can access it further
        req.user = data.user;

        //for continueing/sending the request to other middle_ware
        next();

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send('internal server error');  // Send an error response
    }
};

module.exports = fetchuser;