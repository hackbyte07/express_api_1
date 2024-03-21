import { Router } from "express";
import { loginRoute } from "../routes";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../schema/userSchema";

const router = Router();

const login = router.post(loginRoute, async (req, res) => {
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

    const verifyPassword = bcrypt.compareSync(
      password,
      existingUser?.password as string
    );
    if (!existingUser || !verifyPassword) {
      return res.status(400).send("wrong credentils");
    }

    const token = jwt.sign(
      {
        email: email,
        password: password,
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
  }
});

export default login;
