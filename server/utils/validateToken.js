const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) {
            res.status(401).send({
                message: "Unauthorized!",
                success: false,
            });
        } else {
            const token = authHeader?.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(401).send({
            message: "Unauthorized!",
            success: false,
        });
    }
};