// src/config/oauthStrategy.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { loadEnv } from "./env.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
} = loadEnv();

/* ------------------- Google Strategy ------------------- */
export const createGoogleStrategy = () =>
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const profileData = {
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value,
          provider: "google",
        };
        done(null, profileData);
      } catch (error) {
        done(error, null);
      }
    }
  );

/* ------------------- GitHub Strategy ------------------- */
export const createGitHubStrategy = () =>
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value ||
          profile._json?.email ||
          `${profile.username}@github-user.com`; // fallback if email hidden

        const profileData = {
          name: profile.displayName || profile.username,
          email,
          avatar: profile.photos?.[0]?.value,
          provider: "github",
        };
        done(null, profileData);
      } catch (error) {
        done(error, null);
      }
    }
  );
