"use client";

import { useSyncExternalStore } from "react";

const INTRO_EVENT = "bt_intro_complete";
const INTRO_KEY = "bt_intro_shown";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(INTRO_EVENT, onStoreChange);
  return () => {
    window.removeEventListener(INTRO_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(
      (window as unknown as { __BT_INTRO_DONE?: boolean }).__BT_INTRO_DONE ||
        sessionStorage.getItem(INTRO_KEY)
    );
  } catch {
    // sessionStorage can throw in private mode / blocked storage.
    return Boolean((window as unknown as { __BT_INTRO_DONE?: boolean }).__BT_INTRO_DONE);
  }
}

/**
 * True once IntroPreloader has cleared (or was already seen this session).
 * Used to hold page entrance choreography until the splash is gone.
 */
export function useIntroComplete() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
