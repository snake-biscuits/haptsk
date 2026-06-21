// globals
var svgs = {};
// ^ {"name": "<svg>...</svg>"}
var players = {};
// ^ {gamepad.index: Controller}


// load svgs
fetch("/assets/ds4.svg")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
    return response.text();})
  .then((text) => {
    svgs["ds4"] = text;
  })
  .catch((error) => {
    svgs["ds4"] = `<code>${error}</code>`
  });


// TODO: don't add controllers on a blacklist
// -- "1b1c-1b42-Corsair CORSAIR K83 Wireless Entertaintment Keyboard    UNKNOWN"
window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad #%d connected | %s | %d buttons | %d axes",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);

  var log = document.getElementById("log");
  log.innerHTML += `${e.gamepad.id} | ${e.gamepad.buttons.length} buttons\n`;

  var player_div = document.createElement("div");
  player_div.setAttribute("id", `p${e.gamepad.index}`)
  document.getElementsByClassName("inputs")[0].appendChild(player_div);

  // TODO: create / bind to an output (e.g. a virtual keyboard)

  // TODO: choose Controller class by e.gamepad.id
  players[e.gamepad.index] = new DualShock4(player_div);
});


window.addEventListener("gamepaddisconnected", (e) => {
  document.getElementById(`p${e.gamepad.index}`).remove();
  delete players[e.gamepad.index];
});



// TODO: Output Devices
// -- Fighting Game style input history
// virtual keyboards


// TODO: Controller base class


// visualises input, doesn't do anything with it!
class DualShock4 {
  // gamepad input **visualiser**
  // planning to feed input to other objects in future

  // 17 butttons, 6 axes
  // "054c-09cc-Sony Interactive Entertainment Wireless Controller"

  constructor(parent_node) {
    console.log("new DualShock4");
    this.parent_node = parent_node;
    this.parent_node.innerHTML += svgs["ds4"];
    /* TODO: led colour should vary by player index */
    this.getElement("led").setAttribute("fill", "#3F3");
  }

  getElement(name) {
    return this.parent_node.getElementsByClassName(name)[0];
  }

  // DRAW: edit svg to reflect gamepad state
  update(gamepad) {
    var scale = 16;

    this.getElement("lstick")
        .setAttribute("transform",
          `translate(${gamepad.axes[0] * scale} ${gamepad.axes[1] * scale})`);

    this.getElement("rstick")
        .setAttribute("transform",
          `translate(${gamepad.axes[2] * scale} ${gamepad.axes[3] * scale})`);

    // NOTE: axis 4 and 5 are triggers (-1 to +1)
    // -- could use a gradient or mask to draw pressure?

    gamepad.buttons.forEach((button, index) => {
      this.getElement(`but${index}`)
          .setAttribute("fill", button.pressed ? "#48D" : "#333");
    });

    // for (let i = 0; i < 17; i++) {
    //   var button = gamepad.buttons[i];
    //   this.getElement(`but${i}`)
    //       .setAttribute("fill", button.pressed ? "#48D" : "#333");
    // }
  }
}


function update() {
  var gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad.index in players) {
      players[gamepad.index].update(gamepad);
    }  // else: gamepad doesn't have a div
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
