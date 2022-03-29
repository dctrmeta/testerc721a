/*SPDX-License-Identifier: MIT

████████████████████████████████████████████████████████████▀███
█─▄─▄─█─█─█▄─▄▄─███▄─▄▄─█▄─██─▄█─▄▄▄─█▄─█─▄█▄─▄█▄─▀█▄─▄█─▄▄▄▄███
███─███─▄─██─▄█▀████─▄████─██─██─███▀██─▄▀███─███─█▄▀─██─██▄─███
▀▀▄▄▄▀▀▄▀▄▀▄▄▄▄▄▀▀▀▄▄▄▀▀▀▀▄▄▄▄▀▀▄▄▄▄▄▀▄▄▀▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀▀▀
█████████████████████████████████████████████████████████████████████████
█▄─▄▄▀█▄─▄█─▄▄▄─█─▄─▄─██▀▄─██─▄─▄─█─▄▄─█▄─▄▄▀███─▄▄▄─█▄─▄███▄─██─▄█▄─▄─▀█
██─██─██─██─███▀███─████─▀─████─███─██─██─▄─▄███─███▀██─██▀██─██─███─▄─▀█
▀▄▄▄▄▀▀▄▄▄▀▄▄▄▄▄▀▀▄▄▄▀▀▄▄▀▄▄▀▀▄▄▄▀▀▄▄▄▄▀▄▄▀▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▄▀▀▄▄▄▄▀▀▄▄▄▄▀▀

*/
pragma solidity ^0.8.0;

import "./ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuckingDictator is ERC721A, Ownable {
    string public PROVENANCE;
    bool public saleIsActive = true;
    string public _baseURIextended = "";

    bool public isFuckListActive = true; 
    uint256 public MAX_SUPPLY = 10000;
    uint256 public MAX_PUBLIC_MINT = 300;
    uint256 public cost = 140000000000000000; // 0.14 ETH 
    uint256 public WLcost = 100000000000000000; //0.1 ETH

    mapping(address => uint256) private _fuckList; // uint8 --> uint256

    constructor() ERC721A("Fucking Dictator Club NFT", "FCDR") {
    }

    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }

    function setWLCost(uint256 _WLcost) public onlyOwner {
        WLcost = _WLcost;
    }

    function setMaxPublicMint(uint256 _n) public onlyOwner {
        MAX_PUBLIC_MINT = _n;
    }

    function setIsFuckListActive(bool _isFuckListActive) external onlyOwner {
        isFuckListActive = _isFuckListActive;
    }

    function setFuckList(address[] calldata addresses, uint8 numAllowedToMint) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            _fuckList[addresses[i]] = numAllowedToMint;
        }
    }

    function numAvailableToMint(address addr) external view returns (uint256) {
        return _fuckList[addr];
    }

    function mintOld(address _to, uint256 _mintAmount) public payable {
        uint256 ts = totalSupply();
        require(saleIsActive, "Sale must be active to mint tokens");
        require(_mintAmount <= MAX_PUBLIC_MINT, "Exceeded max token purchase");
        require(ts + _mintAmount <= MAX_SUPPLY, "Purchase would exceed max tokens");
        require( msg.value >= cost * _mintAmount, "Ether value sent is not correct");

        _safeMint(_to, _mintAmount);
    }

    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 ts = totalSupply();
        require(saleIsActive, "Sale must be active to mint tokens");
        if (isFuckListActive == true && _fuckList[msg.sender] > 0) {
            require(_mintAmount <= _fuckList[msg.sender],"Exceeded max available to purchase");
            require(ts + _mintAmount <= MAX_SUPPLY, "Purchase would exceed max tokens");
            require(msg.value >= WLcost * _mintAmount, "Ether value sent is not correct");

            _fuckList[msg.sender] -= _mintAmount;
            _safeMint(msg.sender, _mintAmount);
        } else {
            require(_mintAmount <= MAX_PUBLIC_MINT, "Exceeded max token purchase");
            require(ts + _mintAmount <= MAX_SUPPLY, "Purchase would exceed max tokens");
            require( msg.value >= cost * _mintAmount, "Ether value sent is not correct");

            _safeMint(_to, _mintAmount);
        }
    }

    function mintFuckListOld(uint8 numberOfTokens) external payable {
        uint256 ts = totalSupply();
        require(isFuckListActive, "Fucklist is not active");
        require(numberOfTokens <= _fuckList[msg.sender],"Exceeded max available to purchase"); // number for WL owner
        require(ts + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max tokens");
        require(msg.value >= WLcost * numberOfTokens, "Ether value sent is not correct");

        _fuckList[msg.sender] -= numberOfTokens;
        _safeMint(msg.sender, numberOfTokens);
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override(ERC721A) returns (string memory) {
        return _baseURIextended;
    }

    function setProvenance(string memory provenance) public onlyOwner {
        PROVENANCE = provenance;
    }

    function reserve(uint256 n) public onlyOwner{
        _safeMint(msg.sender, n);
    }

    function setSaleState(bool newState) public onlyOwner {
        saleIsActive = newState;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}