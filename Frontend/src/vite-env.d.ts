/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_URL: string;
  readonly CLERK_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
