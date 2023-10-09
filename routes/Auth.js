const router = require("express").Router();
const User = require("../models/User.models.js");
const CryptoJs = require("crypto-js");
const JWT = require("jsonwebtoken");
//Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC),
  });

  try {
    const User = await newUser.save();
    res.status(201).json("User has been created");
  } catch (err) {
    res.status(500).json(err);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(401).json("Wrong credentials");
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const isSecured = hashedPassword.toString(CryptoJs.enc.Utf8);
    if (!isSecured) return res.status(401).json("Wrong credentials!");
    const token = JWT.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "30seconds" }
    );

    const { password, ...loginDetails } = user._doc;
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .send({ ...loginDetails, token });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
});
module.exports = router;
