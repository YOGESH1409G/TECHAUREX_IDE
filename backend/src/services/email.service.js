// services/email.service.js
import * as brevo from '@getbrevo/brevo';
import { loadEnv } from '../config/env.js';

const env = loadEnv();

// Initialize Brevo API client
let apiInstance = null;

function initializeBrevoClient() {
  if (!apiInstance && env.BREVO_API_KEY) {
    apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = env.BREVO_API_KEY;
  }
  return apiInstance;
}

/**
 * Send room invitation email to a user
 * @param {string} recipientEmail - Email address of the person being invited
 * @param {string} roomCode - 7-character room code
 * @param {string} inviterName - Name of the person sending invitation
 * @param {string} roomId - Room ID for tracking
 * @returns {Promise<object>} Brevo API response
 */
export async function sendRoomInvitation(recipientEmail, roomCode, inviterName, roomId) {
  try {
    console.log('📧 Attempting to send invitation email...');
    console.log('   Recipient:', recipientEmail);
    console.log('   Room Code:', roomCode);
    console.log('   Inviter:', inviterName);
    
    const client = initializeBrevoClient();
    
    if (!client) {
      const error = new Error('Brevo API client not initialized. Check BREVO_API_KEY.');
      console.error('❌ Brevo client initialization failed');
      throw error;
    }
    
    console.log('✅ Brevo client initialized');

    const joinUrl = `${env.CLIENT_URL}/join-room?code=${roomCode}&email=${encodeURIComponent(recipientEmail)}`;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Room Invitation - TechAurex</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">TechAurex IDE</h1>
              <p style="margin: 10px 0 0; color: #f0f0f0; font-size: 14px;">Collaborative Coding Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">You're Invited! 🎉</h2>
              
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join a collaborative coding room on TechAurex IDE.
              </p>
              
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Click the button below to join the room and start coding together in real-time!
              </p>
              
              <!-- Join Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                <tr>
                  <td align="center">
                    <a href="${joinUrl}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      Join Room Now
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Room Code Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #333333; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Room Code
                </p>
                <p style="margin: 0; color: #667eea; font-size: 32px; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                  ${roomCode}
                </p>
                <p style="margin: 10px 0 0; color: #777777; font-size: 13px; line-height: 1.5;">
                  You can also join manually by entering this code in the "Join Room" section.
                </p>
              </div>
              
              <!-- Instructions -->
              <div style="background-color: #fff9e6; border: 1px solid #ffd966; padding: 16px; margin: 0 0 30px; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #333333; font-size: 14px; font-weight: 600;">
                  📝 How to Join:
                </p>
                <ol style="margin: 0; padding-left: 20px; color: #555555; font-size: 14px; line-height: 1.8;">
                  <li>Click the "Join Room Now" button above</li>
                  <li>If you don't have an account, sign up (it's free!)</li>
                  <li>You'll be automatically added to the room</li>
                  <li>Start collaborating in real-time!</li>
                </ol>
              </div>
              
              <!-- Expiry Notice -->
              <p style="margin: 0 0 20px; color: #999999; font-size: 13px; line-height: 1.6;">
                ⏰ This invitation expires in <strong>7 days</strong>. Make sure to join before it expires!
              </p>
              
              <!-- Support -->
              <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                Need help? Visit our <a href="${env.CLIENT_URL}/help" style="color: #667eea; text-decoration: none;">Help Center</a> or contact support.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                © 2026 TechAurex IDE. All rights reserved.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                You received this email because ${inviterName} invited you to join a room.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const plainTextContent = `
TechAurex IDE - Room Invitation

You're Invited!

${inviterName} has invited you to join a collaborative coding room on TechAurex IDE.

Room Code: ${roomCode}

Join now: ${joinUrl}

How to Join:
1. Click the link above or visit ${env.CLIENT_URL}
2. If you don't have an account, sign up (it's free!)
3. Enter the room code: ${roomCode}
4. Start collaborating in real-time!

This invitation expires in 7 days.

Need help? Visit ${env.CLIENT_URL}/help or contact support.

© 2026 TechAurex IDE. All rights reserved.
    `.trim();

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: env.BREVO_SENDER_NAME,
      email: env.BREVO_SENDER_EMAIL,
    };
    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.subject = `${inviterName} invited you to join a TechAurex room`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = plainTextContent;
    sendSmtpEmail.headers = {
      'X-Room-ID': roomId,
      'X-Room-Code': roomCode,
    };

    console.log('📤 Sending email via Brevo API...');
    const response = await client.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Room invitation email sent successfully:', {
      recipientEmail,
      roomCode,
      messageId: response.messageId,
    });
    
    return response;
  } catch (error) {
    console.error('❌ Failed to send room invitation email:', error);
    console.error('   Error details:', {
      message: error.message,
      response: error.response?.body,
      status: error.response?.status,
    });
    throw new Error(`Email service error: ${error.message}`);
  }
}

/**
 * Send welcome email after user joins a room
 * @param {string} recipientEmail - Email address
 * @param {string} userName - User's name
 * @param {string} roomName - Room name
 * @returns {Promise<object>} Brevo API response
 */
export async function sendWelcomeEmail(recipientEmail, userName, roomName) {
  try {
    const client = initializeBrevoClient();
    
    if (!client) {
      console.warn('Brevo API client not initialized. Skipping welcome email.');
      return null;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TechAurex</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to TechAurex! 🎉</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px;">Hi ${userName},</h2>
              
              <p style="margin: 0 0 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                You've successfully joined <strong>${roomName}</strong>! You can now collaborate with your team in real-time.
              </p>
              
              <p style="margin: 0 0 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                Start coding, share your ideas, and build amazing things together!
              </p>
              
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                <tr>
                  <td align="center">
                    <a href="${env.CLIENT_URL}/editor" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      Go to Editor
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © 2026 TechAurex IDE. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: env.BREVO_SENDER_NAME,
      email: env.BREVO_SENDER_EMAIL,
    };
    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.subject = `Welcome to ${roomName} on TechAurex!`;
    sendSmtpEmail.htmlContent = htmlContent;

    const response = await client.sendTransacEmail(sendSmtpEmail);
    
    console.log('Welcome email sent successfully:', {
      recipientEmail,
      messageId: response.messageId,
    });
    
    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw error for welcome emails, just log it
    return null;
  }
}
