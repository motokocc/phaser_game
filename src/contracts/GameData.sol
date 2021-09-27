pragma solidity >=0.4.22 <0.9.0;

contract GameData{
    string public name = "Game Data";
    mapping(address => PlayerData) public players;
    mapping(uint => Card) public cards;
    mapping(address => mapping(uint => Card)) public playerCards;
    uint public playerCount = 0;
    uint public cardCount = 0;
    address payable admin;

    struct PlayerData{
        uint id;
        string playerName;
        address playerAddress;
        uint drawCount;
    }

    struct Card{
        uint id;
        uint rank;
        uint hp;
        uint attack;
        uint speed;     
    }

    event CardCreated(
        uint id,
        uint rank,
        uint hp,
        uint attack,
        uint speed       
    );

    constructor(address payable _admin) public{
        admin = _admin;
    }

    //Draw Card Logic
    function drawCard(string memory _drawType, string memory _playerName) public payable{

        //Draw according to type
        if(keccak256(bytes(_drawType)) == keccak256(bytes("free"))){
            require(players[msg.sender].drawCount <= 0 , 'Seems like this is not your first time playing');
            playerCount++;

            //Set player's Data for the first time in free draw
            players[msg.sender] = PlayerData(playerCount, _playerName, msg.sender, 1);
            generateCharacterRank(1,2);
        }
        else if(keccak256(bytes(_drawType)) == keccak256(bytes("rare"))){
            require(msg.value == 0.1 ether, "Not enough Ether in your wallet");
            admin.transfer(msg.value);
            setPlayerData(_playerName);
            generateCharacterRank(2,4);
        }
        else if(keccak256(bytes(_drawType)) == keccak256(bytes("premium"))){
            require(msg.value == 0.2 ether, "Not enough Ether in your wallet");
            admin.transfer(msg.value);
            setPlayerData(_playerName);
            generateCharacterRank(3,5);
        }
        else{
            return;
        }
    }

    function setPlayerData(string memory _name) internal {
            uint tempCount = players[msg.sender].drawCount + 1;
            uint playerId = players[msg.sender].id;
            players[msg.sender] = PlayerData(playerId, _name, msg.sender, tempCount);
    }

    function generateCharacterRank(uint _minRank, uint _maxRank) internal {
        uint rank = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % _maxRank;
        rank = rank + _minRank;

        if(rank > _maxRank){
            rank = _maxRank;
        }
        
        generateCard(rank);
    }

    function generateCard(uint _rank) internal {
        //For Card Hp
        uint baseHp = 5;
        uint hp = (baseHp + _rank) + uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % _rank;

        //For card id
        cardCount++;

        //For Card attack
        uint attack = _rank + uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % _rank;

        //For speed
        uint speed = _rank;

        Card memory newCardData = Card(cardCount, _rank, hp, attack, speed);

        playerCards[msg.sender][cardCount] = newCardData;
        cards[cardCount] = newCardData;

        emit CardCreated(cardCount, _rank, hp, attack, speed);
    }
}