/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_ENV: string;
  readonly VITE_WEB_SOCKET_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
