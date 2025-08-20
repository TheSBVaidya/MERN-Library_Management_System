const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const secret = process.env.JWT_SECRET;

function createToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.log("token verification failed: ", err);
    return null;
  }
}

function jwtAuth(req, resp, next) {
  // means that url does not need to be authorized
  const nonProtectedUrls = ["/members/login", "members/register"];
  if (nonProtectedUrls.indexOf(req.url) >= 0) {
    next();
    return;
  }

  if (!req.headers.authorization)
    resp.status(403).send("Unauthorized Access - No Authorization header");

  const [bearer, token] = req.headers.authorization.split(" ");

  const decoded = verifyToken(token);
  console.log("Incoming user token: ", decoded);

  if (!decoded) resp.status(403).send("Unauthorized Access - Invalid token");
  else {
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  }
}

module.exports = {
  createToken,
  jwtAuth,
};
