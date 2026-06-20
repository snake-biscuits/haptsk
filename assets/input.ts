// input chord windows
// logging input events
// trigger modifiers
// -- trigger + face combos
// mode toggles
// -- radial menus
// analogue commit threshold
// -- set a magnitude to apply at
// -- apply on release (need to detect release, velocity matters!)
// input history
// binds
// -- input queue -> actions
// rising / falling edge
// -- start updating UI before commiting to input / action


// Essential types
type integer = number;
type float = number;


// Gamepad API types
interface GamepadButton {
  pressed: boolean;
  value: float;  // [0..1] for analogue buttons
}
interface Gamepad {
  buttons: GamepadButton[];
  axes: float[];
}


// Float comparison helpers
function close_float(a: float, b: float, delta: float = 0.001): boolean {
  return (Math.abs(a - b) <= delta);
}


function close_vec2(a: [float, float], b: [float, float], delta: float = 0.001): boolean {
  // even lazier than a dot product
  const dx: number = Math.abs(a[0] - b[0]);
  const dy: number = Math.abs(a[1] - b[1]);
  return (dx <= delta && dy <= delta);
}


// complex notations
// -- QCF / 214 notations
// -- P+K,3P,beat,G
// -- could do a hadouken easter egg...


// STOP THINKING ABOUT IMPLEMENTATION AND JUST IMPLEMENT!
class InputChord {
  /* gamepad state snapshot */

  // NOTE: DS4 uses 16 buttons
  // -- button indices and names might vary by controller?
  face_buttons: integer;  // bitmask
  misc_buttons: integer;  // bitmask
  L_stick: [float, float];
  R_stick: [float, float];
  L_trigger: float;
  R_trigger: float;

  contructor() {
    this.face_buttons = 0b00000000;
    this.misc_buttons = 0b00000000;
    this.L_stick = [0.000, 0.000];
    this.R_stick = [0.000, 0.000];
    this.L_trigger = 0.000;
    this.R_trigger = 0.000;
  }

  // TODO: from_string(bind_string): InputChord
  // -- string -> integer dict for button lookup
  // -- trigger name -> 1.000
  // -- stick + quadrant -> angle @ 1.000 magnitude
  // TODO: as_string(): string
  // -- inverse of from_string

  capture(gamepad: Gamepad): InputChord {
    // TODO: confirm 16 buttons & 6 axes (DS4)
    // TODO: confirm gamepad is not null & is connected
    this.face_buttons = gamepad.buttons.slice(0, 0+8).reduce(
      (acc, button) => (acc << 1) + button.pressed, 0)
    this.misc_buttons = gamepad.buttons.slice(8, 8+8).reduce(
      (acc, button) => (acc << 1) + button.pressed, 0)
    this.L_stick = gamepad.axes.slice(0, 0+2);
    this.R_stick = gamepad.axes.slice(2, 2+2);
    this.L_trigger = gamepad.axes[4];
    this.R_trigger = gamepad.axes[5];
    return this;  // var ic = new InputChord().capture();
  }

  // testing inputs
  // var other = new InputChord().capture(gamepad);

  matches_buttons(other: InputChord): boolean {
    return(
      this.face_buttons === other.face_buttons &&
      this.misc_buttons === other.misc_buttons);
  }

  // TODO: contains_buttons(buttons: InputString) => boolean:  // mask & compare bits

  // TODO: matches sticks w/ parameters
  // -- L/R_angles: [float, float]  // low-high pair; degrees (0..360) +/- delta
  // -- L/R_length: [float, float]  // low-high pair; %age (0..1) +/- delta
  // -- returns [boolean, boolean]  // matches left, matches right
  // NOTE: quadrant indices could make more sense for angle, vs multiple compares

  // e.g. bind.matches(controller_state, [false, false], [true, true])
  matches(other: InputChord, sticks: boolean[], triggers: boolean[]): boolean {
    return (
      this.matches_buttons() &&
      (sticks[0] && match_vec2(this.L_stick, other.L_stick, 0.1)) &&
      (sticks[1] && match_vec2(this.R_stick, other.R_stick, 0.1)) &&
      (triggers[0] && match_float(this.L_trigger, other.L_trigger, 0.1)) &&
      (triggers[1] && match_float(this.R_trigger, other.R_trigger, 0.1)));
  }
}


// TODO: CommandBuffer
// -- watch controller for state changes
// -- observe timers and allow commit
// -- dispatch event to queue
// -- another system will collect inputs and create
// -- start & end times / length in frames
// -- think fighting game lab / debug list


// TODO: flick detection
// -- need analogue history to determine velocity / acceleration
class InputEvent {
  /* logging */

  user_id: integer;
  when: number;  // Date.now() timestamp

  constructor(user_id: integer, chord: InputChord) {
    this.user = user_id;
    this.when = Date.now()
    this.chord = chord;
  }
}


// TODO: represent binds as strings
// -- e.g. {"kb": "Ctrl+Z", "xb": "RT+X"}
// -- kb => keyboard bind
// -- xb => XBox bind (XYAB WNES; LB LT LS)
// -- ps => PlayStation bind (STOX WNES; L1 L2 L3)
// NOTE: xb & ps are just notations
// TODO: stick quadrant binds? / stick binds?
// -- non-standard, but InputChords can track and compare them


// TODO: .json bind list (save-able & shareable)
// -- {ActionId: {kb_bind: ..., xb/ps_bind: ...}}
interface Bind {
  action: int;  // guid (index) in Actions dict
  target: InputChord;  // use an object, don't call constructor on every compare!!!
  // TODO: type
  // -- tap, hold, toggle, cycle (reverse order modifier?)
}


// good default binds matter!
// -- L2+S => Ctrl+Z; L2+T => Ctrl+Y
// mix & match parts of binds (context groups)
// bind menu (load, save, preset, export)
// -- press to bind (on a timer / ... to cancel)
// -- conflicting binds list / conflict resolution
// -- per-device binds
// -- map group (WASD/LS)
// bulk rebind
// -- swap O/X confirm/cancel
// -- WASD / arrow keys / vim hjkl / custom group
// modal binds
// -- detect / apply based on UI context
// -- don't overlap with globals
// release actions
// -- commit / drop
// -- can vary depending on
// global mode controls
// -- held triggers & hold sequence selects group
// -- FFXIV controller menu tech would be wild

// TODO: API for executing inputs
// -- await state change before continuing
// -- automated testing
// -- user-defined macros

// TODO: UI:
// -- glpyhs (always reflect the current binds & input device!)
// -- hybrid setups (always show KB glyphs for this bind/group)
// -- OSD for tutorial screen capture
// -- action queue API
// -- pop-ups (confirm, warning, error, menu)
// -- virtual keyboard triggers (enter/exit text field)

// NOTE: web interface might limit access to accelerometer & haptics
// -- this means limited flickstick & click feedback
