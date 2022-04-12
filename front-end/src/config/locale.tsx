export const locale_full =
  typeof window !== "undefined" ? window.navigator.language : "en";

export const locale = locale_full.split("-")[0] || "en";
