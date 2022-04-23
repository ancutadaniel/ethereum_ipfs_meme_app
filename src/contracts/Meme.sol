// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Meme {
  string public memeHash;
  address public owner;


  constructor() {
    owner = msg.sender;
  }

  // GET
  function readHash() public view returns (string memory) {
    return memeHash;
  }

  // SET
  function writeHash(string memory _hash) public {
    bytes memory tempEmptyString = bytes(_hash);
    require(tempEmptyString.length > 3, 'should have a correct hash length');
    memeHash = _hash;
  }
}
