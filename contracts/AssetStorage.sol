// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// contracts/AssetStorage.sol
pragma solidity ^0.8.18;

/// @title AssetStorage
/// @notice IPFS CID’lerini zincirde saklamak için minimal kontrat
contract AssetStorage {
    uint256 public nextId;
    mapping(uint256 => string) public cids;

    event AssetRegistered(uint256 indexed id, string cid);

    function register(string calldata cid) external returns (uint256 id) {
        id = nextId;
        cids[id] = cid;
        emit AssetRegistered(id, cid);
        nextId++;
    }
}
