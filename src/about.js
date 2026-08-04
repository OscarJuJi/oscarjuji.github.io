/**
 * Entry point for the "About Me" page (/about.html).
 */

import React from "react";
import { render } from "react-dom";

import AboutMePage from "./Components/AboutMePage";
import { mountPixelCity } from "./background/pixel-city.mjs";

// The About page is a page of prose. It gets the calm scene: no skyline, no
// street, no neon at the horizon — just the sky and one drifting noise field.
mountPixelCity({ scene: "calm" });

render(<AboutMePage></AboutMePage>, document.getElementById("app"));
