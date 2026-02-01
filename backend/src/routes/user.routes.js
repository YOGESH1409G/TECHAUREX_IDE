import express from "express";
import { viewContacts , addContact} from "../controllers/user.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Fetch user contacts
router.get("/contacts",protectAuth, viewContacts);
router.post("/contacts", protectAuth, addContact);

export default router;
