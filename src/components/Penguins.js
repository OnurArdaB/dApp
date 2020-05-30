import React, { Component } from "react";


class Penguins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allPengus: this.props.allPenguinsData,
    };
  }

  render() {

    var items=[];
    for (var i = 0; i < this.state.allPengus.length; i++) {
      items.push(JSON.stringify(this.state.allPengus[i]));
    }

    var all_items =[];
    for(var j =0;j <items.length;j++){
      all_items.push(items[j].split(","));
    }
    
    return (
      
      <div className="container-fluid ">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>All Penguins</h1>
              <hr />
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
                  roundedCircle
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
    );
  }
}
export default Penguins;
