const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "shh"; // Consistency with the secret used in auth-router

function restricted(req, res, next) {
  const token = req.headers.authorization;
console.log(req.headers);
console.log(token);
  if (token) {
    console.log('testing');
    jwt.verify(token,  (err, decodedToken) => {
      console.log(err);
      if (err) {
        res.status(401).json({ message: "token invalid" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    console.log('HERE');
    res.status(401).json({ message: "token required" });
  }
}

module.exports = restricted;

