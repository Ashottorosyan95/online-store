const fetchUser = require("./findUserByToken");

async function checkIsUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const user = await fetchUser(authHeader);
    if (user && user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only administrators can access this route.' });
    }
}

async function checkIsAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    const user = await fetchUser(authHeader);
    if (user && user.role === 'admin' || user.role === 'moderator') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Only administrators can access this route.' });
    }
}

module.exports = {
    checkIsUser,
    checkIsAdmin,
};