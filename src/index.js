/**
 * Entry point of application, where App is rendered within the div with the id of "app"
 */

import React from "react";
import { render } from "react-dom";

import App from "./App";
import { mountPixelCity } from "./background/pixel-city.mjs";

// Mounted outside the React root: it is a wallpaper, not part of the tree, and
// nothing in the app should be able to unmount it on a re-render.
mountPixelCity();

render(<App></App>, document.getElementById("app"));
