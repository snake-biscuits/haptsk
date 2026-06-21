import { InputChord, InputEvent } from "./input.js";


// globals
var controller_specs = {
  "DualShock4": {
    "id": "054c-09cc-Sony Interactive Entertainment Wireless Controller",
    "names.axes": {  // 6 axes
      0: "LS (Left Stick) X", 1: "LS (Left Stick) Y",
      2: "RS (Right Stick) X", 3: "RS (Right Stick) Y",
      4: "L2 (Left Trigger)", 5: "R2 (Right Trigger)"
    },
    "names.buttons": {  // 17 buttons
      0: "Cross", 1: "Circle", 2: "Square", 3: "Triangle",  // Face Buttons
      4: "L2 (Left Trigger)", 5: "R2 (Right Trigger)",
      6: "L1 (Left Bumper)", 7: "R1 (Right Bumper)",
      8: "Share", 9: "Options",
      10: "L3 (Left Stick)", 11: "R3 (Right Stick)",
      12: "Up", 13: "Down", 14: "Left", 15: "Right",  // D-Pad
      16: "PS"
    }
  },
  // https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API
  // https://gist.github.com/palmerj/586375bcc5bc83ccdaf00c6f5f863e86
  "Xbox360": {
    "id": null,  // idk
    "names.axes": {  // guessing; 6 axes?
      0: "Left Stick X", 1: "Left Stick Y",
      2: "Right Stick X", 3: "Right Stick Y",
      4: "Left Trigger (LT)", 5: "Right Trigger (RT)"
    },
    "names.buttons": {  // 15 buttons?
      0: "Up", 1: "Down", 2: "Left", 3: "Right",  // D-Pad
      4: "Start", 5: "Back",
      6: "Left Stick Button (LSB)", 7: "Right Stick Button (RSB)",
      8: "Left Bumper (LB)", 9: "Right Bumper (RB)",
      10: "Guide",
      11: "A", 12: "B", 13: "X", 14: "Y"  // Face Buttons
    }
  }
};


// TODO: controller connection handler functions
// -- including hooks to visualiser & input module
