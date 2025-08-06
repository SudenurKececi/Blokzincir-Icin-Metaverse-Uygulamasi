// contracts/AssetStorage.sol
pragma solidity ^0.8.18;

contract AssetStorage {
    uint256 public nextId;
    
    struct File {
        string cid;
        string fileName;
        string fileType;
        uint256 fileSize;
        uint256 timestamp;
        address owner;
    }
    
    mapping(uint256 => File) public files;
    mapping(address => uint256[]) public ownerFiles;

    event AssetRegistered(
        uint256 indexed id,
        string cid,
        string fileName,
        uint256 fileSize,
        address owner
    );

    function register(
        string memory cid,
        string memory fileName,
        string memory fileType,
        uint256 fileSize
    ) external returns (uint256 id) {
        id = nextId++;
        files[id] = File({
            cid: cid,
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            timestamp: block.timestamp,
            owner: msg.sender
        });
        ownerFiles[msg.sender].push(id);
        emit AssetRegistered(id, cid, fileName, fileSize, msg.sender);
    }

    function getFile(uint256 id) external view returns (File memory) {
        return files[id];
    }

    function getAllFiles() external view returns (File[] memory) {
        File[] memory allFiles = new File[](nextId);
        for (uint256 i = 0; i < nextId; i++) {
            allFiles[i] = files[i];
        }
        return allFiles;
    }

    function getUserFiles(address user) external view returns (File[] memory) {
        uint256[] storage userFileIds = ownerFiles[user];
        File[] memory userFiles = new File[](userFileIds.length);
        for (uint256 i = 0; i < userFileIds.length; i++) {
            userFiles[i] = files[userFileIds[i]];
        }
        return userFiles;
    }
}