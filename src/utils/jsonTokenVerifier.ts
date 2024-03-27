import { User } from "../schema/userSchema";
import jwt from "jsonwebtoken";

const getAndVerifyUser = async (token: string) => {
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
  } finally {
    return undefined;
  }
};

export default getAndVerifyUser;
