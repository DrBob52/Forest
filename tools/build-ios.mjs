// Builds the offline copy of the forest that ships inside the iOS app.
//
// index.html loads three.js from a CDN through an import map, which a WKWebView
// cannot use from file:// URLs. This script bundles the page's module script with
// three.js into one classic script, embeds the fonts, and writes a single
// self-contained HTML file to ios/Understory/Web/index.html.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const outFile = path.join(root, 'ios/Understory/Web/index.html');

function take(re, what) {
  const m = src.match(re);
  if (!m) throw new Error(`Could not find ${what} in index.html`);
  return m;
}

// 1. Bundle the module script together with three.js
const moduleTag = take(/<script type="module">([\s\S]*?)<\/script>/, 'the module script');
const tmpDir = path.join(root, '.build');
fs.mkdirSync(tmpDir, { recursive: true });
const entry = path.join(tmpDir, 'app.js');
fs.writeFileSync(entry, moduleTag[1]);
const result = await build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  minify: true,
  target: ['safari16'],
  write: false,
  nodePaths: [path.join(root, 'node_modules')],
  legalComments: 'eof',
  logLevel: 'warning',
});
const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

// 2. Embed the fonts the page asks Google Fonts for
const FONTS = [
  ['Instrument Serif', 400, 'normal', 'instrument-serif/files/instrument-serif-latin-400-normal.woff2'],
  ['Instrument Serif', 400, 'italic', 'instrument-serif/files/instrument-serif-latin-400-italic.woff2'],
  ['IBM Plex Sans', 400, 'normal', 'ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2'],
  ['IBM Plex Sans', 500, 'normal', 'ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2'],
  ['IBM Plex Mono', 400, 'normal', 'ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2'],
  ['IBM Plex Mono', 500, 'normal', 'ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2'],
];
const fontCss = FONTS.map(([family, weight, style, file]) => {
  const data = fs.readFileSync(path.join(root, 'node_modules/@fontsource', file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format('woff2')}`;
}).join('\n');

// 3. Assemble the page
let html = src;
html = html.replace(/<link rel="preconnect"[^>]*>\n/g, '');
html = html.replace(take(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n/, 'the font stylesheet')[0], `<style>\n${fontCss}\n</style>\n`);
html = html.replace(take(/<script type="importmap">[\s\S]*?<\/script>\n/, 'the import map')[0], '');
html = html.replace(moduleTag[0], () => `<script>\n${js}</script>`);
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">',
);

const external = html.match(/(?:src|href)="https?:\/\/[^"]+"/g);
if (external) throw new Error(`The app build still references the network: ${external.join(', ')}`);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);
console.log(`Wrote ${path.relative(root, outFile)} (${(html.length / 1024).toFixed(0)} KB)`);
