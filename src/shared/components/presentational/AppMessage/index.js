import React from "react"
import styles from "./app-message.scss"

class AppMesssage extends React.Component {

  handleMessageClose = (e) =>{
    const {
      data: {
        id
      },
      onCloseClick = function() {}
    } = this.props

    onCloseClick(id)
  }

  render() {
    const {
      data: {
        text,
        type
      }
    } = this.props

    const typeClass = styles[type] || ""

    return (
      <div className={`clearfix ${styles.message} ${typeClass}`}>
        <div className={`${styles.close} ${typeClass}`} onClick={this.handleMessageClose}></div>
        <p className={styles.copy}>{text}</p>
      </div>
    )
  }
}

export default AppMesssage
