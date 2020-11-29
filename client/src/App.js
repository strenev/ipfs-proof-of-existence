import React, { Component } from "react";
import IPFSProofOfExistence from "./contracts/IPFSProofOfExistence.json";
import getWeb3 from "./getWeb3";
import { BaseStyles, Button, Input, Loader, Flex, Box, Table, Card, EthAddress, Heading, MetaMaskButton, Icon, Text } from 'rimble-ui'
import ipfs from './ipfs';

import "./App.css";

class App extends Component {
  state = {
    documentsProofCurrentAddress: [],
    web3: null,
    accounts: null,
    contract: null,
    ipfsHash: null,
    fileType: null,
    selectedDocument: null,
    totalProofs: 0,
    loading: false
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = IPFSProofOfExistence.networks[networkId];
      const instance = new web3.eth.Contract(
        IPFSProofOfExistence.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, accounts, contract: instance }, this.fetchVerifiedDocuments);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ fileType: file.type });
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  }

  async connectToMetamsk() {
    if (this.state.web3) {
      alert("You are already connected to Metamask!")
    } else {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = IPFSProofOfExistence.networks[networkId];
      const instance = new web3.eth.Contract(
        IPFSProofOfExistence.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance }, this.fetchVerifiedDocuments);
    }
  }

  async pauseContract() {
    const contract = this.state.contract;
    const account = this.state.accounts[0];
    await contract.methods.pause().send({ from: account });
  }

  async withdraw(withdrawBalance) {
    const contract = this.state.contract;
    const account = this.state.accounts[0];
    await contract.methods.withdrawBalance(withdrawBalance).send({ from: account });
  }

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  }

  fetchVerifiedDocuments = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.checkDocumentsForAddress(accounts[0]).call();
    const totalProofs = await contract.methods.getNumberOfProofs(accounts[0]).call();
    this.setState({ documentsProofCurrentAddress: response, totalProofs: totalProofs });

  };

  async handleClick(event) {
    this.setState({ loading: true });
    const contract = this.state.contract;
    const account = this.state.accounts[0];

    let ipfsResponse = await ipfs.add(this.state.buffer);
    this.setState({ ipfsHash: ipfsResponse.path });

    let timeStamp = new Date();
    let fileType = this.state.fileType;
    let ipfsHash = this.state.ipfsHash;

    await contract.methods.saveProofOfExistence(timeStamp.toLocaleString(), ipfsHash, fileType).send({ from: account, value: this.state.web3.utils.toWei('0.001', "ether") });
    const response = await contract.methods.checkDocumentsForAddress(account).call();
    const totalProofs = await contract.methods.getNumberOfProofs(account).call();

    this.setState({ documentsProofCurrentAddress: response, totalProofs: totalProofs, loading: false });

  }

  render() {
    if (!this.state.web3) {
      return <Loader className="loader" size="40px" />
    }
    return (
      <BaseStyles>
        <div className="App">
          <Flex>
            <Box p={3} width={1 / 4} color="white" bg="primary">
              <Heading as={"h2"}>Total IPFS proofs of existence: {this.state.totalProofs}</Heading>
            </Box>
            <Box p={3} width={1 / 3} color="white" bg="primary">
            </Box>
            <Box p={2} width={5 / 12} color="white" bg="primary">
              <EthAddress address={this.state.accounts[0]} />
            </Box>
          </Flex>
          <Flex>
            <Box p={3} width={1} color="black" bg="white">
              <Card>
                <div className="interaction-buttons">
                  <MetaMaskButton className="submit-button" onClick={this.connectToMetamsk.bind(this)}>Connect with MetaMask</MetaMaskButton>
                  <Input className="submit-button" type="file" onChange={this.captureFile} />
                  <Button className={this.state.fileType ? 'submit-button' : 'disabled'} onClick={this.handleClick.bind(this)} size={'medium'}>
                    Upload proof to contract
            </Button>
                </div>
              </Card>
              <Card>
                {this.state.documentsProofCurrentAddress.length > 0 ? <Table width={1}>
                  <thead>
                    <tr>
                      <th>IPFS hash</th>
                      <th>Doc type</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.documentsProofCurrentAddress.map((item, i) => {
                      return (
                        <React.Fragment key={i}>
                          <tr>
                            <td> <a target="new" href={`https://gateway.ipfs.io/ipfs/` + item.ipfsHash}>{item.ipfsHash}</a></td>
                            <td>{item.documentType}</td>
                            <td>{item.timeStamp}</td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </Table> : <Text className="no-proofs"><Icon name="MoodBad" /><br></br> No proofs found for address. Please upload a file and send it to the contract.</Text>}
              {this.state.loading ? <Loader className="loader" size="40px" /> : null}
              </Card>
            </Box>
          </Flex>
        </div>
      </BaseStyles>
    );
  }
}

export default App;
