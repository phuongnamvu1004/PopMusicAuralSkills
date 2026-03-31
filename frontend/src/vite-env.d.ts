/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SPACE_ID: string
  readonly CDA_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.json' {
  const value: any;
  export default value;
}
