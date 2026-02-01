import passport from "passport";
import {createGoogleStrategy,createGitHubStrategy,} from "./oauthStrategy.js";

// Register both strategies
passport.use("google", createGoogleStrategy());
passport.use("github", createGitHubStrategy());

// Required passport methods
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
