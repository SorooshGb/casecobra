import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().nonempty(),
    KINDE_CLIENT_ID: z.string().nonempty(),
    KINDE_CLIENT_SECRET: z.string().nonempty(),
    KINDE_ISSUER_URL: z.string().nonempty(),
    KINDE_SITE_URL: z.string().nonempty(),
    KINDE_POST_LOGOUT_REDIRECT_URL: z.string().nonempty(),
    KINDE_POST_LOGIN_REDIRECT_URL: z.string().nonempty(),
    UPLOADTHING_TOKEN: z.string().nonempty(),
    STRIPE_SECRET_KEY: z.string().nonempty(),
    STRIPE_WEBHOOK_SECRET: z.string().nonempty(),
    RESEND_API_KEY: z.string().nonempty(),
    ADMIN_EMAIL: z.string().nonempty(),
  },
  experimental__runtimeEnv: true,
});
