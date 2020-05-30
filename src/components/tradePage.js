import React, { Component } from "react";
import web3 from "web3";
import * as Utils from 'web3-utils';
// Utilis.fromWei(price)

class Penguins extends Component {

  constructor(props) {

    super(props);

    this.state = {
      allPengus: [],
      account: this.props.accountData,
      contract: this.props.contractData,
      searchPengu: "",
      searchPenguColor: "",
      searchPenguPrice:"",
      isSearch: 0,
      price: 0,
    };

    for(let i =0; i<this.props.allPenguinsData.length; i++){
      this.state.allPengus.push(this.props.allPenguinsData[i]);
    }
  }

  // ! For simplicity
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!

  searchForm = (

    <form
      onSubmit={(event) => {
        event.preventDefault();
        const penguin2 = this.penguin2.value;
        var temp = false;
        console.log(this.penguin2)
        console.log(this.penguin2.value)
        console.log(this.state.allPengus)

        for (var i = 0; i < this.state.allPengus.length; i++) {
          if (this.state.allPengus[i].Id.toString() === penguin2.toString()) {
            
            temp = true;
            this.setState({ searchPengu: penguin2 });
            this.colors()
            this.setState({ isSearch: 1 });
            break;
          }
          temp = false;
        }
        if (!temp) {
          this.setState({ isSearch: 2 });
          this.setState({ searchPengu: "" });
        }
      }}
    >
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Search for Penguin"
        ref={(input) => {
          this.penguin2 = input;
        }}
      />
      <input type="submit" className="btn btn-block btn-info" value="Search" />
    </form>
  );
  buyForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        var penguin1 = event.target[0].value;//buralara input hatalı geliyor ondan ötürü function hatalı gönderiliyor
        var price1 = event.target[1].value;//buralara input hatalı geliyor ondan ötürü functiona hatalı gönderiliyor
        this.buy(parseInt(penguin1), parseInt(price1));
      }}
    >
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Buy a Penguin"
        ref={(input) => {
          this.penguin1 = input;
        }}
      />
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Enter Price"
        ref={(t) => {
          this.price1 = t;
        }}
      />
      <input type="submit" className="btn btn-block btn-info" value="Buy" />
    </form>
  );
  cancelForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log(event.target[0].value)
        const penguin3 = event.target[0].value;
        this.cancel(parseInt(penguin3));
      }}
    >
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Cancel Sale"
        ref={(input) => {
          this.penguin3 = input;
        }}
      />
      <input type="submit" className="btn btn-block btn-info" value="Cancel" />
    </form>
  );
  sellForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const penguin4 = event.target[0].value;
        const price4 = event.target[1].value;
        this.sell(parseInt(penguin4),parseFloat(price4));
      }}
    >

      <input
        type="text"
        className="form-control mb-1"
        placeholder="Sell a Penguin"
        ref={(input) => {
          this.penguin4 = input;
        }}
      />
      <input
        type="text"
        className="form-control mb-1"
        placeholder="Enter Price"
        ref={(input) => {
          this.price4 = input;
        }}
      />
      <input type="submit" className="btn btn-block btn-info" value="Sell" />
    </form>
  );
  but = (
    <button
      onClick={() => {
        this.changePage({
          a: 0,
        });
      }}
      className="btn btn-info btn-sm3 content mr-auto ml-auto"
    >
      Penguins for Sale{" "}
    </button>
  );
  style1 = {
    fontSize: "35px",
  };
  style2 = {
    fontSize: "25px",
  };
  print = (all_items,key) => {
      return (
        <div>
      <img
        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/penguin-34-548169.png"
        width="100"
        height="100"
        alt=""
        className="token"
        style={{
          backgroundColor: "rgb("+
            all_items[key][0].split(":")[1] + "," + all_items[key][1].split(":")[1] + "," + all_items[key][2].split(":")[1]
          +")"
        }}
      ></img>
    <div>
      {"ID="+all_items[key][3].split(":")[1]}
      {"\nrgb("+all_items[key][0].split(":")[1] + "," + all_items[key][1].split(":")[1] + "," + all_items[key][2].split(":")[1]+")"}
      {"    Price "+parseInt(all_items[key][6].split(":")[2].split('"')[1])}
    </div>
    </div>
      );
 
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!

  buy = (PenguinID,price) => {
    console.log(PenguinID);
    console.log(price);
    this.state.contract.methods.BuyPenguin(PenguinID)
    .send( {from: this.state.account ,gasPrice: 300000000000,value:price});
  };

  sell = (PenguinID, price) => {
    this.state.contract.methods
      .SellPenguin(PenguinID, price)
      .send({ from: this.state.account });
  };

  cancel = (PenguinID) => {
    this.state.contract.methods
      .CancelSale(PenguinID)
      .send({ from: this.state.account });
  };
  

  changePage = (product) => {
    this.setState({ isSearch: product.a });
  };

  async colors(){
    var redd = await this.state.contract.methods.GetterFromIDtoPenguinRed(this.state.searchPengu).call();
    var greenn= await this.state.contract.methods.GetterFromIDtoPenguinGreen(this.state.searchPengu).call();
    var bluee= await this.state.contract.methods.GetterFromIDtoPenguinBlue(this.state.searchPengu).call();
    var price = await this.state.contract.methods.GetterPrice(this.state.searchPengu).call();
    let str = "rgb("+JSON.stringify(redd) +"," +JSON.stringify(greenn) + "," +JSON.stringify(bluee)+")"
    this.setState( {searchPenguColor : str});
    price = this.state.allPengus[this.state.searchPengu].Price

    console.log("This is price" + parseInt(price).toString())
    this.setState( {searchPenguPrice : parseInt(price)});

  }

  render() {
    var items=[];
    for (var i = 0; i < this.state.allPengus.length; i++) {
      items.push(JSON.stringify(this.state.allPengus[i]));
    }
    var t_items =[];
    for(var j =0;j <items.length;j++){
      t_items.push(items[j].split(","));
    }
    var all_items =[];
    for (var k =0 ;k<t_items.length;k++){
      if(t_items[k][7].split(":")[1]==="true}"){
        all_items.push(t_items[k]);
      }

    }
  
    
    return (
      <div className="container-fluid ">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Trade Penguins</h1>
              <hr />
            </div>
          </main>
          <div className="btn group content mr-auto ml-auto">{this.but}</div>
          <div className="content mr-auto ml-auto">{this.searchForm}</div>
          <div className="content mr-auto ml-auto">{this.buyForm}</div>
          <div className="content mr-auto ml-auto">{this.cancelForm}</div>
          <div className="content mr-auto ml-auto">{this.sellForm}</div>
        </div>
        <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1>Search Results</h1>
              <hr />
              <hr />
            </div>
          </main>
        <div className="row text-center">

        {this.state.isSearch === 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <div classname="col">
              <img
                src="https://cdn.iconscout.com/icon/premium/png-256-thumb/penguin-34-548169.png"
                width="100"
                height="100"
                alt=""
                className="token"
                style={{
                  backgroundColor: this.state.searchPenguColor,
                }}
              ></img>
              <p style={this.style2}>{this.state.searchPenguPrice}</p>
            </div>
          </div>
        )}

        {this.state.isSearch === 0 &&
          all_items.map((Pengu, key) => {
            return (
              <div key={key} className="col-md-3 mb-3">
                {all_items[key][7].split(":")[1] && this.print(all_items,key)}
              </div>
            );
          })}

        {this.state.isSearch === 2 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30vh",
            }}
          >
            <p style={this.style1}>Could not find this penguin</p>
          </div>
        )}
        </div>
      </div>

    );
  }
}
export default Penguins;
