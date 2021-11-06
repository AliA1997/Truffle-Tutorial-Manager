pragma solidity 0.8.0;

contract Ownable {
    address public _owner;
    constructor() {
        _owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(isOwner(), "You are not authorized to send payment.");
        _;
    }
    
    function isOwner() public view returns(bool) {
        return (_owner == msg.sender);
    }
}