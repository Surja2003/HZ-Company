type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, options?: { props?: TrackProps }) => void;
  }
}

export function trackEvent(eventName: string, props?: TrackProps) {
  try {
    // Google Analytics (gtag)
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, props ?? {});
      return;
    }

    // Plausible
    if (typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible(eventName, props ? { props } : undefined);
    }
  } catch {
    // Never block UX on analytics.
  }
}
