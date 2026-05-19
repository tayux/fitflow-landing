/**
 * Google Calendar Integration Stub
 *
 * To activate real Google Calendar sync, you need:
 * 1. A Google Cloud project with the Calendar API enabled
 * 2. OAuth 2.0 credentials (client ID + client secret)
 * 3. Set env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
 * 4. Store user refresh tokens in the DB after OAuth consent
 *
 * OAuth flow:
 *   GET /api/google-calendar/auth   → redirect to Google consent page
 *   GET /api/google-calendar/callback → exchange code for tokens, store in DB
 *   POST /api/google-calendar/event → create calendar event using stored token
 */
export default async function handler(req, res) {
  res.status(501).json({
    error: 'Google Calendar integration not yet configured.',
    instructions: [
      'Enable Google Calendar API in Google Cloud Console',
      'Add OAuth 2.0 credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)',
      'Set GOOGLE_REDIRECT_URI to your Vercel deployment URL + /api/google-calendar/callback',
      'Implement token storage in the users table',
    ],
  });
}
