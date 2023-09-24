import { useState, useEffect } from "react";
import {
  DESKTOP_BREAKPOINT,
  TABLET_BREAKPOINT,
  SMALL_MOBILE_BREAKPOINT,
} from "../utils/constants";
import { toPx } from "../utils/toPx";

export const DeviceType = {
  mobile: `(max-width: 425px)`,
};

export const useDeviceType = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      window?.addEventListener("resize", () => setMatches(media.matches));
      return () => {
        window?.removeEventListener("resize", () => setMatches(media.matches));
      };
    }
  }, [matches, query]);

  return matches;
};
