export const GAMEPAD_FOCUSED = "gpfocuswithin";

export interface ButtonEvent {
  detail: { buttonCode: number };
}

export const BTN_CODE = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  UP: 9,
  DOWN: 10,
  LEFT: 11,
  RIGHT: 12,
  SELECT: 13,
  START: 14,
  LEFT_ANALOG_CLICK: 15,
  RIGHT_ANALOG_CLICK: 16,
  GRIP_LEFT_TOP: 23,
  GRIP_LEFT_BOTTOM: 24,
  GRIP_RIGHT_TOP: 25,
  GRIP_RIGHT_BOTTOM: 26,
  MENU: 27,
  QUICK_ACCESS: 28,
};

export function onGamepadFocus(
  elem: HTMLDivElement,
  callback: (focused: boolean) => void
) {
  // Observe if someone mutates the class of the given element
  const observer = new MutationObserver(() => {
    // Set the item to selected if we see gamepad focus
    if (elem.classList.contains("cs-gp-focus")) {
      callback(true);
      return;
    }
    callback(false);
  });
  observer.observe(elem, {
    attributes: true,
    attributeFilter: ["class"],
    childList: false,
    characterData: false,
  });
}
