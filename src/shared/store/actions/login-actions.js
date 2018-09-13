import { Types } from "../constants/login-types"
import { Types as FirebaseTypes } from "../constants/firebase-types"
import { auth, databaseRef, provider } from "config/firebase"
import { usersRef } from "../../../../config/firebase"
import axios from "libs/axios"

export function createUser(uid, email, displayName) {
  return (dispatch) => {
    dispatch({ type: FirebaseTypes.USER_CREATE_START })
    console.log('uid :', uid);
    // Create a user in your Firebase Database
    databaseRef.child(`users/${uid}`).set({
      displayName,
      email
    })
      .then(() => {
        dispatch({ type: FirebaseTypes.USER_CREATE_SUCCESS })
        dispatch(fetchUser({ uid }))
      })
      .catch(error => {
        dispatch({ type: FirebaseTypes.USER_CREATE_FAIL })
      })
  }
}
export function fetchUser(user) {
  return (dispatch) => {
    dispatch({ type: FirebaseTypes.FETCH_USER_START })

    try {
      let query = usersRef
        .child(user.uid)
      query
        .once('value', (snapshot) => {
          let firebaseUser = snapshot.val()
          if (firebaseUser) {
            dispatch({
              type: FirebaseTypes.FETCH_USER_SUCCESS,
              user: firebaseUser
            });
          } else {
            if (user.email && user.displayName) {
              dispatch(createUser(user.uid, user.email, user.displayName))
            } else {
              dispatch({
                type: FirebaseTypes.FETCH_USER_FAIL,
                loginError: "User fetch did not find user and could not create user - requires email and displayName."
              })
            }
          }
        })
    }
    catch (e) {
      console.log('Error with fetching user :', e)
      dispatch({
        type: FirebaseTypes.FETCH_USER_FAIL,
        loginError: "User fetch failed. Please try again."
      })
    }
  }
}
export function saveSession(user) {
  // save the information from firebase to the node session
  return (dispatch) => {
    console.log('savesession', user)
    axios({
      url: "/data/auth",
      method: "post",
      headers: {
        "content-type": "application/json"
      },
      data: {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid
      }
    })
    .then((data) => {
      console.log('savesession has data :', data);
      dispatch({ type: Types.LOGIN_SUCCESS })
      window.location.href = "/"
    })
    .catch(e => {
      console.log('savesession error :', e);
      dispatch({ type: Types.LOGIN_FAIL })
    })
  }
}

export function attemptLogin(user, pass, historyPush = function () {}) {
  return (dispatch, getState) => {
    dispatch({ type: Types.LOGIN_START })
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        dispatch(fetchUser(user))
        dispatch(saveSession(user))
      })
      .catch(e => {
        console.log('error logging in:', e)
        dispatch({
          type: Types.LOGIN_FAIL,
          loginError: "Login failed. Please try again."
        })
      })
  }
}