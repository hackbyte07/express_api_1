import { NextFunction } from "express";
import { User } from "../schema/userSchema";
import jwt from "jsonwebtoken";

const getAndVerifyUser = async (token: string, next: NextFunction) => {
  try {
    const decodeData = jwt.verify(
      token,
      `${process.env.jwtSecretKey}`
    ) as jwt.JwtPayload;

    const email = decodeData.email as string;

    const user = await User.findOne({ email: email }).exec();

    if (user) {
      if (user.token === token) {
        return user;
      }
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
};

export default getAndVerifyUser;
