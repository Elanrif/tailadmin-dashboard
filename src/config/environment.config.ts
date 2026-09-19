const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const API_URL = `${process.env.API_URL ?? "http://localhost:8081"}/api/v1`;

const environment = {
  env: process.env.ENV ?? "local",
  app: {
    name: process.env.APP_NAME ?? "Nextjs Starter Kit",
    url: APP_URL,
  },
  baseUrl: APP_URL,
  apiBaseUrl: `${APP_URL}/api`,
  apiProxyBase: `/api`,
  api: {
    backendUrl: process.env.API_URL ?? "http://localhost:8081",
    rest: {
      endpoints: {
        addresses: `${API_URL}/addresses`,
        comments: `${API_URL}/comments`,
        posts: `${API_URL}/posts`,
        users: `${API_URL}/users`,
        account: `${API_URL}/account`,
        auth: {
          register: `${API_URL}/auth/register`,
          login: `${API_URL}/auth/login`,
          logout: `${API_URL}/auth/logout`,
          forgotPassword: `${API_URL}/auth/forgot-password`,
          resetPassword: `${API_URL}/auth/reset-password`,
        },
      },
    },
  },
  auth: {
    // "legacy" (cookie de session Spring) | "keycloak" (OIDC via NextAuth)
    provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER ?? "legacy",
    secret: process.env.AUTH_SECRET,
    trustHost: process.env.AUTH_TRUST_HOST === "true",
    keycloak: {
      clientId: process.env.AUTH_KEYCLOAK_ID ?? "",
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET ?? "",
      issuer: process.env.AUTH_KEYCLOAK_ISSUER ?? "",
    },
  },
  pagination: {
    page: Number.parseInt(
      process.env.NEXT_PUBLIC_PAGINATION_DEFAULT_PAGE || "1",
    ),
    size: Number.parseInt(
      process.env.NEXT_PUBLIC_PAGINATION_DEFAULT_LIMIT || "10",
    ),
  },
  export: {
    maxSize: Number.parseInt(process.env.NEXT_PUBLIC_EXPORT_MAX_SIZE || "1000"),
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    uploadFolder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER ?? "nextjs-starter",
    secureDistribution:
      process.env.NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION || undefined,
    privateCdn: process.env.NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN === "true",
  },
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "noreply@example.com",
    resetTokenSecret: process.env.SMTP_RESET_TOKEN_SECRET,
  },
  log: {
    client: {
      level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
      output: process.env.NEXT_PUBLIC_LOG_OUTPUT || "console",
    },
    server: {
      file: {
        path: process.env.LOG_FILE_PATH,
      },
      level: process.env.LOG_LEVEL || "info",
      output: process.env.LOG_OUTPUT || "console",
    },
  },
} as const;

export default environment;
