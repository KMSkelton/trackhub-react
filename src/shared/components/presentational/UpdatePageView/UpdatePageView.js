import React, {Component} from 'react';

class UpdatePageView extends Component {
  constructor(props){
    super(props);
  }

  render() {
    if(!this.props.data) {return null}
    return(
      <div>
        <p>{`Your trackhub can be found at: ${this.props.data}`}</p>
      </div>
    )
  }
}

export default UpdatePageView