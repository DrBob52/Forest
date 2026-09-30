# Understory

A procedurally generated temperate forest in three.js. Open `index.html` in a browser (it loads three.js 0.184 from jsDelivr, so it needs a network connection).

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
