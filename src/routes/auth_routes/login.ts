import { Router } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/userModel";

const router = Router();

const login = router.post("/login", async (req, res) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    if (email.length < 1) {
      return res.status(400).send("email is not valid");
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send("password must be greater than or equal to 6 digits");
    }

    const existingUser = await User.findOne({ email: email }).exec();

    let verifyPassword;
    if (existingUser) {
      verifyPassword = await bcrypt.compare(
        password,
        existingUser?.password as string
      );
    }

    if (!existingUser || !verifyPassword) {
      return res.status(400).send("wrong credentils");
    }

    const token = jwt.sign(
      {
        email: email,
      },
      `${process.env.jwtSecretKey}`
    );

    await existingUser.updateOne({ token: token });
    return res.status(200).json({
      success: true,
      email: email,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error)
  }
});

export default login;
