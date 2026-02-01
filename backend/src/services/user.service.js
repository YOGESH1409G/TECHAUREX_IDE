import User from "../models/user.model.js";
import Contact from "../models/contact.model.js";
import logger from "../config/logger.js";

export async function getUserContacts(userId) {
  try {
    const user = await User.findById(userId)
      .populate("contacts") // load contacts only for this user
      .exec();

    if (!user) throw new Error("User not found");

    return user.contacts;
  } catch (error) {
    throw new Error("Failed to fetch contacts: " + error.message);
  }
}

export async function addUserContact(loggedInUserId, contactData) {
  try {
    const { email, username, phone } = contactData;

    // Ensure at least one identifier is provided
    if (!email && !username && !phone) {
      throw new Error("Please provide at least one identifier: email, username, or phone");
    }

    // Find the target user by email OR username OR phone
    const targetUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (!targetUser) {
      throw new Error("Target user not found by email, username, or phone");
    }

    // Fetch the logged-in user
    const loggedInUser = await User.findById(loggedInUserId);
    if (!loggedInUser) {
      throw new Error("Logged-in user not found");
    }

    // Check if contact already exists for this logged-in user
    const existingContact = await Contact.findOne({
      user: targetUser._id,
      _id: { $in: loggedInUser.contacts },
    });

    if (existingContact) {
      logger.info(`Contact already exists: ${targetUser.username}`);
      return existingContact;
    }

    // Create new contact
    const newContact = await Contact.create({
      user: targetUser._id,      // Target user's id
      username: targetUser.username,
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
    });

    // Add reference to logged-in user's contacts array
    loggedInUser.contacts.push(newContact._id);
    await loggedInUser.save();

    logger.info(`New contact added: ${targetUser.username} for user ${loggedInUser.username}`);

    return newContact;

  } catch (error) {
    logger.error(`Failed to add contact: ${error.message}`, { error });
    throw new Error("Failed to add contact: " + error.message);
  }
}


export const UserService = {
  getUserContacts,
  addUserContact,
};
