import React, { Component } from 'react';
import axios from 'libs/axios';
import classes from './TrackhubGenerator.scss'
import UploadCSV from 'presentational/UploadCSV/UploadCSV';
import GenomeRetrieve from 'presentational/GenomeRetrieve/GenomeRetrieve';
import RenderCSV from 'presentational/RenderCSV/RenderCSV';
import {inputToJSON} from 'libs/inputToJSON/inputToJSON';
import {allFieldsComplete} from 'libs/VerifyCSV/VerifyCSV';

class TrackhubGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hubName: "",
      genome: "",
      shortLabel: "",
      longLabel: "",
      email: "",
      s3BucketName: "",
      samples: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (allFieldsComplete(this.state)){
      let data = inputToJSON(this.state)
      this.sendTrackhub(data)
      this.render(<p>`Your data has been stored at ${response.data.hubPath}`</p>)
    } else {
      return false
    }
  }

  sendTrackhub = (data) => {
    axios({
      url: 'https://rmvpv6ey05.execute-api.us-west-2.amazonaws.com/default/create-trackhub-write-s3-bucket/',
      method: "post",
      headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Accept": "application/json",
          "X-Api-Key": "5OpLIMUC4L9KeE16luwaZ8lAI6TcqUNx4jVfuB8K"
      },
      json: true,
      data: data
    })
    .then(response => {
      console.log('TRACKHUB SENT:', response);
    })
    .catch(error => {
      console.error(error)
    })
  }

  displayCSV = (data) => {
    this.setState({samples: data})
  }

  render() {
    return(
      <React.Fragment>
      <UploadCSV onFileUpload={this.displayCSV} />
      <br />
      <form onSubmit={this.handleSubmit} className={classes.form}>
      <label>
        <input
          type="text"
          name="s3BucketName"
          placeholder="dm-trackhubs"
          onChange={this.handleChange} 
        />
      </label>
        <label>
          Genome assembly (e.g. hg38):
          <GenomeRetrieve
            type="text"
            name="genome"
            onChangeGenome={this.handleChange}
           />
          </label>
          <br />
          <label>
            hub name:
            <input
              type="text"
              name="hubName"
              onChange={this.handleChange}
              />
          </label>
          <label>
            hub shortLabel:
            <input
              type="text"
              name="shortLabel"
              onChange={this.handleChange}
              />
          </label>
          <label>
            hub longLabel:
            <input
              type="text"
              name="longLabel"
              onChange={this.handleChange}
              />
          </label>
          <label>
            contact email:
            <input
              type="text"
              name="email"
              onChange={this.handleChange}
              />
          </label>
          <input type="submit" value="Submit" className={classes.button} />
        </form>
        <RenderCSV csv={this.state.samples}/>
      </React.Fragment>
    )
  }
}

 
// send JSON object to Flask
// Flask runs Mark's script (create custom trackhub) using all the parser arguments
// data store returns an object to the user
// have Flask service check React server for jobs to run. scales better b/c we can only
// send one react request at a time.
// need to set up file store for react
export default TrackhubGenerator;
