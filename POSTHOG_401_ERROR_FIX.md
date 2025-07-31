# Fixing PostHog 401 (Unauthorized) Error on Vercel

You're seeing a 401 (Unauthorized) error from PostHog, which means the API key being used is either invalid or incorrectly configured. Follow these steps to resolve the issue:

## 1. Verify Your PostHog Project API Key

1. Go to [PostHog](https://app.posthog.com)
2. Navigate to "Project Settings" 
3. Go to "Project API Keys"
4. Copy the "Project API Key" (NOT the Personal API Key)

## 2. Update Environment Variables in Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/)
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Check if `NEXT_PUBLIC_POSTHOG_KEY` exists
   - If it does, click "Edit" and update it with the correct API key
   - If it doesn't, add a new variable with the name `NEXT_PUBLIC_POSTHOG_KEY` and the value being your PostHog Project API key

## 3. Check the PostHog Host Configuration

1. In Vercel, also verify you have `NEXT_PUBLIC_POSTHOG_HOST` set correctly
2. The value should be `https://us.i.posthog.com` (or your specific PostHog host if self-hosted)
3. If this variable doesn't exist, add it

## 4. Redeploy Your Application

1. After updating environment variables, go to "Deployments" 
2. Click "Redeploy" on your latest deployment
3. This will ensure your new environment variables are used

## 5. Important Notes

- The 401 error specifically means there's an authentication issue, not just that requests are being blocked
- Make sure you're using the **Project API Key**, not your personal API key
- Environment variables in Vercel are case-sensitive
- If you're using multiple environments (Production/Preview/Development), make sure the variables are set for all required environments

## 6. Testing After Deployment

After redeploying, you can verify if PostHog is working correctly by:

1. Opening your site in a private/incognito window (to avoid ad blockers)
2. Opening browser developer tools and checking the Network tab
3. Looking for requests to `posthog.com` - they should return 200 status codes, not 401
4. Checking your PostHog dashboard to see if events are being captured

If you continue to experience issues, you may need to contact PostHog support to verify if there are any issues with your account or API key.
