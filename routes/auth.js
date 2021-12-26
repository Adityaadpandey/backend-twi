const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchUser = require("../middleware/fetchUser");
const JWT_SECRECT = "Aditya";

//  Create a User using: POST "/api/auth". Does't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //  if there are errors return Bad request and the error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //  check whether the user exists in the database
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists." });
      }
      // Salting
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //  using jwt token
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRECT);
      // console.log(jwtData)
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occurred");
    }
  }
);

//  Create a User using: POST "/api/login". Does't require auth
router.post(
  "/login",
  [
    body("password", "Password Cannot be blank").exists(),
    body("email", "Enter a valid Email").isEmail(),
  ],
  async (req, res) => {
    //  if there are errors return Bad request and the error message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ errors: "Please try to login with correct Credential" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res
          .status(404)
          .json({ success, errors: "Please try to login with correct Credential" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRECT);
      success = true
      // console.log(jwtData)
      res.json({success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Enternal sever error");
    }
  }
);

// Route 3 :  Get loggedin User Deatails using: Post "/api/auth/getuser". Login Required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password").select("-date").select("-_id").select("-__v");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Enternal sever error");
  }
});

module.exports = router;
