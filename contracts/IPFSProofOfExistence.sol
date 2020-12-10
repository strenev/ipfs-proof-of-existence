// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "../node_modules/@openzeppelin/contracts/utils/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

/// @title A proof of existence contract which stores ipfs hashes, timestamps and document types
/// @author Stanislav Trenev
/// @notice You can use this contract to verify if a document exists
/// @dev All function calls are implemented for the ConsenSys Developer bootcamp. It might not be safe to use it in production environment
contract IPFSProofOfExistence is Pausable, Ownable {
    using SafeMath for uint256;

    struct DocumentReference {
        string timeStamp;
        string ipfsHash;
        string documentType;
    }

    uint256 private totalProofs;
    uint256 private _proofFee = 1000000000000000;
    uint256 private contractBalance;

    mapping(address => DocumentReference[]) private proofs;
    mapping(address => uint256) private proofCount;
    mapping(string => bool) private ipfsHashes;

    event LogDocumentStored(
        address accountAddress,
        string ipfsHash,
        string documentType
    );
    event LogFundsWithdrawal(address accountAddress, uint256 amount);

    constructor() public {}

    /// @notice Internal function which performs the actual storing of proofs in the state and logs an event
    /// @dev Internal function to be called inside the contract
    /// @param documentOwner The address of the document owner
    /// @param proof Struct entity containing the documentOwner address, ipfs hash and document type
    function _storeProof(address documentOwner, DocumentReference memory proof)
        internal
    {
        totalProofs = totalProofs.add(1);
        proofCount[documentOwner] = proofCount[documentOwner].add(1);
        proofs[documentOwner].push(proof);
        ipfsHashes[proof.ipfsHash] = true;
        emit LogDocumentStored(
            documentOwner,
            proof.ipfsHash,
            proof.documentType
        );
    }

    /// @notice Payable function which is called externaly to store a proof. The sender should send ether along with the transaction
    /// @dev External function which is executed when the contract is not paused
    /// @param _timeStamp The timestamp of the stored document
    /// @param _ipfsHash The ipfs hash of the stored document
    /// @param _documentType The document type of the stored document
    function saveProofOfExistence(
        string calldata _timeStamp,
        string calldata _ipfsHash,
        string calldata _documentType
    ) external payable whenNotPaused {
        DocumentReference memory documentProof = DocumentReference({
            timeStamp: _timeStamp,
            ipfsHash: _ipfsHash,
            documentType: _documentType
        });

        require(msg.value >= _proofFee);
        require(ipfsHashExists(_ipfsHash) == false);
        contractBalance = contractBalance.add(msg.value);
        _storeProof(msg.sender, documentProof);
    }

    /// @notice View function to get stored documents for specific address
    /// @param ownerAddress The address of the proof's owner
    /// @return array of proofs
    function checkDocumentsForAddress(address ownerAddress)
        public
        view
        whenNotPaused
        returns (DocumentReference[] memory)
    {
        return proofs[ownerAddress];
    }

    /// @notice Function to pause the contract
    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Function to unpause the contract
    function unpause() public onlyOwner {
        _unpause();
    }

    /// @notice View function to get number of proofs for specific address
    /// @param ownerAddress The address of the proof's owner
    /// @return number of proofs
    function getNumberOfProofs(address ownerAddress)
        public
        view
        returns (uint256)
    {
        return proofCount[ownerAddress];
    }

    /// @notice View function to get the total number of proofs stored by the contract
    /// @return number of total proofs
    function getTotalProofs() public view returns (uint256) {
        return totalProofs;
    }

    /// @notice Function to check whether an ipfs hash already exists
    /// @param ipfsHash The ipfs hash we are checking
    /// @return boolean if the hash is already stored
    function ipfsHashExists(string memory ipfsHash) public view returns (bool) {
        return ipfsHashes[ipfsHash];
    }

    /// @notice Function to withdraw ether stored in the contract, agreggated from fees
    /// @param withdrawAmount The amount to withdraw by the owner of the contract
    function withdrawBalance(uint256 withdrawAmount) external onlyOwner {
        require(withdrawAmount > 0);
        contractBalance = contractBalance.sub(withdrawAmount);
        msg.sender.transfer(withdrawAmount);
        emit LogFundsWithdrawal(msg.sender, withdrawAmount);
    }
}
