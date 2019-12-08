pragma solidity ^0.5.11;

contract mapInfo {

    struct city
    {
        string owner;
        bool capital;
        uint32 hp;
        string name;
        uint256 position;
        bool fortress;
        uint32 numberOfsoldiers;
    }

    city[] public mapArray;
}