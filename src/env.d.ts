// Minimal ambient declarations to avoid relying on dev-only `vite` types in CI

interface ImportMetaEnv {
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
declare module "*.scss";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
