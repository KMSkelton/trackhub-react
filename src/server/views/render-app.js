import { renderToString } from "react-dom/server"

const vendorsUrl = "/assets/vendors.chunk.js"
const appBundleUrl = "/assets/app.bundle.js"
const appCssUrl = "/assets/app.css"
const dallianceUrl = "/assets/dalliance.js"

export default (component, storeData) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Custom Trackhub Creator" />
    <meta name="keywords" content="Trackhub" />
    
    <title>Custom Trackhub</title>
    
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="${appCssUrl}" />
  </head>
  <body>
    <div id="root">${renderToString(component)}</div>
    <script>window.__PRELOADED_STATE__ = ${JSON.stringify(storeData)}</script>
    <script src="${vendorsUrl}"></script>
    <script src="${dallianceUrl}"></script>
    <script src="${appBundleUrl}"></script>
  </body>
</html>`
