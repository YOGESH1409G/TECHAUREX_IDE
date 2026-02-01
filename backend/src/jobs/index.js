// ====================== JOBS OVERVIEW ======================
// What are jobs:
// Jobs are automated background tasks that run on a schedule to perform maintenance, cleanup, synchronization, or periodic updates 
// without manual intervention. They help keep the system efficient, reliable, and performant.
//
// Why we use jobs:
// - To maintain data integrity (e.g., sync read receipts, lastSeen status)
// - To clean up unnecessary data (e.g., media files, expired messages, orphaned database entries)
// - To ensure real-time accuracy where needed (e.g., online presence)
// - To prevent performance degradation due to database bloat or stale connections
//
// When they run:
// - Jobs can run on different schedules depending on the task:
//     * Real-time or near real-time jobs: every 1–5 minutes (presence, lastSeen, read receipts)
//     * Periodic cleanup: hourly (message expiry) or daily/nightly (media cleanup, database cleanup)
// - Scheduling is chosen to balance system performance with accuracy and data freshness.
//
// ============================================================


// 1. cleanupMedia.job.js
// Description: Removes old or deleted media metadata from the database and optionally deletes the actual files from Cloudinary or S3 to free up storage space.
// Rationale: Media files do not require immediate cleanup. Running this job once a day (preferably during off-peak hours, e.g., nightly) ensures unused files and metadata are removed efficiently without impacting system performance.
// Additional Notes: Can include checks for media usage, expiration dates, or orphaned references before deletion. Useful for controlling storage costs and database bloat.

// 2. presenceSweep.job.js
// Description: Removes stale socket connections and cleans up ghost or idle users from the online presence tracking system to maintain accurate real-time user status.
// Rationale: Online presence data needs to be up-to-date. Running this job every few minutes (e.g., 1–5 minutes) ensures that users who disconnected unexpectedly or lost network connectivity are removed promptly.
// Additional Notes: Helps prevent showing users as online when they are not, and ensures messaging and notifications behave correctly in real-time applications.

// 3. readReceipts.job.js
// Description: Ensures any missed read receipts or message status updates are synchronized in the database so that “seen” indicators remain correct.
// Rationale: Read receipts do not require instant processing. Running this job every 2–5 minutes keeps the “seen” statuses mostly real-time while avoiding excessive load on the database.
// Additional Notes: Useful for reconciling missed updates due to temporary network issues or client-side offline behavior. Can be optimized to process only recent or unsynced messages.

// 4. messageExpiry.job.js
// Description: Deletes ephemeral messages or messages older than a defined TTL (time-to-live) to prevent the database from growing excessively.
// Rationale: Messages that are expired or ephemeral do not need immediate deletion. Running this job hourly ensures the database stays clean while minimizing performance impact.
// Additional Notes: Important for apps with disappearing messages, temporary chats, or strict data retention policies. Can be combined with logging for auditing purposes before deletion.

// 5. lastSeenSync.job.js
// Description: Updates the `lastSeen` timestamps for users who disconnected improperly (e.g., app crash, sudden network loss) to maintain accurate online/offline status indicators.
// Rationale: Frequent synchronization ensures that online/offline status remains reliable. Running this job every few minutes (e.g., 1–5 minutes) prevents stale or incorrect presence indicators.
// Additional Notes: Can be combined with presenceSweep for consistency. Helps improve user experience in messaging and presence-aware features.

// 6. databaseCleanup.job.js
// Description: Removes orphaned references, temporary data, cache entries, or logs in the database to keep it clean, performant, and maintainable.
// Rationale: Cleanup tasks that do not require immediate execution can run periodically or daily to ensure database health without impacting runtime performance.
// Additional Notes: Can include pruning old logs, removing temporary sessions, clearing incomplete transactions, or archiving old records. Helps prevent long-term data bloat and maintain query performance.
