# Setting up PostHog on Vercel

Based on the errors you're encountering, here's how to properly configure PostHog in your Vercel deployment:

## 1. Add Environment Variables to Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables"
5. Add the following environment variables:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Make sure to replace `your_posthog_project_api_key` with your actual PostHog project API key (not the personal API key).

## 2. Redeploy Your Application

After adding the environment variables, trigger a new deployment:

1. Go to the "Deployments" tab
2. Click "Redeploy" on your latest deployment

## 3. Verify Configuration

After deployment, check your browser's console for any PostHog-related errors:

- If you still see "PostHog was initialized without a token", double-check that your `NEXT_PUBLIC_POSTHOG_KEY` is correctly set in Vercel.
- If you see `ERR_BLOCKED_BY_CLIENT` errors, this is usually caused by ad blockers and privacy extensions in users' browsers, not an issue with your setup. These errors will appear even when PostHog is correctly configured.

## 4. Testing in Production

To verify if PostHog is working correctly:

1. Visit your deployed site in an incognito/private window without extensions
2. Check the PostHog dashboard to see if events are being captured
3. Look for page view events from your IP address

## Ad Blocker Considerations

Many users have ad blockers that will block PostHog requests. The code changes we made help handle this gracefully, but be aware that you'll never get 100% analytics coverage due to these privacy tools.

For users where analytics is critical, you might want to add a polite notice asking them to disable ad blockers on your site.
