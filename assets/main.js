/*
TODO:
 - [x] cache ds4.svg
 - [x] create a div when a controller connects
   - [x] id="p{index}"
*/


var svgs = {};
fetch("/ds4.svg")
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


var players = {};
// ^ {gamepad.index: Controller}


window.addEventListener("gamepadconnected", (event_) => {
  // add controller
  var gamepad = event_.gamepad;
  console.log(
    "Gamepad #%d connected | %s | %d buttons | %d axes",
    gamepad.index, gamepad.id,
    gamepad.buttons.length, gamepad.axes.length);

  var player_div = document.createElement("div");
  player_div.setAttribute("id", `p${gamepad.index}`)
  // TODO: add ui elements to div
  // -- create output (e.g. keyboard) & spawn div
  document.getElementsByClassName("inputs")[0].appendChild(player_div);

  // TODO: match gamepad.id to Controller class
  players[gamepad.index] = new DualShock4(player_div);
});

// TODO: delete Controller & parent_node on disconnect
// TODO: controller blacklist
// -- "1b1c-1b42-Corsair CORSAIR K83 Wireless Entertaintment Keyboard    UNKNOWN"

// TODO: Output Devices
// -- Fighting Game style input history
// virtual keyboards

// TODO: Controller base class

class DualShock4 {
  // gamepad input visualiser
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

  update(gamepad) {
    // edit svg to reflect gamepad state
    var scale = 16;

    this.getElement("lstick")
        .setAttribute("transform",
          `translate(${gamepad.axes[0] * scale} ${gamepad.axes[1] * scale})`);

    this.getElement("rstick")
        .setAttribute("transform",
          `translate(${gamepad.axes[2] * scale} ${gamepad.axes[3] * scale})`);

    // NOTE: axis 4 and 5 are triggers (-1 to +1)
   
    for (let i = 0; i < 17; i++) {
      var button = gamepad.buttons[i];
      this.getElement(`but${i}`)
          .setAttribute("fill", button.pressed ? "#48D" : "#333");
    }

    // TODO: send input events to callbacks
  }

}


function update() {
  var gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad.index in players) {
      players[gamepad.index].update(gamepad);
    }
    // else: gamepadconnected listener didn't add gamepad to players
    // TODO: add new controllers
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
