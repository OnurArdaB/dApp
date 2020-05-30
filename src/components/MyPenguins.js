import React, { Component } from "react";

class MyPenguins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myPengus: this.props.myPenguinsData,
      account: this.props.accountData,
      contract: this.props.contractData,
      MamaID: 0,
      PapaID: 0,
    };
  }

  breed = (MamaID, PapaID) => {
    this.state.contract.methods
      .Breed(MamaID, PapaID)
      .send({ from: this.state.account });
  };

  render() {
    var items=[];
    for (var i = 0; i < this.state.myPengus.length; i++) {
      items.push(JSON.stringify(this.state.myPengus[i]));
    }
    var all_items =[];
    for(var j =0;j <items.length;j++){
      all_items.push(items[j].split(","));
    }
    
    return (
      <div>
        <div className="container-fluid ">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Breed Penguins</h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const MamaID = this.MamaID.value;
                    const PapaID = this.PapaID.value;
                    this.breed(MamaID, PapaID);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Enter Mama ID"
                    ref={(input) => {
                      this.MamaID = input;
                    }}
                  />
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Enter Papa ID"
                    ref={(input) => {
                      this.PapaID = input;
                    }}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-info"
                    value="Breed"
                  />
                </form>
                <hr />
                <h1>Your Penguins</h1>
              </div>
            </main>
          </div>
          <div className="row text-center">
            {all_items.map((Pengu, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <img
                    src="https://cdn.iconscout.com/icon/premium/png-256-thumb/penguin-34-548169.png"
                    width="100"
                    height="100"
                    alt=""
                    borderRadius= "100/ 2"
                    className="token"
                    style={{
                      backgroundColor: "rgb("+
                        all_items[key][0].split(":")[1] + "," + all_items[key][1].split(":")[1] + "," + all_items[key][2].split(":")[1]
                      +")"
                    }}
                  ></img>
                  <div>{"ID="+all_items[key][3].split(":")[1]}
                  {"\nRGB("+
                        all_items[key][0].split(":")[1] + "," + all_items[key][1].split(":")[1] + "," + all_items[key][2].split(":")[1]
                      +")"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default MyPenguins;
