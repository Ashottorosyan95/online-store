const jwt = require('jsonwebtoken');

 function fetchUser (authHeader)  {
    const token = authHeader?.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return user;
}

module.exports = fetchUser;