pragma solidity >=0.4.22 <0.8.0;

contract OracleTask is Ownable {
    uint256 _trustedAnwserNumber;
    string _trustedAwnserString;
    bool _trustedAwnserBool;
    uint256 _latestTimeStamp;
    address taskManager;
    string name;
    
    constructor(string memory n, address tm) {
        name = n;
        taskManager = tm;
    }
    
    event AnswerUpdatedNumber(uint256 indexed timestamp, uint256 answer);
    event AnswerUpdatedString(uint256 indexed timestamp, string answer);
    event AnswerUpdatedBool(uint256 indexed timestamp, bool answer);
    
    function trustedAnwserNumber() public view returns (uint256) {
        return _trustedAnwserNumber;
    }
    
    function trustedAnwserString() public view returns (string memory) {
        return _trustedAwnserString;
    }
    
    function trustedAnwserBool() public view returns (bool) {
        return _trustedAwnserBool;
    }
    
    function latestTimeStamp() public view returns (uint256) {
        return _latestTimeStamp;
    }
    
    function setTrustedAnwserNumber(uint256 data) public onlyOwner returns (bool) {
        _latestTimeStamp = block.timestamp;
        _trustedAnwserNumber = data;
        return true;
    }
    
    function setTrustedAnwserString(string memory data) public onlyOwner returns (bool) {
        _latestTimeStamp = block.timestamp;
        _trustedAwnserString = data;
        return true;
    }
    
    function setTrustedAnwserBool(bool data) public onlyOwner returns (bool) {
        _latestTimeStamp = block.timestamp;
        _trustedAwnserBool = data;
        return true;
    }
    
    function getName() public returns (string memory) {
        return name;
    }

}