// models/invitation.model.js
import { Schema, model } from 'mongoose';

const InvitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomCode: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 7,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        // Set expiry to 7 days from now
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      },
      index: true,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
InvitationSchema.index({ email: 1, roomCode: 1 });
InvitationSchema.index({ roomId: 1, status: 1 });
InvitationSchema.index({ invitedBy: 1, status: 1 });

// Instance method to check if invitation is expired
InvitationSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Static method to find valid invitation
InvitationSchema.statics.findValidInvitation = async function (email, roomCode) {
  const invitation = await this.findOne({
    email: email.toLowerCase().trim(),
    roomCode,
    status: 'pending',
  });

  if (!invitation) {
    return null;
  }

  // Check if expired
  if (invitation.isExpired()) {
    invitation.status = 'expired';
    await invitation.save();
    return null;
  }

  return invitation;
};

// Static method to mark invitation as accepted
InvitationSchema.statics.acceptInvitation = async function (email, roomCode) {
  const invitation = await this.findValidInvitation(email, roomCode);
  
  if (!invitation) {
    return null;
  }

  invitation.status = 'accepted';
  invitation.acceptedAt = new Date();
  await invitation.save();
  
  return invitation;
};

// Static method to cleanup expired invitations (can be called by a cron job)
InvitationSchema.statics.cleanupExpired = async function () {
  const result = await this.updateMany(
    {
      expiresAt: { $lt: new Date() },
      status: 'pending',
    },
    {
      $set: { status: 'expired' },
    }
  );
  
  return result;
};

// Pre-save hook to ensure email is lowercase
InvitationSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

const Invitation = model('Invitation', InvitationSchema);

export default Invitation;
