const IPFSProofOfExistenceTestable = artifacts.require("./IPFSProofOfExistenceTestable.sol");

contract("IPFSProofOfExistenceTestable", accounts => {

  const ipfsHash = "QmdpfRgGwNlzykkQdsgXX3aXfqM7JdLegSXtsimPmsnJD5";
  const timeStamp = new Date().toLocaleString();
  const docType = "image/png";
  const totalProofs = 5;
  const proofFee = 1000000000000000000;

  beforeEach(async () => {
    instance = await IPFSProofOfExistenceTestable.new()
  })

  it("save proof of existence", async () => {
    const ipfsProofoofOfExistenceInstance = await IPFSProofOfExistenceTestable.deployed();

    await ipfsProofoofOfExistenceInstance.saveProofOfExistence(timeStamp, ipfsHash, docType , { from: accounts[0], value: proofFee.toString() });
    const response = await ipfsProofoofOfExistenceInstance.getNumberOfProofs(accounts[0]);

    assert.equal(response, 1, "Error saving proof of existence");
  });

  it("log event when proof is stored", async () => {
    const ipfsProofoofOfExistenceInstance = await IPFSProofOfExistenceTestable.deployed();

    const response = await ipfsProofoofOfExistenceInstance.storeProof(accounts[0], { timeStamp: timeStamp, ipfsHash: ipfsHash, documentType: docType }, { from: accounts[0] });
    const expectedEventResult = { accountAddress: accounts[0], ipfsHash: ipfsHash, documentType: docType };

    const logAccountAddress = response.logs[0].args.accountAddress;
    const logIpfsHash = response.logs[0].args.ipfsHash;
    const logDocumentType = response.logs[0].args.documentType;

    assert.equal(expectedEventResult.accountAddress, logAccountAddress, "LogDocumentStored event accountAddress property not emitted, check saveProof method");
    assert.equal(expectedEventResult.ipfsHash, logIpfsHash, "LogDocumentStored event ipfsHash property not emitted, check saveProof method");
    assert.equal(expectedEventResult.documentType, logDocumentType, "LogDocumentStored event documentType property not emitted, check saveProof method");
  });

  it("ipfs hash exists", async () => {
    const ipfsProofoofOfExistenceInstance = await IPFSProofOfExistenceTestable.deployed();

    await ipfsProofoofOfExistenceInstance.storeProof(accounts[0], { timeStamp: timeStamp, ipfsHash: ipfsHash, documentType: docType }, { from: accounts[0] });
    const ipfsHashExists = await ipfsProofoofOfExistenceInstance.ipfsHashExists(ipfsHash);

    assert.equal(ipfsHashExists, true, "Error checking ipfs hash");
  });

  it("check documents for address", async () => {
    const ipfsProofoofOfExistenceInstance = await IPFSProofOfExistenceTestable.deployed();

    await ipfsProofoofOfExistenceInstance.storeProof(accounts[0], { timeStamp: timeStamp, ipfsHash: ipfsHash, documentType: docType }, { from: accounts[0] });
    const response = await ipfsProofoofOfExistenceInstance.checkDocumentsForAddress(accounts[0]);

    assert.equal(response[0].ipfsHash, ipfsHash, "Error checking for document address");
  });

  it("get total proofs", async () => {
    const ipfsProofoofOfExistenceInstance = await IPFSProofOfExistenceTestable.deployed();

    await ipfsProofoofOfExistenceInstance.storeProof(accounts[0], { timeStamp: timeStamp, ipfsHash: ipfsHash, documentType: docType }, { from: accounts[0] });
    const response = await ipfsProofoofOfExistenceInstance.getTotalProofs();

    assert.equal(response, totalProofs, "Error getting total proofs");
  });

});
