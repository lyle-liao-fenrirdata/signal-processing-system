import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z
      .string()
      .regex(
        /^postgresql:\/\/[\w]{1,}:[\w]{1,}@[A-Za-z0-9\-\.\~\(\)\'\!\*\:\@\,\_\;\+\&\=\?\/\#\+\&\=]{1,}$/gm
      ),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_MAIN_NODE_URL: z.string().min(12),
    NEXT_PUBLIC_SWARM_PORT: z.string().min(2),
    NEXT_PUBLIC_HAPROXY_PORT: z.string().min(2),
    NEXT_PUBLIC_NETDATA_PORT: z.string().min(2),
    NEXT_PUBLIC_PORTAINER_PORT: z.string().min(2),
    NEXT_PUBLIC_KIBANA_PORT: z.string().min(2),
    NEXT_PUBLIC_ELASTIC_PORT: z.string().min(2),
    NEXT_PUBLIC_ARKIME_URL: z.string().min(12),
    NEXT_PUBLIC_ARKIME_PORT: z.string().min(2),
  },

  /**
   * If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually.
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_MAIN_NODE_URL: process.env.NEXT_PUBLIC_MAIN_NODE_URL,
    NEXT_PUBLIC_SWARM_PORT: process.env.NEXT_PUBLIC_SWARM_PORT,
    NEXT_PUBLIC_HAPROXY_PORT: process.env.NEXT_PUBLIC_HAPROXY_PORT,
    NEXT_PUBLIC_NETDATA_PORT: process.env.NEXT_PUBLIC_NETDATA_PORT,
    NEXT_PUBLIC_PORTAINER_PORT: process.env.NEXT_PUBLIC_PORTAINER_PORT,
    NEXT_PUBLIC_KIBANA_PORT: process.env.NEXT_PUBLIC_KIBANA_PORT,
    NEXT_PUBLIC_ELASTIC_PORT: process.env.NEXT_PUBLIC_ELASTIC_PORT,
    NEXT_PUBLIC_ARKIME_URL: process.env.NEXT_PUBLIC_ARKIME_URL,
    NEXT_PUBLIC_ARKIME_PORT: process.env.NEXT_PUBLIC_ARKIME_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  },

  /**
   * For Next.js >= 13.4.4, you only need to destructure client variables:
   */
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
