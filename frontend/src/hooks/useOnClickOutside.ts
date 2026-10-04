import { useEffect, useRef, type RefObject } from "react";

export type UseOnClickOutsideOptions = {
  enabled?: boolean;
  listenForEscape?: boolean;
};

/**
 * Hook that detects clicks outside of the referenced element or pressing Escape.
 *
 * @param ref - Ref object pointing to the element to watch
 * @param handler - Callback invoked when an outside click or Escape key occurs
 * @param optionsOrEnabled - Boolean `enabled` flag or options object
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent | KeyboardEvent) => void,
  optionsOrEnabled: boolean | UseOnClickOutsideOptions = true,
): void {
  const enabled =
    typeof optionsOrEnabled === "boolean"
      ? optionsOrEnabled
      : (optionsOrEnabled.enabled ?? true);

  const listenForEscape =
    typeof optionsOrEnabled === "object"
      ? (optionsOrEnabled.listenForEscape ?? true)
      : true;

  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      savedHandler.current(event);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        savedHandler.current(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    if (listenForEscape) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (listenForEscape) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [ref, enabled, listenForEscape]);
}
