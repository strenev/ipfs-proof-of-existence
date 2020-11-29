# IPFS Proof of Existence Final Project for 2020 ConsenSys Blockchain Developer Bootcamp

The IPFS Proof of Existence dApp uploads any type of document to IPFS, gets its hash and stores it on the blockchain. The user can upload a document and also verify whether a document already exists.

The IPFS Proof of Existence directory is a truffle project that contains a solidity contract, migration and test files. It also contains a simple frontend built on React to interact with the contract.

When you interact with the contract you should send at least 0.001 ETH, which is the fee for storing the proof on the blockchain.

# Installation

Install the dependencies:

```sh
$ cd ipfs-proof-of-existence
$ npm install
```

After the dependencies are installed, you should run a local ganache-cli test blockchain on port 8545.
Then run:

```sh
$ truffle compile
$ truffle migrate --reset
```

# Running a local development server

Once the local blockchain is running and the contracts are deployed, you should start a local development server for the frontend
and navigate to http://localhost:3000/

```sh
$ cd client
$ npm start
```

# Testing

To run the truffle tests, make sure also the IPFSProofOfExistenceTestable contract is deployed:

```sh
$ truffle test
```

# Deployed instances

If you want to test the dApp without running it locally, visit: https://ipfs-proof-of-existence.web.app/
You have to be connected to the Rinkeby testnet via Metamask.
