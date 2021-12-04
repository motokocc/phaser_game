// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ElvenHunt is ERC1155, Ownable {
    
    constructor() ERC1155("") {
        //Supply per card rarity(number corresponds to how many stars a card has);
        circulatingSupplyPerItem[1] = [0, 0, 0];
        circulatingSupplyPerItem[2] = [0, 0, 0];   
        circulatingSupplyPerItem[3] = [0, 0, 0];   
        circulatingSupplyPerItem[4] = [0, 0, 0];   
        circulatingSupplyPerItem[5] = [0, 0, 0];      
    }
    
    //Mint Rate per rarity
    uint256 public mintRate_Normal = 0.05 ether;
    uint256 public mintRate_Rare = 0.1 ether;
    uint256 public mintRate_Premium = 0.2 ether;
    
    //CirculatingSupply per item
    mapping(uint256 => uint256[]) public circulatingSupplyPerItem;

    //NFT Marketplace
    uint public itemCounter = 0;
    mapping(uint => Item) public items;
    mapping(address => mapping(uint => uint)) public playerToItemsOnSale;
    mapping(address => uint) public playerToRewardPoints;
    uint public commissionFeePercentage = 3;

    struct Item {
        uint id; // auto generated id
        uint itemId; //id of nft
        uint price; // price for the nft to be sold
        uint available; //no of items available to be sold
        uint sold; // no of items that has been sold
        address payable seller; //seller
        address[] buyers; // people who bought the item 
        bool forSale; //check if item is still on sale
    }
    
     struct Card{
      uint256 id;
      string tokenURI;
    }
    
    event ItemMinted(
      uint256 id,
      uint256 circulatingSupply,
      Card card
    );

    event ItemSold(
        uint id,
        uint itemId, 
        uint price,
        uint available,
        uint sold,
        address payable seller, 
        address[] buyers,
        bool forSale
    );

    event ItemListed(
        uint id,
        uint itemId, 
        uint price, 
        uint available,
        uint sold, 
        address payable seller, 
        address[] buyers,
        bool forSale      
    );


    uint256 randNonce = 0;

    function mintCard(string memory _drawType) public payable {
        
        uint256 amount = 1;
        uint256 mintRate;
        uint256 cardRarity = 5;
        uint256 id = 0;
        
        if(keccak256(bytes(_drawType)) == keccak256(bytes("normal"))){
            mintRate = mintRate_Normal;
            //cardRarity = randomNumberGenerator(1,3);
        }
        else if(keccak256(bytes(_drawType)) == keccak256(bytes("rare"))){
            mintRate = mintRate_Rare;
            //cardRarity = randomNumberGenerator(2,4);
        }
        else if(keccak256(bytes(_drawType)) == keccak256(bytes("premium"))){
            mintRate = mintRate_Premium;
            //cardRarity = randomNumberGenerator(3,5);
        }
        else{
            mintRate = mintRate_Premium;
            //cardRarity = randomNumberGenerator(3,5);
        }
        
        //id = randomNumberGenerator(1, circulatingSupplyPerItem[cardRarity].length) - 1;
         
        require(msg.value >= (amount * mintRate), "Not enough ether sent"); 
        
        uint256 cardId = (cardRarity*100) + id;
        
        string memory uriToken = string(abi.encodePacked("https://jtrajano33.github.io/token_uri/data/",Strings.toString(cardId), ".json"));
        
        _setURI(uriToken);
        
        _mint(msg.sender, cardId, amount, "");
        circulatingSupplyPerItem[cardRarity][id] += amount;
      
        Card memory _card = Card(cardId, uriToken);
        
        emit ItemMinted(cardId, circulatingSupplyPerItem[cardRarity][id], _card);
    }
    
    function randomNumberGenerator(uint256 _minRarity, uint256 _maxRarity) internal returns (uint) {
        //Returns random number from 0 - (_maxRarity - 1)
	    randNonce++;
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % ((_maxRarity + 1) - _minRarity);
        
        // Add the minimum rarity you want
        randomnumber = randomnumber + _minRarity;
 
        return randomnumber;
    }

    function sellItem(uint _itemId, uint _price, uint quantity) public{
        uint itemOnSale = playerToItemsOnSale[msg.sender][_itemId];

        require(msg.sender != address(0), "Not a valid wallet address");
        require(quantity >= 1, "Quantity should be more than 1");
        require(balanceOf(msg.sender, _itemId) >= 1, "You don't have this item to sell");
        require(balanceOf(msg.sender, _itemId) >= quantity, "Not enough item in your wallet to sell");
        require(balanceOf(msg.sender, _itemId) - itemOnSale >= quantity, "You have an existing sale. You can't sell more than what you have");

        itemCounter++;
        Item memory _item = Item(itemCounter, _itemId, _price, quantity, 0, payable(msg.sender), new address[](0), true);
        items[itemCounter] = _item;
        playerToItemsOnSale[msg.sender][_itemId] = itemOnSale + quantity;

        emit ItemListed(itemCounter, _itemId, _price, quantity, 0, payable(msg.sender), new address[](0), true);
    }

    function buyItem(uint _orderId, uint quantity) public payable {        
        address payable _seller = items[_orderId].seller;
        uint _itemId = items[_orderId].itemId;

        require(msg.value >= items[_orderId].price * quantity, "Not enough ether");
        require(msg.sender != address(0), "Not a valid wallet address");
        require(_seller != msg.sender, "Cannot buy your own item on sale");
        require(items[_orderId].forSale, "Sorry, Item is not for sale anymore");
        require(quantity >= 1, "Quantity should be more than 1");
        require(items[_orderId].available >= quantity, "Quantity entered is more than the available quantity being sold" );

        uint salesCommission = (msg.value * commissionFeePercentage) / 100;
        uint netSale = msg.value - salesCommission; 

        _seller.transfer(netSale);
        _safeTransferFrom(_seller, msg.sender, _itemId, quantity, "");

        items[_orderId].buyers.push(msg.sender);
        items[_orderId].available = items[_orderId].available - quantity;
        items[_orderId].sold = items[_orderId].sold + quantity;

        if(items[_orderId].available <= 0){
            items[_orderId].forSale = false;
        }

        playerToItemsOnSale[_seller][_itemId] = playerToItemsOnSale[_seller][_itemId] - quantity;
        playerToRewardPoints[msg.sender] = msg.value;

        emit ItemSold(items[_orderId].id, _itemId, msg.value, quantity, items[_orderId].sold, _seller, items[_orderId].buyers, items[_orderId].forSale);
    }

    function cancelSale(uint _orderId) public {
        require(msg.sender == items[_orderId].seller, "You do not have permission to cancel this sale");
        items[_orderId].forSale = false;
    }

    function withdraw(uint _amount) public onlyOwner{
        require(address(this).balance > 0, "Balance is zero");
        require(address(this).balance>= _amount, "Amount being withdrawn exceeded the total balance stored inside the contract");
        address contractOwner = owner();
        payable(contractOwner).transfer(_amount);
    }

    function changeCommissionFee(uint fee) public onlyOwner{
        commissionFeePercentage = fee;
    } 

    function getTotalContractSales() public view onlyOwner returns(uint amount) {
        return address(this).balance;
    }

}