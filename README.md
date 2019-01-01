# React Trackhub

Building Custom Trackhub files for use in the UCSC genome browser in React

Using examples and inspiration from Ryan Dale
https://github.com/daler/trackhub

Ryan Dale's trackhub demo at:
https://github.com/daler/trackhub-demo
src/static/trackhub-demo-master is a download of these example files

Small hg38 demo file:
https://raw.githubusercontent.com/daler/trackhub-demo/master/example_hub/myhub.hub.txt


This is a server-side rendering application that is built with the following stack:
* webpack
* react
* react-router
* redux
 * with thunk middleware
 * with redux-dev-tools
* express
* axios
* scss or css modules
* postcss + autoprefixer

## Requirements

* Node >= 9
* NPM >= 5

## Installation

* `npm i`

## Builds

* `npm run watch-dev` to bundle and run the server, plus utilizing nodemon for a file watcher.
* `npm run build-prod` to bundle the app for production. This does not start a server.
 * `npm run start-prod` to start the server in production mode; this will probably fail without something like ngnix in place as it will try to run on port 80.

## Webpack aliases

To eliminate the `../../../../../` module reference hell, there are a series of webpack-specific aliases that you can use for JS and SCSS:

```
{
 connected: "./src/shared/components/connected",
 constants: "./src/shared/constants",
 contexts: "./src/shared/contexts",
 presentational: "./src/shared/components/presentational",
 store: "./src/shared/store",
 routes: "./src/shared/routes",
 scss: "./src/shared/scss",
 svg: "./src/shared/svg"
}
```

## Redux store

All redux actions, constants, reducers, and createStore modules are in `./src/shared/store`.

If you have an action that requires asynchronous data loading, you'll need to implement a thunk. See loadPageData action creator for an example (`./src/shared/store/actions/page-actions.js`).

## React

All component modules are in `./src/shared/components[connected|presenatational]`.

React components can/should be broken into two types: connected (smart) and presentational (dumb/pure). The basic principle is: if your component subscribes to data changes within the application store, it is smart. If your component simply accepts props and renders markup, then it is not.

## Routes

All the routes are defined in the `./src/shared/routes`.

This module is used by both client and server for getting the React components to render, as well as any data loading that needs to happen. The minimum you shape each route object can take is this:
```
import AwesomeComponent from "connected/AwesomeComponent"

{
 path: "/awesome",
 component: AwesomeComponent
}
```

### Notes:

* Uses babel to transpile from ES6 javascript down to browser compliant code.
* Currently uses sass via node-sass but would like to remove that in favor of css modules in the future
