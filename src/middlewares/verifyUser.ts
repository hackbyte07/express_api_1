import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import lodash from "lodash";

const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      const decoded = jwt.verify(token, `${process.env.jwtSecretKey}`);
      if (!lodash.isString(decoded)) {
        const email: string = decoded.email;
        const user = await User.findOne({ email: email }).exec();
        if (user?.token === token) {
          res.locals.user = user;
          return next();
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "user not known",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Unknown error",
    });
  }
};

export default verifyUser;
