// Google Analytics 4 measurement ID ("G-…"), set per environment with
// NEXT_PUBLIC_GA_MEASUREMENT_ID. While unset, no analytics script is loaded.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

// Only production builds report, so `next dev` sessions don't skew the data.
export const analyticsEnabled =
  process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID !== "";
