window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad #%d connected | %s | %d buttons | %d axes",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);

  document.getElementById("led").setAttribute("fill", "#3F3");
});

// ds4
function update() {
  var gamepads = navigator.getGamepads()
  /* TODO: identify gamepad by id string */
  if (gamepads.length != 0) {
    var gamepad = gamepads[0]  /* 6 axes, 17 buttons */
    var scale = 16;

    var lstick = document.getElementById("lstick");
    var lx = scale * gamepad.axes[0];
    var ly = scale * gamepad.axes[1];
    lstick.setAttribute("transform", `translate(${lx} ${ly})`);

    var rstick = document.getElementById("rstick");
    var rx = scale * gamepad.axes[2];
    var ry = scale * gamepad.axes[3];
    rstick.setAttribute("transform", `translate(${rx} ${ry})`);

    /* NOTE: axis 4 and 5 are triggers (-1 to +1) */
    /* NOTE: can't use lt or gt symbol inside script tag */
    var i = 0; var on = "#48D"; var off = "#333";
    while (i != 17) {
      var button = gamepad.buttons[i];
      var led = document.getElementById(`but${i}`);
      led.setAttribute("fill", button.pressed ? on : off);
      i++;
    }
  }
  requestAnimationFrame(update);
}

requestAnimationFrame(update);

