import jwt from "jsonwebtoken";
import { Middleware } from "../types/request";

const secret = process.env.JWT_SECRET || "";
const tokenName = "bug-tracker-token";

const protect: Middleware = async (req, res, next) => {
  // If system doesn't support cookies, use authorization header
  const cookieToken = req.cookies[tokenName];
  const requestToken = cookieToken || req.headers.authorization?.split(" ")[1];

  if (requestToken) {
    try {
      const decoded = jwt.verify(requestToken, secret) as {
        id: string;
        admin: boolean;
      };

      req.user = decoded.id;
      req.admin = decoded.admin;

      next();
    } catch (err: any) {
      res.clearCookie(tokenName);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
