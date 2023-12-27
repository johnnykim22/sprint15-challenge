const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "shh"; // Consistency with the secret used in auth-router

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "token invalid" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}

module.exports = restricted;

