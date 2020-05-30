pragma solidity 0.5.16;

import "./ERC721Full.sol";
import "./Ownable.sol";
import "./Pausable.sol";
import "./PenguinAccessControl.sol";


contract Penguin is ERC721Full, PenguinAccessControl{
    struct P {
        uint16 Red;
        uint16 Green;
        uint16 Blue;
        uint32 Id;
        uint32 MamaId;
        uint32 PapaId;
        uint256 Price;
        uint256 CoolDownTime;
    }

    P[] public all_penguins;
    uint16[8] public prob = [10, 9, 8, 7, 7, 8, 9, 10];
    uint32 id = 0; 
    uint256 current_price = 1 ether;
    uint8 mint_count = 0;
    uint8 mint_count_limit = 255;

    mapping(uint32 => bool) has_owner;
    mapping(uint32 => address payable) id_to_owner;
    mapping(uint32 => P) id_to_penguin;
    mapping(uint32 => bool) is_forsale;

    constructor() public ERC721Full("Penguin", "PENGUIN") {
        ceoAddress = msg.sender;
        cfoAddress = msg.sender;
        cooAddress = msg.sender;
    }

    function Mint(address payable _address) public onlyCLevel {
        require((mint_count < mint_count_limit), "Enough!");
        P memory _Penguin;
        _Penguin.Red = 127;
        _Penguin.Green = 127;
        _Penguin.Blue = 127;
        _Penguin.MamaId = 0;
        _Penguin.PapaId = 0;
        _Penguin.Price = current_price;
        _Penguin.Id = id;

        all_penguins.push(_Penguin);

        id_to_penguin[id] = _Penguin;
        id_to_owner[id] = _address;
        has_owner[id] = false;
        is_forsale[id] = true;
        _mint(_address, id);
        setApprovalForAll(address(this), true);
        id = id + 1;
        mint_count = mint_count + 1;
    }

    function BuyPenguin(uint32 _id) public payable {
        require(_exists(_id), "There is no such penguin");//+
        require((is_forsale[_id] == true), "This penguin has an owner!");
        P memory _Penguin = id_to_penguin[_id]; 
        require(
            (msg.value >= _Penguin.Price),
            "You do not have enought money!"
        );

        _transferFrom(id_to_owner[_id], msg.sender, _id);
        id_to_owner[_id].transfer(msg.value);
        is_forsale[_Penguin.Id] = false;
        id_to_owner[_id] = msg.sender;
    }

    //safe math might be necessary
    function SellPenguin(uint32 _id, uint256 _price) public {
        require(id_to_owner[_id] == msg.sender, "You don't own this Penguin");
        require(
            is_forsale[_id] == false,
            "You already put this penguin to the market for sale"
        );
        id_to_penguin[_id].Price = _price;
        all_penguins[_id].Price = _price;
        is_forsale[_id] = true;
    }

    //safe math might be necessary
    function CancelSale(uint32 _id) public {
        require(id_to_owner[_id] == msg.sender, "You don't own this Penguin");
        require(is_forsale[_id] != false, "This penguin is not on the market");
        is_forsale[_id] = false;
    }

    function _generate_random() internal returns (uint16) {

        //// find something else
        
        //RandomNumberGenerator myRng = new RandomNumberGenerator();
        //myRng.updatePrice();
        //return myRng.getInt();
        uint16 num = uint16(uint256(keccak256(abi.encodePacked(all_penguins[id-1].CoolDownTime, id,
            all_penguins[id-1].MamaId,all_penguins[id-1].PapaId))) % 100);
        return num;
    }

    function Breed(uint32 mama_id, uint32 papa_id) public {
        require(
            (id_to_owner[mama_id] == id_to_owner[papa_id]),
            "Mama and papa can't be the same penguin!"
        );
        require(
            (id_to_owner[mama_id] == msg.sender),
            "You are not the owner of the mama penguin!"
        );
        require(
            (id_to_owner[papa_id] == msg.sender),
            "You are not the owner of the papa penguin!"
        );
        /*require((id_to_penguin[mama_id].CoolDownTime == 0), "Mama not ready!");
        require(
            (id_to_penguin[papa_id].CoolDownTime == 0),
            "Papa is not ready!"
        );*/
        require(
            (id_to_penguin[mama_id].CoolDownTime < now),
            "Mama is tired!"
        );
        require(
            (id_to_penguin[papa_id].CoolDownTime < now),
            "Papa is tired!"
        );
        /*require(
            (is_forsale[mama_id] == false),
            "You are selling this mama penguing!"
        );
        require(
            (is_forsale[papa_id] == false),
            "You are selling this papa penguing!"
        );
        */
        id_to_penguin[mama_id].CoolDownTime = now + 4 days;
        id_to_penguin[papa_id].CoolDownTime = now + 4 days;
        P memory mama = id_to_penguin[mama_id];
        P memory papa = id_to_penguin[papa_id];

        uint16 random_number = _generate_random();
        
        uint16 r = (mama.Red + papa.Red) / 64;
        uint16 g = (mama.Green + papa.Green) / 64;
        uint16 b = (mama.Blue + papa.Blue) / 64;

        uint16 _red;
        if (mama.Red >= papa.Red) {
            uint16 temp = (mama.Red - papa.Red);
            uint16 modulo = random_number % (temp + prob[r]);
            _red = papa.Red + modulo - 5;
        } else {
            uint16 temp = (papa.Red - mama.Red);
            uint16 modulo = random_number % (temp + prob[r]);
            _red = mama.Red + modulo - 5;
        }
        if (_red >= 255) {
            _red = 255;
        } else if (_red <= 0) {
            _red = 0;
        }
        /////////////////////////////////////////////////////////
        uint16 _green;
        if (mama.Green >= papa.Green) {
            uint16 temp = (mama.Green - papa.Green);
            uint16 modulo = random_number % (temp + prob[g]);
            _green = papa.Green + modulo - 5;
        } else {
            uint16 temp = (papa.Green - mama.Green);
            uint16 modulo = random_number % (temp + prob[g]);
            _green = mama.Green + modulo - 5;
        }
        if (_green >= 255) {
            _green = 255;
        } else if (_green <= 0) {
            _green = 0;
        }
        /////////////////////////////////////////////////////////
        uint16 _blue;
        if (mama.Blue >= papa.Blue) {
            uint16 temp = (mama.Blue - papa.Blue);
            uint16 modulo = random_number % (temp + prob[b]);
            _blue = papa.Blue + modulo - 5;
        } else {
            uint16 temp = (papa.Blue - mama.Blue);
            uint16 modulo = random_number % (temp + prob[b]);
            _blue = mama.Blue + modulo - 5;
        }
        if (_blue >= 255) {
            _blue = 255;
        } else if (_blue <= 0) {
            _blue = 0;
        }

        P memory _Penguin;

        _Penguin.Red = _red;
        _Penguin.Green = _green;
        _Penguin.Blue = _blue;
        _Penguin.MamaId = mama_id;
        _Penguin.PapaId = papa_id;
        _Penguin.Price = current_price;
        _Penguin.Id = id;

        all_penguins.push(_Penguin);
        id_to_penguin[_Penguin.Id] = _Penguin;
        is_forsale[_Penguin.Id] = false;
        id_to_owner[_Penguin.Id] = msg.sender;
        has_owner[_Penguin.Id] = true;

        _mint(msg.sender, _Penguin.Id);
        id = id + 1;
    }

    function SetCurrentPrice(uint256 _price) public onlyCFO {
        current_price = _price;
    }

    function getID() public view returns (uint32) {
        return id;
    }

    function getCurrentPrice() public view returns (uint256) {
        return current_price;
    }

    function GetterHasOwner(uint32 _id) external view returns (bool) {
        return has_owner[_id];
    }

    function GetterFromIDtoOwner(uint32 _id) external view returns (address) {
        return id_to_owner[_id];
    }

    function GetterFromIDtoPenguinRed(uint32 _id)
        external
        view
        returns (uint16)
    {
        return id_to_penguin[_id].Red;
    }

    function GetterFromIDtoPenguinBlue(uint32 _id)
        external
        view
        returns (uint16)
    {
        return id_to_penguin[_id].Blue;
    }

    function GetterFromIDtoPenguinGreen(uint32 _id)
        external
        view
        returns (uint16)
    {
        return id_to_penguin[_id].Green;
    }

    function GetterIsForSale(uint32 _id) external view returns (bool) {
        bool returner = is_forsale[_id];
        return returner;
    }
    
    function GetterPapaID(uint32 _id) external view returns (uint32){
        return all_penguins[_id].PapaId;
    }
    
    function GetterMamaID(uint32 _id) external view returns (uint32){
        return all_penguins[_id].MamaId;
    }

    function GetterPrice(uint32 _id)external view returns (uint256){
        return all_penguins[_id].Price;
    }
}
