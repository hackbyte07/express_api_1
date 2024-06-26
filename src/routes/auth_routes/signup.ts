import { Router } from "express";

import bcrypt from "bcrypt";

import { UUID } from "mongodb";
import { User } from "../../models/userModel";
import sendMail from "../../utils/mailSender";

const router = Router();

const signup = router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;
    if (name.length < 1) {
      return res.status(400).send("name is not valid");
    }
    if (email.length < 1) {
      return res.status(400).send("email is not valid");
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send("password must be greater than or equal to 6 digits");
    }

    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      return res.status(400).send("User email exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 2);

    const newUser = new User({
      id: UUID.generate().toString(),
      name,
      email,
      password: hashedPassword,
      token: "",
    });

    await newUser.save();

    sendMail(email);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

export default signup;
