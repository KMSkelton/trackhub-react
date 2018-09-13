// ------
// this has to be at the top to ensure style load order
import styles from "./login.scss"
// ------
import 
  SelectionPageLayout, 
  { SelectionPageContent } 
  from "presentational/SelectionPageLayout"
import { attemptLogin } from "store/actions/login-actions"
import { connect } from "react-redux"
import Header from "connected/Header"
import PropTypes from "prop-types"
import React from "react"

class Login extends React.Component {

  handleFormRef = (domEl) => {
    this.formRef = domEl
  }

  handleLoginSubmit = (e) => {
    e.preventDefault()
    this.context.store.dispatch(attemptLogin())
    return false
  }

  renderError() {
    const { errorMsg } = this.props

    if (!errorMsg) {
      return
    }

    return (
      <div className={`${styles.entryRow} ${styles.errorContainer}`}>
        <div className={styles.error}>
          <p dangerouslySetInnerHTML={{__html: this.props.errorMsg}}/>
        </div>
      </div>
    ) 
  }

  render() {
    return (
      <div>
        <Header isLogin={true} />

        <main>
          <SelectionPageLayout>
            <SelectionPageContent>
              <h1>Sign In</h1>
            </SelectionPageContent>

            <SelectionPageContent>
              <form
                method="post"
                action="/"
                ref={this.handleFormRef}
                onSubmit={this.handleLoginSubmit}
              >
                
                { this.renderError() }
                
                <div className={styles.entryRow}>
                  <button type="sumbit">Log In with Google</button>
                </div>
              </form>
            </SelectionPageContent>

            <SelectionPageContent noFill={true}>
              <p className={styles.footCopy}>If you have any issues logging in, or any additional issues, questions or comments, please reach out to us on Github</p>
            </SelectionPageContent>

          </SelectionPageLayout>
        </main>
      </div>
    )
  }
}

Login.contextTypes = {
  store: PropTypes.object
}

const mapStateToProps = function(store) {
  return {
    errorMsg: store.app.loginErrorMessage
  }
}

export default connect(mapStateToProps)(Login)
