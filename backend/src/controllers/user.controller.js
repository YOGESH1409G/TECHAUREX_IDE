import { UserService } from "../services/user.service.js";

// GET /user/contacts
export const viewContacts = async (req, res) => {
  try {
    const userId = req.user.id; // from Bearer token

    const contacts = await UserService.getUserContacts(userId);

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// POST /user/contacts
export const addContact = async (req, res) => {
  try {
    const loggedInUserId = req.user.id; // for storing in contacts array
    const contactData = req.body;

    const newContact = await UserService.addUserContact(loggedInUserId, contactData);

    return res.status(201).json({
      success: true,
      contact: newContact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
