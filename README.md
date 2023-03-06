### Subpixel

A rendering tutorial and informative resource single-page-application website.

## Quickstart

To install dependencies, build, launch a local web server, and open a browser window to the page:

```sh
# requires node 10 & npm 6 or higher
npm install
npm start
```

## Scripts

- `start` runs the app for development, reloading on file changes
- `start:build` runs the app after it has been built using the build command
- `build` builds the app and outputs it in the `dist` directory
- `buildshaders` compiles all *.vs and *.fs shaders in src/webgl/shaders to shaders.ts, to be included in start or build scripts
- `lint` runs the linter for the project
