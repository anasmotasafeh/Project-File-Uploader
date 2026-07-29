// src/config/passport.js
import passport from "passport";
import { Strategy } from "passport-local";
import { getUserByEmail, getUserById } from "../services/userService.js";
import bcryptjs from "bcryptjs";

const verifyCallbackFunction = async (email, password, done) => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return done(null, false);
    }

    const passwordMatches = await bcryptjs.compare(password, user.password);
    if (!passwordMatches) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use(new Strategy({ usernameField: "email" }, verifyCallbackFunction));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await getUserById(userId);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
