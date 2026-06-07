// Minimal global JSX and module declarations to support builds where @types/react
// may not be installed (for some CI/CD environments).
export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "react";
declare module "react/jsx-runtime";
