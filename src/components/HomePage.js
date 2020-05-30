import React, { Component } from "react";

class HomePage extends Component {
  style1 = {
    fontSize: "70px",
  };

  style2 = {
    fontSize: "50px",
  };

  style3 = {
    padding: "130px 0px 0px 0px",
  };

  render() {
    return (
      <div className="container">
        <div>
          <div className="col-md-12 text-center" style={this.style3}>
            <h style={this.style1}>Welcome to CryptoPenguins!</h>
            <p style={this.style2}>  
Crypto Penguins is an initiative created on behalf of the course coded CS-48001.
            </p>
            <p style={this.style2}>
              Please check for Trade if you don't have any penguins.
            </p>
            <p style={this.style2}>
              You can check your penguins by clicking My Penguins button.
            </p>
            <p style={this.style2}>
              If you want to discover more penguins you can click All Penguins.            
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default HomePage;
