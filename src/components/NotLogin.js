import React, { Component } from "react";

class NotLogin extends Component {
  style1 = {
    fontSize: "80px",
  };
  style2 = {
    fontSize: "30px",
  };
  render() {
    return (
      <div className="container">
        <div>
          <div className="col-md-12 text-center">
            <p style={this.style1}>You Have To Login</p>
            <p style={this.style2}>
              You can connect with your metamask account
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default NotLogin;
