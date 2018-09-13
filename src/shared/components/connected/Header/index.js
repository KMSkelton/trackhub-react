import { 
  Link,
  NavLink
} from "react-router-dom"
import { connect } from "react-redux"
import { showModal } from "store/actions/app-actions"
import { withRouter } from "react-router-dom"
import PropTypes from "prop-types"
import React from "react"
import styles from "./header.scss"

class Header extends React.Component {

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
   }

  handleSignOutClick = (e) => {
    e.preventDefault()

    this.context.store.dispatch(showModal({
      heading: "Confirm Signout",
      content: "Are you sure you want to sign out?",
      okCallback: this.handleSignOutConfirmOk
    }))
  }

  handleSignOutConfirmOk = (e) => {
    window.location.href = "/logout"
  }
  
  renderUnauthenticated() {
    return (
      <div className={`clearfix ${styles.links}`}>
        <span className={styles.link}>Trackhubs</span>
      </div>
    )
  }

  renderAuthenticated() {
    const {
      userDetails
    } = this.props
    // note the space at the end of this line; it separates it from the sign out link
    const displayName = `Hi, ${userDetails.displayName}. `

    return (
      <React.Fragment>
        <div className={`clearfix ${styles.links}`}>
          <NavLink className={styles.link} to="/" exact={true} activeClassName={styles.isActive}>Home</NavLink>
        </div>
        <div className={styles.usermenu}>
          <div className={styles.usermenuContainer}>
            <span>{ displayName }(</span>
            <a href="/logout" onClick={this.handleSignOutClick}>sign out</a>
            <span>)</span>
          </div>
        </div>
      </React.Fragment>
    )
  }
  
  render() {
    const {
      isLogin = false
    } = this.props

    return (
      <header className={styles.header}>
        <div className="pageContainer">
          <div className={`contentContainer ${styles.linksContainer}`}>
            { isLogin ? this.renderUnauthenticated() : this.renderAuthenticated() }
          </div>
        </div>
      </header>
    )
  }
}

const mapStateToProps = function(store) {
  return {
    userDetails: store.app.userDetails,
    userPermissions: store.app.userPermissions
  }
}

Header.contextTypes = {
  store: PropTypes.object
}

export default withRouter(connect(mapStateToProps)(Header))