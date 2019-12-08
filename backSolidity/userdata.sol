pragma solidity ^0.5.11;

import "./mapdata.sol";

contract userStatus is mapInfo {

    struct userData
    {
        address ethereumAccount;
        string userID;
        string userPassword;

        bool survival;
        uint32 money;
        uint256 taxTime;
    }

    userData[] internal users;
}