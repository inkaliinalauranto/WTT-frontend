/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_WS_BASE_URL: string;
    // Lisää tähän kaikki muut ympäristömuuttujat ja niille tyyppi
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
