import React, { Component } from "react";
import TutorialManagerContract from "./contracts/TutorialManager.json";
import TutorialContract from "./contracts/Tutorial.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const TutorialState = {
  0: "Not Paid",
  1: "Paid",
  2: "Finished",
};

class App extends Component {
  state = {
    createdTutorial: null,
    loaded: false,
    tutorialPrice: 0.0,
    tutorialId: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = TutorialManagerContract.networks[this.networkId];
      this.tutorialManager = new this.web3.eth.Contract(
        TutorialManagerContract.abi,
        this.deployedNetwork && this.deployedNetwork.address
      );
      this.tutorial = new this.web3.eth.Contract(
        TutorialContract.abi,
        this.deployedNetwork && this.deployedNetwork.address
      );

      this.listenToPayment();
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  listenToPayment = () => {
    this.tutorialManager.events
      .TutorialStateChanges()
      .on("data", async (evt) => {
        console.log("LISTEN TO PAYMENT EVENT:", evt);
        const tutorialItem = await this.tutorialManager.methods
          .tutorials(evt.returnValues._index)
          .call();
        console.log("tutorialItem:", tutorialItem);
        this.setState({ createdTutorial: tutorialItem });
      });
  };

  // payForTutorial = () => {
  //   const { createdTutorial } = this.state;
  //   const tutorial =
  // }

  handleInputChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  };

  createTutorial = async () => {
    const { tutorialId, tutorialPrice } = this.state;
    const result = await this.tutorialManager.methods
      .createTutorial(tutorialPrice, tutorialId)
      .send({ from: this.accounts[0] });
    console.log("RESULT:", result);
  };

  payForTutorial = async (tutorial, tutorialPrice) => {
    const result = await this.web3.eth.sendTransaction({
      to: tutorial,
      from: this.accounts[0],
      gas: 300000,
      value: tutorialPrice,
    });
    console.log("RESULT:", result);
  };

  finishTutorial = async (tutorial) => {
    console.log("createdTutorial", this.tutorialManager);
    console.log("this.tutorial:", this.tutorial);
    this.tutorial._address = tutorial;
    const tutorialIndex = await this.tutorial.methods.index().call();
    const result = await this.tutorialManager.methods
      .finishTutorial(tutorialIndex)
      .send({ from: this.accounts[0] });
    console.log("result:", result);
  };

  render() {
    const { tutorialId, tutorialPrice, createdTutorial } = this.state;
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Create Tutorial!</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <label>Tutorial Id:</label>
          <input
            type="number"
            name="tutorialId"
            onChange={this.handleInputChange}
            value={tutorialId}
          />
          <label>Price In Wei:</label>
          <input
            type="number"
            name="tutorialPrice"
            onChange={this.handleInputChange}
            value={tutorialPrice}
          />
          <button type="button" onClick={this.createTutorial}>
            Create Tutorial
          </button>
        </div>
        {createdTutorial && createdTutorial._tutorialState && (
          <>
            <div>
              The created tutorial value is: {JSON.stringify(createdTutorial)}
            </div>
            <div>
              {" "}
              State of last created tutorial:{" "}
              {TutorialState[createdTutorial._tutorialState]}
            </div>
            {TutorialState[createdTutorial._tutorialState] ==
              TutorialState[0] && (
              <button
                onClick={(_) =>
                  this.payForTutorial(
                    createdTutorial._tutorial,
                    createdTutorial._tutorialPrice
                  )
                }
              >
                Pay for Tutorial
              </button>
            )}
            {TutorialState[createdTutorial._tutorialState] ==
              TutorialState[1] && (
              <button
                onClick={(_) => this.finishTutorial(createdTutorial._tutorial)}
              >
                Finish Tutorial
              </button>
            )}
          </>
        )}
      </div>
    );
  }
}

export default App;
