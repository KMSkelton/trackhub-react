import React, { Component } from "react";
import CSVReader from "react-csv-reader";
import propTypes from "prop-types"
import {verifyHeader, removeEmpty, trimEntry} from "libs/VerifyCSV/VerifyCSV";

class UploadCSV extends Component {
 constructor(props) {
  super(props)
 }

 handleUpload = (data) => {
  data = trimEntry(data)
  verifyHeader(data) ? this.props.onFileUpload(removeEmpty(data)) : alert("Invalid Head Row. File not parsed.")
}


 render() {
  return (
   <div className="container">
    <CSVReader
      cssClass="react-csv-input"
      label="Select CSV"
      onFileLoaded={this.handleUpload}
    />
   </div>
  );
 }
}

UploadCSV.propTypes = {
 onFileUpload: propTypes.func
};

export default UploadCSV
