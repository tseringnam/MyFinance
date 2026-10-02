import { defineAuth, secret } from '@aws-amplify/backend';

// Set APP_URL in Amplify Hosting before deployment (include trailing slash).
// Local sandboxes fall back to localhost. Google secrets belong in Amplify,
// never in this repository or a VITE_* environment variable.
const hostedUrl = process.env.AWS_APP_ID && process.env.AWS_BRANCH
  ? `https://${process.env.AWS_BRANCH}.${process.env.AWS_APP_ID}.amplifyapp.com/`
  : undefined;
const appUrl = process.env.APP_URL || hostedUrl || 'http://localhost:5173/';
if (!appUrl.endsWith('/') || !(appUrl.startsWith('https://') || appUrl === 'http://localhost:5173/')) {
  throw new Error('APP_URL must be an HTTPS URL ending in / (or http://localhost:5173/ for development).');
}
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['openid', 'email', 'profile'],
        attributeMapping: { email: 'email' },
      },
      callbackUrls: [appUrl],
      logoutUrls: [appUrl],
    },
  },
});
