# TODOs

## Decisions
 * Python
   - Controller: `PySDL2`
   - Output: `keyboard` (unmaintained)
   - UI: `PySide6` / `PyOpenGL`
 * C++
   - SDL2
     * Controller Support
     * can it create keyboard events?
     * can it render SVG-based UI?
 * Javascript
   - npm
     * [Gamepad API](https://github.com/carldanley/node-gamepad)
     * creating keyboard events?
     * ui?
   - web browser
     * [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
     * keyboard events are probably a huge security risk
     * HTML / SVG UI (**good for prototyping / web demo**)


## Marketting
 * WPM Tests
 * Video / GIF
 * Web Demo (embeddable?)
   - compile into single compressed `.js` w/ limited feature set
   - `virtual_keyboard.js` userscript?


## Research
 * How can a program emulate keypresses?
   - do we need polkit permissions?
     * how do we ask for them?
 * Window transparency
 * System Tray
   - wake on some user-specified input (e.g. gyro or swipe)
   - could wayland trigger a wake on popup? (`polkit` etc.)


## Goals
 * Virtual Keyboard Window
 * Controller Overlay
 * Compose UI buttons from `.html` / `.css` / `.svg`
 * Controller
   - Select Device
     * Scan & Rescan
   - Sensitivity
     * Absolute / Wander
     * Finger Range
   - Home Key Option(s)
     * Rest Above F/J (qwerty)
   - Dead Zone Settings
     * Per-Stick Round Blob?

> See: Readme.ThePlan for outline of functionality

### Accessiblity
 * Good Defaults are Good
   - *Just Works* out of the box
 * Not For Power Users
   - Document Well
     * Guides / Blog
     * Video Examples
     * Screenshots
   - Multiple stock configs
 * Config should be easy to save & share
   - versioned `.json` (`.jsonc` would be cool)
   - Cheatsheet Polyglot
     generate `.png` & append `.zip`
 * Per-finger variants on settings
   - Finger Thickness
   - Key Snapping
   - Copy from other finger
   - Apply to both fingers by default
 * Special Modes (could be toggles)
   - One Handed Binds
   - Lefty version (flip config across controller)
   - Rotated Keyboard

### Bonus
 * Touch / Click Inputs (on UI)
 * Gyro
   - Drift (calibration / dead zones)
 * Touchpad Swipes
 * Multiple Keyboard Layouts
   - Shape (alternate ui layout)
   - Key Order (remap keys & update visuals)
   - Tenkey
   - Flip Phone JP (one-handed)
 * Multiple Fingers
   - Chorded Keyboards (w/ accurate binds & configs)
   - Stenotype (chorded syllable IME)
 * Modal Layers / Chorded Inputs
   - L2 + Circle -> Undo etc.
   - R2 + Triangle -> Cycle Layout
 * Input History
 * Autocorrect
 * IME (romaji -> hiragana / katakana -> kanji)
   - needs database(s)
   - can we use some open source ones?
 * Mix & Match Configs
   - Should have priority / isolated segments
     * Per-Finger Settings
     * Per-Controller Settings
     * Modal Playlist
     * Layout Playlist
     * Chords / Hotkeys
 * Haptic Feedback
   - Feel / hear the click of keys
   - IDK if the PS tech of controller audio is available to PC
 * Macros
 * Hybrid Device
   - Mouse Outputs
   - Controller Passthrough
 * Easter Eggs
   - RSI Achievement Popup
   - Soundboard
   - Walkman
   - Vinyl Deck (record scratch & send media pause / play)
   - Rubik's Cube
   - Gyro Fidget Spinner
   - Typewritter w/ all the noises (clack clack clack ding)
   - Morse Code
     * Multiple Languages

> Basically a rich set of config options for users
> **All Config Options Should Be Available In UI**
> except maybe some really power user stuff / easter eggs
> `{ "silly": True }`


## Interface
 * Web
   - `.html`
   - `.css`
   - `.js`
   - `.svg` (Abstract 2D device representations)
   - `.usda` (3D Model w/ animation hooks)
 * SDL2 `.exe`
   - `SDL_GameController`
   - 2D UI
     * `.svg`?
     * `.css`?
   - OpenGL
     * `.usda`


## Resources
 * MDN
   - [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
 * GitHub
   - [carldanley/node-gamepad](https://github.com/carldanley/node-gamepad)


## References
 * rubenwardy's blog: [`SDL_GameController`](https://blog.rubenwardy.com/2023/01/24/using_sdl_gamecontroller/)
