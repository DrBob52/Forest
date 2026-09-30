# Understory

A procedurally generated temperate forest in three.js. It runs in a browser and as an iOS app.

**Web:** open `index.html` in a browser. It loads three.js 0.184 from jsDelivr, so it needs a network connection.

## What you can do

- **Click any tree** to inspect it: species, height, crown width, trunk diameter, estimated age, and the site it grows on (soil moisture, elevation, growing space, suitability).
- **Regrow** a tree (button or `R`) to generate a new individual of the same species within the limits of its site. **Replant as…** swaps the species, showing how well each one suits that spot. **Focus** (`F`) flies the camera to it. `Esc` deselects.
- **Time of day**: the sun follows a real solar path for 50° N, so day length changes with the season.
- **Season**: leaves flush in spring, turn species-specific autumn colours, fall, and leave bare branches in winter. Grass, ferns, wildflowers and ground litter follow the calendar too.
- **Wind**: drives tree sway, grass waves, rain slant, snow drift, falling leaves and cloud speed. Shown on the Beaufort scale.
- **Rain** (any season) darkens and wets surfaces and brings in overcast skies. **Snow** is available December to February and settles on the ground, branches and conifers.
- **Forest**: choose which species grow, set the number of trees, or plant a new forest from a fresh seed.

## Species

English oak, sugar maple, European beech, silver birch, Scots pine and Norway spruce. Each has its own branching model, bark and leaf textures, seasonal palette, and preferred moisture and elevation. When a forest is planted, each spot picks a species weighted by how well it suits the local soil and elevation. Height depends on site suitability, and crown width is capped by the distance to the nearest neighbour.

## Everything is procedural

Terrain, bark and leaf textures (drawn to canvas), tree skeletons and foliage, grass blades, wildflowers, ferns, rocks, distant woodland, sky, clouds and stars are all generated at load time. There are no image or model files.

Settings (time, season, wind, weather, species, tree count and seed) are remembered on the device between visits.

## iOS app

The `ios/` folder holds a SwiftUI app for iPhone and iPad (iOS 16 or later). It shows the same forest in a full-screen `WKWebView`, fully offline, with haptic feedback when you select or regrow a tree.

### Run it

1. Open `ios/Understory.xcodeproj` in Xcode 15 or later.
2. Select the **Understory** target, open **Signing & Capabilities**, and choose your team. Change the bundle identifier (`io.github.drbob52.understory`) if you need a different one.
3. Pick a simulator or a connected device and press Run.

The forest is WebGL-heavy. It runs in the simulator, but frame rates on a real device are more representative.

### How it fits together

- `index.html` at the repository root is the single source for the forest.
- `npm run build:ios` (in `tools/build-ios.mjs`) bundles that page's script with three.js using esbuild, embeds the fonts, and writes one self-contained file to `ios/Understory/Web/index.html`. The app loads that file from its bundle, so it makes no network requests. WKWebView cannot load ES modules from `file://` URLs, which is why the app gets a bundled copy instead of the import-map version.
- `ios/Understory/ForestView.swift` hosts the web view, reloads it if iOS ends the web process, and turns the page's `haptics` messages into taps of the Taptic Engine.
- `ios/AppIcon.svg` is the source of the app icon in `Assets.xcassets`.

The built page is committed, so you can open the Xcode project without Node. After changing `index.html`, rebuild the app copy:

```sh
npm install
npm run build:ios
```
