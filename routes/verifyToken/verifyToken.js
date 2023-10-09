const JWT = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers.cookie;
  console.log(token);
  if (token) {
    const header = token.split("=")[1];
    JWT.verify(header, process.env.JWT_SEC, async (err, payload) => {
      if (err) return res.status(403).json("Token is not valid");
      (req.userId = payload.id), (req.isAdmin = payload.isAdmin);
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userId === req.params.id || req.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that");
    }
  });
};
const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    console.log(req.isAdmin);
    if (req.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
