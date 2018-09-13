import { loadPageData } from "store/actions/page-actions"
import axios from "axios"
import hocPageLoader from "connected/hocPageLoader"
import React from "react"
import styles from "./home.scss"
import TrackhubGenerator from "connected/TrackhubGenerator/TrackhubGenerator"

class Home extends React.Component {

 // optional external data needs
 // static loadData(storeDispatch, params) {
 //  return storeDispatch(loadPageData(`https://jsonplaceholder.typicode.com/posts`))
 // }

 // optional custom data check
 // static checkData(props) {
 //  const {
 //   page: {
 //    slug: pageSlug
 //   }
 //  } = props

 //  return pageSlug === "homepage"
 // }

 constructor(props) {
  super(props)
 }
 render() {
  return (
   <div className={styles.homepage}>
    <h1>Custom Trackhub Generator</h1>
    <p>Generate custom trackhubs</p>
    <TrackhubGenerator />
   </div>
  )
 }
}

export default hocPageLoader(Home)
