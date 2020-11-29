// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./IPFSProofOfExistence.sol";

/// @title A contract which inherits from IPFSProofOfExistence contract
/// @author Stanislav Trenev
/// @notice The contract exposes a testable public function, which is internal in the original contract
/// @dev This contract is entirely for testing purposes, so not use in production
contract IPFSProofOfExistenceTestable is IPFSProofOfExistence {
    constructor() public {}

    /// @notice Function which performs the actual storing of proofs in the state and logs an event
    /// @dev Function used only for testing purposes
    /// @param documentOwner The address of the document owner
    /// @param proof Struct entity containing the documentOwner address, ipfs hash and document type
    function storeProof(address documentOwner, DocumentReference memory proof)
        public
    {
        _storeProof(documentOwner, proof);
    }
}
