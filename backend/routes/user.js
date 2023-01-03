const { User } = require("../schemas/user");
const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
// self authentication
// const authentication = require("./authentication/auth");
const passport = require("passport");
const mongoose = require("mongoose");

const getUserByEmail = async (Email) => {
  return await User.find({ Email: Email });
};

userRouter.get(
  `/`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const usersList = await User.find();

    if (!usersList) {
      res.status(500).json({ success: false });
    }
    res.send(usersList);
  }
);

userRouter.post("/login", async (req, res) => {
  // Destructure Email and Password from request body
  const { Email, Password } = req.body;

  // Search for user with specified Email
  let loginDetails = await getUserByEmail(Email);

  if (loginDetails.length > 0) {
    if (loginDetails[0].Password === Password) {
      const accessToken = jwt.sign(
        {
          Email: loginDetails[0].Email,
          role: loginDetails[0].role,
          id: loginDetails[0]._id,
        },
        process.env.ACCESS_TOKEN
      );
      return res.json({
        accessToken: accessToken,
        loginDetails,
        success: true,
      });
    } else {
      return res.json({
        success: false,
        message: "Password Not Valid",
      });
    }
  }
  return res.json({
    error: true,
    message: "User Not Found",
  });
});

userRouter.post("/signUp", async (req, res) => {
  const { Email, Password, role, createdBy } = req.body;

  // Search for user with specified Email
  let loginDetails = await getUserByEmail(Email);
  if (loginDetails.length > 0) {
    return res.send({
      error: true,
      message: "User Already Exist",
    });
  }
  let user = new User({
    Email,
    Password,
    role,
    createdBy,
  });
  let data = await user.save();
  if (!data) {
    return res.status(400).send("user not created!");
  } else {
    res.send(data);
  }
});

userRouter.post(
  "/addMember",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { Email, Password, createdBy } = req.body;

    // Search for user with specified Email
    let loginDetails = await getUserByEmail(Email);
    if (loginDetails.length > 0) {
      return res.send({
        error: true,
        message: "User Already Exist",
      });
    }
    let user = new User({
      Email,
      Password,
      createdBy,
    });
    let data = await user.save();
    if (!data) {
      return res
        .status(400)
        .send({ success: false, message: "Member not added!" });
    } else {
      res.send({
        success: true,
        data,
      });
    }
  }
);

userRouter.post(
  "/getMembers",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const usersList = await User.find({
      createdBy: req.body.id,
    });

    let newUsersList = [];
    usersList.map((user) => {
      let newObj = {
        Email: user.Email,
        role: user.role,
        id: user._id,
      };
      newUsersList.push(newObj);
    });

    if (!newUsersList) {
      res.status(500).json({ success: false });
    }
    res.send(newUsersList);
  }
);

userRouter.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = await User.findByIdAndRemove({
      _id: req.body.id,
    });

    if (user) {
      res.status(200).send({
        message: "Deleted SuccessFully!",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Member Not Deleted",
      });
    }
  }
);

module.exports = userRouter;
