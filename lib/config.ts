const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

export const getBaseUrl = () => {
  if (isDevelopment) return 'http://localhost:3000'
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'https://grospace.vercel.app' // fallback
}

export const config = {
  baseUrl: getBaseUrl(),
  isDevelopment,
  isProduction,
  kinde: {
    clientId: process.env.KINDE_CLIENT_ID!,
    clientSecret: process.env.KINDE_CLIENT_SECRET!,
    issuerUrl: process.env.KINDE_ISSUER_URL!,
    siteUrl: process.env.KINDE_SITE_URL || getBaseUrl(),
    postLogoutRedirectUrl: process.env.KINDE_POST_LOGOUT_REDIRECT_URL || getBaseUrl(),
    postLoginRedirectUrl: process.env.KINDE_POST_LOGIN_REDIRECT_URL || getBaseUrl(),
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
}

export default config
