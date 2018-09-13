import { Provider } from "react-redux"
import { StaticRouter as Router } from "react-router"
import { Types as AppTypes } from "store/constants/app-types"
import App from "presentational/App"
import Context from "react-context-component"
import history from "../history"
import initStore from "store"
import React from "react"
import render from "../views/render-app"
import testForMobileBrowser from "../methods/test-mobile"
import { Types as FirebaseTypes } from "store/constants/firebase-types"

const ErrorPage = () => <h1>Oops there was an error</h1>

const reactApp = (req, res, next) => {

  const context = {}
  const store = initStore(history)
  
  const setStatus = (newStatus) => {
    status = newStatus
  }

  let HTML
  let status = 200

  store.dispatch({
    type: AppTypes.SET_IS_MOBILE_BROWSER,
    isMobile: testForMobileBrowser(req.headers['user-agent'].toLowerCase())
  })

  // add the call to get user permissions
  //
  // if there's any application things that need to happen before the initial render
  // this is the place to do that

  store.dispatch({type: FirebaseTypes.USER_SESSION_LOAD, user: req.session})

  try {
    HTML = render(
      <Context setStatus={setStatus}>
        <Provider store={store}>
          <Router context={{}} location={req.originalUrl}>
            <App history={history} users={req.session} />
          </Router>
        </Provider>
      </Context>,
      store.getState()
    )
  }  
  catch (e) {
    HTML = render(ErrorPage, store.getState())
    status = 500
  }
  if (context.url) {
    res.redirect(301, context.url)
    res.end()
  } else {
    res.status(status).send(HTML)
    res.end()
  }
}

export default reactApp