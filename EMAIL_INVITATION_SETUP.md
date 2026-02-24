# Email Invitation System - Setup Guide

## ✅ Implementation Complete!

The room invitation system with Brevo email integration has been successfully implemented. Here's what was done:

### 🎯 Features Implemented

1. **Backend Infrastructure:**
   - ✅ Fixed route mismatch (`POST /api/v1/rooms` now works)
   - ✅ Created email service with HTML-formatted invitation emails
   - ✅ Created Invitation model with 7-day expiry tracking
   - ✅ Implemented `POST /api/v1/rooms/join` endpoint
   - ✅ Enhanced room creation to support email invitations

2. **Frontend Features:**
   - ✅ Added "Invite by Email" toggle in 1:1 room creation
   - ✅ Email input field with validation
   - ✅ Beautiful success message showing room code
   - ✅ Created `/join-room` landing page for invitation links
   - ✅ Auto-join flow after signup/login
   - ✅ Updated SignupPage to handle invitation redirects

3. **Email Features:**
   - ✅ Professional HTML email template with TechAurex branding
   - ✅ "Join Room" button with auto-join link
   - ✅ Room code prominently displayed for manual entry
   - ✅ 7-day expiry notice
   - ✅ Plain text fallback for email clients
   - ✅ Welcome email after joining (optional)

---

## 🚀 Setup Instructions

### Step 1: Get Your Brevo API Key

1. **Sign up for Brevo (Free Account):**
   - Go to: https://www.brevo.com/
   - Click "Sign up free"
   - Complete registration

