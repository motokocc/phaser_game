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
    
     struct Card{
      uint256 id;
      uint256 amount;
      uint256 cardRarity;
      string tokenURI;
    }
    
    event ItemMinted(
      uint256 id,
      uint256 cardRarity,
      uint256 amount,
      uint256 circulatingSupply,
      Card card
    );

    mapping(address => mapping(uint256 => Card)) public playerCards;
    mapping(address => uint256) public playerCardsCounter;

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
      
        Card memory _card = Card(cardId, amount, cardRarity, uriToken);

        for(uint256 i = 0; i <= playerCardsCounter[msg.sender]; i++){
            if(cardId == playerCards[msg.sender][i].id){
                _card.amount = amount + playerCards[msg.sender][i].amount;
                playerCards[msg.sender][i] = _card;
                break;
            }
            else if(cardId != playerCards[msg.sender][i].id && playerCardsCounter[msg.sender] == i){
                playerCardsCounter[msg.sender]++;
                playerCards[msg.sender][playerCardsCounter[msg.sender]] = _card;
                break;
            }
        }
        
        emit ItemMinted(cardId, cardRarity, amount, circulatingSupplyPerItem[cardRarity][id], _card);
    }
    
    function randomNumberGenerator(uint256 _minRarity, uint256 _maxRarity) internal returns (uint) {
        //Returns random number from 0 - (_maxRarity - 1)
	    randNonce++;
        uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % ((_maxRarity + 1) - _minRarity);
        
        // Add the minimum rarity you want
        randomnumber = randomnumber + _minRarity;
 
        return randomnumber;
    }
}