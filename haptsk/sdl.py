# https://pysdl2.readthedocs.io/en/0.9.13/tutorial/index.html
# https://pysdl2.readthedocs.io/en/0.9.13/modules/sdl2ext.html
import functools

import sdl2
import sdl2.ext


# utils
def center_xy(window, texture) -> (int, int):
    return tuple([
        w // 2 - t // 2
        for w, t in zip(window.size, texture.size)])


def rgb(short: int) -> int:
    """0x[A]RGB -> 0x[AA]RRGGBB"""
    if 0xFF0000 & short != 0:
        # 5+ hex digits, already in 0xAARRGGBB form
        return short
    else:
        b, g, r, a = [
            (short >> 4 * i) & 0xF
            for i in range(4)]
        return combine(*[
            (c << 4 | c) << 8 * i
            for i, c in enumerate((b, g, r, a))])


def combine(*flags) -> int:
    return functools.reduce(lambda a, b: a | b, flags)


def main(width: int = 960, height: int = 544):
    sdl2.ext.init()

    # window init
    window = sdl2.ext.Window("HaPTSK", size=(width, height))
    window.show()

    # renderer init
    render_mode = {
        "software": sdl2.SDL_RENDERER_SOFTWARE,
        "hardware": sdl2.SDL_RENDERER_ACCELERATED}
    renderer = sdl2.ext.renderer.Renderer(
        window, flags=render_mode["hardware"])

    renderer.fill((0, 0, width, height), rgb(0xA98))
    # NOTE: renderer.fill is for rects, not the whole surface

    # controller texture
    ds4_svg = sdl2.ext.image.load_svg("assets/ds4.svg", width=512)
    ds4_tex = sdl2.ext.renderer.Texture(renderer, ds4_svg)

    # TODO: svg:id -> Pillow.Image -> Texture
    # -- sdl2.ext.renderer.pillow_to_surface
    # -- Texture(renderer, pillow_to_surface(...))
    # OR: have a Svg class & edit it like you would with javascript
    # -- `svg_tool` is the place to do this

    # copy texture to middle of screen & draw
    renderer.copy(ds4_tex, dstrect=center_xy(window, ds4_tex))
    renderer.present()

    # main loop
    running = True
    while running:
        # handle events
        events = sdl2.ext.get_events()
        # TODO: text input dev console
        # -- ext.uisystem -> SDL_SetTextInputRect
        if sdl2.ext.quit_requested(events):
            running = False
            break

        # draw
        # TODO: dev messages via ext.ttf
        window.refresh()
        sdl2.SDL_Delay(60)  # 60ms of rest for the CPU

    sdl2.ext.quit()


if __name__ == "__main__":
    main()
