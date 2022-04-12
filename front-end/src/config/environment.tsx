export const ENVIRONMENT =
  typeof document !== "undefined"
    ? (document.querySelector('[name="environment"]') as HTMLMetaElement)
        ?.content || "local"
    : "local";