2. **Generate API Key:**
   - Log in to your Brevo dashboard
   - Go to: **Settings** → **API Keys** (or visit https://app.brevo.com/settings/keys/api)
   - Click **"Generate a new API key"**
   - Give it a name (e.g., "TechAurex Production")
   - Copy the API key (it will look like: `xkeysib-xxxxxxxxxxxxx`)

3. **Update `.env` file:**
   ```bash
   # In /Users/yogesh/IDE_PROJECT/backend/.env
   # Replace this line:
   BREVO_API_KEY=your_brevo_api_key_here
   
   # With your actual key:
   BREVO_API_KEY=xkeysib-your-actual-key-here
   ```

4. **Optional: Customize sender email:**
   ```bash
   # If you want to use a different sender email:
   BREVO_SENDER_EMAIL=noreply@yourdomain.com
   BREVO_SENDER_NAME=Your App Name
   ```
   **Note:** Free Brevo accounts can only send from verified email addresses. To verify:
   - Go to **Senders & IP** in Brevo dashboard
   - Add and verify your email address
   - Or use the default Brevo email (no verification needed)

---

## 🧪 Testing the Email System

### Test 1: Send an Invitation

1. **Start backend and frontend:**
   ```bash
   # Terminal 1
   cd /Users/yogesh/IDE_PROJECT/backend
   node server.js
   
   # Terminal 2
   cd /Users/yogesh/IDE_PROJECT/frontend
   npm run dev
   ```

2. **Create a 1:1 room with email invitation:**
   - Log in to your account
   - Click "Create Room"
   - Select "1:1"
   - Click "📧 Email Invite" tab
   - Enter your friend's email (or your own test email)
   - Click "Send Invitation"

3. **Check the email:**
   - Open the recipient's inbox
   - You should see: "TechAurex IDE - Room Invitation"
   - Email contains:
     - Professional HTML layout
     - "Join Room Now" button
     - Room code in large text
     - Instructions and 7-day expiry notice

### Test 2: Join Room via Email Link

1. **Click "Join Room Now" button** in email
2. **If not logged in:**
   - Redirects to signup page
   - Email pre-filled
   - After signup → automatically joins room
3. **If already logged in:**
   - Automatically joins room
   - Redirects to editor

### Test 3: Manual Room Code Entry

1. Copy room code from email
2. Go to app → Click "Join Room"
3. Enter room code
4. Click "Join"

---

## 📧 Email Template Preview

The invitation email includes:

```
┌─────────────────────────────────────┐
│       TechAurex IDE                 │
│   Collaborative Coding Platform     │
├─────────────────────────────────────┤
│                                     │
│   You're Invited! 🎉                │
│                                     │
│   [Name] has invited you to join   │
│   a collaborative coding room.      │
│                                     │
│   ┌─────────────────────────┐      │
│   │   [Join Room Now]       │      │
│   └─────────────────────────┘      │
│                                     │
│   Room Code:                        │
│   ╔═══════════╗                    │
│   ║ abc123x   ║                    │
│   ╚═══════════╝                    │
│                                     │
│   How to Join:                      │
│   1. Click button above             │
│   2. Sign up (if needed)            │
│   3. Start collaborating!           │
│                                     │
│   ⏰ Expires in 7 days               │
└─────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Problem: "Failed to send invitation email"

**Solution:**
1. Check Brevo API key in `.env` file
2. Verify backend can access environment variables:
   ```bash
   cd /Users/yogesh/IDE_PROJECT/backend
   node -e "require('dotenv').config(); console.log(process.env.BREVO_API_KEY)"
   ```
3. Check backend logs for detailed error message
4. Verify Brevo account is active and not rate-limited

### Problem: "Email not received"

**Solution:**
1. Check spam/junk folder
2. Verify recipient email is correct
3. Check Brevo dashboard → **Logs** → **Email Activity**
4. Free Brevo accounts have limits: 300 emails/day

### Problem: "Invitation expired"

**Solution:**
- Invitations expire after 7 days
- Ask room creator to send a new invitation
- Or use room code manually if you still have it

### Problem: Room code doesn't work

**Solution:**
1. Verify code is exactly 7 characters (lowercase alphanumeric)
2. Check if room still exists
3. For private rooms, ensure you have a valid invitation

---

## 📊 Database Collections

The system uses these MongoDB collections:

### `invitations` Collection
```javascript
{
  _id: ObjectId,
  email: "friend@example.com",
  roomId: ObjectId (ref: Room),
  invitedBy: ObjectId (ref: User),
  roomCode: "abc123x",
  status: "pending", // or "accepted" or "expired"
  expiresAt: Date (7 days from creation),
  acceptedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Query Examples
```javascript
// Find all pending invitations for an email
db.invitations.find({ email: "user@example.com", status: "pending" })

// Clean up expired invitations (run as cron job)
db.invitations.updateMany(
  { expiresAt: { $lt: new Date() }, status: "pending" },
  { $set: { status: "expired" } }
)

// Check invitation acceptance rate
db.invitations.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

## 🎨 UI Flow

### Flow 1: Invite by Email (User doesn't exist)
```
Create Room → Select 1:1 → Email Invite → Enter email
     ↓
Backend creates room with 1 participant (you)
     ↓
Backend creates invitation record (pending)
     ↓
Backend sends Brevo email
     ↓
Success message: "Invitation sent! Room code: abc123x"
     ↓
Friend receives email → Clicks "Join Room Now"
     ↓
Redirects to signup with pre-filled email
     ↓
After signup → Auto-joins room
```

### Flow 2: Invite by Email (User exists)
```
Create Room → Select 1:1 → Email Invite → Enter email
     ↓
Backend checks: Email exists in Users collection
     ↓
Backend adds to your contacts (if not already)
     ↓
Backend creates room with both users (both approved)
     ↓
Success message: "Room created!"
     ↓
Navigate to chat with friend
```

### Flow 3: Join by Room Code
```
User clicks "Join Room" → Enters code → Submits
     ↓
Backend validates: Room exists, code matches
     ↓
If private room: Check valid invitation
     ↓
Add user to room.participants
     ↓
Update user.rooms array
     ↓
Success: Navigate to editor/chat
```

---

## 🔐 Security Features

1. **Email Validation:**
   - Frontend: Regex validation
   - Backend: Mongoose email validator

2. **Invitation Expiry:**
   - Auto-expires after 7 days
   - Checked on every join attempt
   - Status updated to "expired"

3. **Private Room Protection:**
   - Requires valid invitation to join
   - Invitation must be:
     - Pending status
     - Not expired
     - Matching user's email

4. **Rate Limiting:**
   - Backend has rate limiting middleware
   - Brevo free tier: 300 emails/day

---

## 📈 Next Steps (Future Enhancements)

These features can be added later:

1. **Invitation Management:**
   - Resend invitation
   - Revoke invitation
   - View pending invitations

2. **Email Templates:**
   - Customizable email templates
   - Different templates for 1:1 vs group
   - Branded email footer with links

3. **Advanced Features:**
   - Email verification before signup
   - Bulk invite multiple users
   - Invitation analytics dashboard

4. **Scheduled Cleanup:**
   - Cron job to mark expired invitations
   - Auto-delete old invitations
   - Notification for expiring invitations

---

## 🎉 You're All Set!

Your room invitation system is ready to use. Just add your Brevo API key to the `.env` file and restart the backend server.

**Quick Start:**
```bash
# 1. Add your Brevo API key to backend/.env
# 2. Restart backend
cd /Users/yogesh/IDE_PROJECT/backend
node server.js

# 3. Test invitation flow!
```

If you encounter any issues, check the troubleshooting section or review the backend logs.

Happy coding! 🚀
