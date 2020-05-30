import React, { Component } from "react";
//import { Dropdown, Item } from 'react-bootstrap';
import Web3 from "web3";
//import logo from '../logo.png';
import "./App.css";
import Penguin from "../abis/Penguin.json";
import Penguins from "./Penguins.js";
import HomePage from "./HomePage.js";
import MyPenguins from "./MyPenguins.js";
import NotLogin from "./NotLogin.js";
import TradePage from "./tradePage.js";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = Penguin.networks[networkId];
    this.setState({ isLogin: true });

    if (networkData) {
      const abi = Penguin.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);

      this.setState({ contract });

      var totalSupply = await contract.methods.totalSupply().call();
      //totalSupply=parseInt(totalSupply);
      this.setState({ totalSupply });

      for (var i = 0; i < totalSupply; i++) {

        const owner = await contract.methods.GetterFromIDtoOwner(i).call();
        const redd = await contract.methods.GetterFromIDtoPenguinRed(i).call();
        const grenn = await contract.methods
          .GetterFromIDtoPenguinGreen(i)
          .call();
        const bluee = await contract.methods
          .GetterFromIDtoPenguinBlue(i)
          .call();

        //const owner = await contract.methods.GetterFromIDtoOwner(i).call();
        const isforsale = await contract.methods.GetterIsForSale(i).call();
        const mamaid = await contract.methods.GetterMamaID(i).call();
        const papaid = await contract.methods.GetterPapaID(i).call();
        const price = await contract.methods.GetterPrice(i).call();
        console.log("LoadChain price: ", price)
        let pengu = {
          Red: redd,
          Green: grenn,
          Blue: bluee,
          Id: i,
          MamaId: mamaid,
          PapaId: papaid,
          Price: price,
          isForSale: isforsale,
        };

        if (owner === this.state.account) {
          this.setState({ myPengus: [...this.state.myPengus, pengu] });
        }

        this.setState({ owner: owner });
        this.setState({ allPengus: [...this.state.allPengus, pengu] });
      }
      
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  } 
  constructor(props) {
    super(props);

    this.state = {
      account: "Connect with meta-mask",
      isLogin: false,
      owner: "",
      contract: "",
      totalSupply: 0,
      allPengus: [],
      myPengus: [],
      HomePage: true,
      Penguins: false,
      myPenguins: false,
      tradePage: false,
    };
  }

  changePage(product) {
    this.setState({ HomePage: product.a });
    this.setState({ Penguins: product.b });
    this.setState({ myPenguins: product.c });
    this.setState({ tradePage: product.d });
  }

  backgroundStyle = {
    width: "100vw",
    minHeight: "80vh",
    backgroundColor: "white",
  };
  imageStyle1 = {
    backgroundImage:
      "url(https://i.pinimg.com/originals/24/9f/fc/249ffc35674dfdeb3414b91b81a36628.jpg)",
    width: "100vw",
    minHeight: "95vh",
  };
  imageStyle2 = {
    backgroundImage:
      "url(https://goldwallpapers.com/uploads/posts/snow-pictures-for-wallpaper/snow_pictures_for_wallpaper_009.jpg)",
    width: "100vw",
    minHeight: "95vh",
  };

  txtStyle = {
    fontSize: "20px",
  };

  render() {
    let page;
    if (this.state.isLogin) {
      if (this.state.Penguins) {
        page = (
          <div style={this.imageStyle2}>
            {" "}
            <Penguins allPenguinsData={this.state.allPengus} />;
          </div>
        );
      } else if (this.state.myPenguins) {
        page = (
          <div style={this.imageStyle2}>
            <MyPenguins
              myPenguinsData={this.state.myPengus}
              accountData={this.state.account}
              contractData={this.state.contract}
            />
          </div>
        );
      } else if (this.state.tradePage) {
        page = (
          <div style={this.imageStyle2}>
            <TradePage
              allPenguinsData={this.state.allPengus}
              accountData={this.state.account}
              contractData={this.state.contract}
            />
          </div>
        );
      } else {
        page = (
          <div style={this.imageStyle2}>
            <HomePage />
          </div>
        );
      }
    } else {
      page = (
        <div style={this.imageStyle1}>
          <NotLogin />
        </div>
      );
    }

    var items = [];
    for (var i = 0; i < this.state.allPengus.length; i++) {
      items.push(JSON.stringify(this.state.allPengus[i]));
    }

    return (
      <div style={this.backgroundStyle}>
        <div>
          <nav
            className="navbar navbar-dark bg-dark text-white"
            style={this.txtStyle}
          >
            <div>
              <img
                src="https://cdn.iconscout.com/icon/premium/png-256-thumb/penguin-34-548169.png"
                width="60"
                height="60"
                alt=""
              ></img>
              CryptoPenguins
            </div>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                  <div className="btn group">
                    <button
                      onClick={() => {
                        this.changePage({
                          a: true,
                          b: false,
                          c: false,
                          d: false,
                        });
                      }}
                      className="btn btn-danger btn-sm3"
                    >
                      Home Page{" "}
                    </button>
                  </div>
                  <div className="btn group">
                    <button
                      onClick={() => {
                        this.changePage({
                          a: false,
                          b: true,
                          c: false,
                          d: false,
                        });
                      }}
                      className="btn btn-secondary btn-sm3"
                    >
                      All Penguins{" "}
                    </button>
                  </div>
                  <div className="btn group">
                    <button
                      onClick={() => {
                        this.changePage({
                          a: false,
                          b: false,
                          c: true,
                          d: false,
                        });
                      }}
                      className="btn btn-secondary btn-sm3"
                    >
                      My Penguins{" "}
                    </button>
                  </div>
                  <div className="btn group">
                    <button
                      onClick={() => {
                        this.changePage({
                          a: false,
                          b: false,
                          c: false,
                          d: true,
                        });
                      }}
                      className="btn btn-secondary btn-sm3"
                    >
                      Trade{" "}
                    </button>
                  </div>

                  <button className="btn btn-success btn-sm3" id="account">
                    {"Account: " + this.state.account}{" "}
                  </button>
                </li>
              </li>
            </ul>
          </nav>
        </div>
        <div>{page}</div>
        
      </div>
    );
  }
}
export default App;
