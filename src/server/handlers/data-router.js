import axios from "libs/axios"
import express from "express"
import querystring from "querystring"
import request from "request"

const router = express.Router()

function getErrorText(error) {
  let errorStatus = 500
  let errorText = "There was an error with an API call."

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorStatus = error.response.status
    errorText = error.response.data
  }
  else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    errorText = "Request made but no response was received."
  } 
  else {
    // Something happened in setting up the request that triggered an Error
    errorText = error.message
  }

  return {
    status: errorStatus,
    text: errorText
  }
}

function writeErrorForServerLog(handlerPattern, route, error) {
  console.log("")
  console.log("[DATA ROUTER ERROR]", handlerPattern, route)
  console.log("")
  console.log(error)
  console.log("")
}

// this will prefix "api/" to the rest of the incoming route
router.get("/api/*", function (req, res, next) {
  try {
    const {
      headers
    } = req

    const query = querystring.stringify(req.query)
    const urlQuery = query.length !== 0 ? `?${query}` : ""
    const apiPath = req.params["0"]
    const dataApi = req.app.get("dataApi")

    if (!headers.authorization && req.session.dataToken) {
      headers.authorization = `Token ${req.session.dataToken}`
    }

    const settings = {
      url: `${dataApi}/api/${apiPath}${urlQuery}`,
      method: "get",
      headers: {
        ...headers,
        "accept": "application/json",
      },
    }

    axios(settings)
      .then(({data}) => {
        res.status(200).send(data)
        res.end()
      })
      .catch(e => {
        writeErrorForServerLog("/api/*", `${dataApi}/api/${apiPath}${urlQuery}`, e)
        var errorReport = getErrorText(e)
        res.status(errorReport.status).send(errorReport.text)
      })
  }
  catch (e) {
    writeErrorForServerLog("/api/*", "", e)
    res.status(500).send(`[API] Error with GET on ${req.params["0"]} endpoint.`)
    res.end()
  }
})

router.post("/auth", function (req, res, next) {
  try {
    const {
      displayName: displayName,
      email: email,
      uid: uid
    } = req.body

  if (displayName && uid && email) {
    req.session.email = email
    req.session.displayName = displayName
    req.session.uid = uid
    req.session.save()
    res.status(200).send("Login successful!")
    res.end
  } else {
    writeErrorForServerLog("/auth", "No displayName, uid, or email")
    res.status(500).send("No displayName, uid, or email")
    res.end()
  }

  }
  catch (e) {
    writeErrorForServerLog("/auth", "", e)
    res.status(500).send("[API] Login error.")
    res.end()
  }
})


export default router
